import { describe, it, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import elasticsearch from 'elasticsearch';
import shortid from 'shortid';
import request from 'superagent';
import config from '../../../src/config/application';

const expect = chai.expect;
chai.use(dirtyChai);

function search(indexName, docType, params) {
  return new Promise((resolve, reject) => {
    request.post(`${config.app.searchHost}/${indexName}/${docType}/_search`)
      .send(params)
      .set('accept', 'application/json')
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res.body);
      });
  });
}

describe.skip('integration', () => {
  describe('elasticSearch', () => {
    describe('when searching with gas', () => {
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
                  objectId: { type: 'string' },
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
                objectId: '1234',
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
                objectId: '1234',
              },
            }),
          )
          .then(() => new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          }))
          .then(() => search(indexName, docType, {
            query: {
              term: { name: 'anthony' },
            },
            'gas-filter': {
              name: 'SearchResultCypherFilter',
              query: 'MATCH (n:User)-[r:LIKES]->(m) WITH m, avg(r.rate) as avg_rate where avg_rate < 3 RETURN m.objectId as id',
              exclude: true,
              keyProperty: 'objectId',
            },
          }))
          .then((result) => {
            const { hits: { hits: [{ _source }] } } = result;
            expect(_source).to.deep.equal({
              email: 'phings@cheekytinker.com',
              name: 'Anthony Hollingsworth',
              objectId: '1234',
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
