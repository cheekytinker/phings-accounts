import { describe, it, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import elasticsearch from 'elasticsearch';
import shortid from 'shortid';
import config from '../../../src/config/application';

const expect = chai.expect;
chai.use(dirtyChai);

describe('integration', () => {
  describe('elasticSearchSpecs', () => {
    describe('when creating an index', () => {
      let indexName = null;
      let client = null;
      beforeEach(() => {
        client = elasticsearch.Client({
          appVersion: '1.7',
          host: config.app.searchHost,
          log: {
            type: 'file',
            level: 'debug',
          },
        });
        indexName = shortid.generate().toLowerCase();
      });
      afterEach((done) => {
        client.indices
          .delete({ index: indexName })
          .then(() => {
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('should be able to create an index', (done) => {
        client.indices.create({
          index: indexName,
        })
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
      }).timeout(10000);
      it('should create document in index', (done) => {
        const docType = 'Event';
        const docId = 1;
        client.indices.create({
          index: indexName,
        })
        .then(() =>
          client.create({
            index: indexName,
            type: docType,
            id: docId,
            body: {
              name: 'Anthony Hollingsworth',
              email: 'phings@cheekytinker.com',
            },
          }),
        )
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
      });
      it('should allow search for document after async index is called', (done) => {
        const docType = 'Event';
        const docId = '1';
        client.indices.create({
          index: indexName,
        })
        .then(() =>
          client.indices.putMapping({
            index: indexName,
            type: docType,
            body: {
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
              },
            },
          }),
        )
        .then(() =>
          client.index({
            index: indexName,
            type: docType,
            id: docId,
            body: {
              name: 'Anthony Hollingsworth',
              email: 'phings@cheekytinker.com',
            },
          }),
        )
        .then(() =>
          client.index({
            index: indexName,
            type: docType,
            id: docId,
            body: {
              name: 'Anthony Hollingsworth',
              email: 'phings@cheekytinker.com',
            },
          }),
        )
        .then(() => new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        }))
        .then(() => client.search({
          index: indexName,
          type: docType,
          q: 'name:anthony',
        }))
        .then((result) => {
          const { hits: { hits: [{ _source }] } } = result;
          expect(_source).to.deep.equal({
            email: 'phings@cheekytinker.com',
            name: 'Anthony Hollingsworth',
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
      }).timeout(5000);
    });
  });
});
