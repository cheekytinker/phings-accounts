import { describe, it, beforeEach, afterEach } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import elasticsearch from 'elasticsearch';
import shortid from 'shortid';
import mochaAsync from '../../helpers/mochaAsync';
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
      afterEach(mochaAsync(async () => {
        await client.indices.delete({ index: indexName });
      }));
      it('should be able to create an index', mochaAsync(async () => {
        await client.indices.create({
          index: indexName,
        });
      })).timeout(10000);
      it('should create document in index', mochaAsync(async () => {
        const docType = 'Event';
        const docId = 1;
        await client.indices.create({
          index: indexName,
        });
        await client.create({
          index: indexName,
          type: docType,
          id: docId,
          body: {
            name: 'Anthony Hollingsworth',
            email: 'phings@cheekytinker.com',
          },
        });
      }));
      it.skip('should allow search for document after async index is called', mochaAsync(async () => {
        const docType = 'Event';
        const docId = '1';
        await client.indices.create({
          index: indexName,
        });
        await client.indices.putMapping({
          index: indexName,
          type: docType,
          body: {
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
        });
        await client.index({
          index: indexName,
          type: docType,
          id: docId,
          body: {
            name: 'Anthony Hollingsworth',
            email: 'phings@cheekytinker.com',
          },
        });
        await client.index({
          index: indexName,
          type: docType,
          id: docId,
          body: {
            name: 'Anthony Hollingsworth',
            email: 'phings@cheekytinker.com',
          },
        });
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 5000);
        });
        const result = await client.search({
          index: indexName,
          type: docType,
          q: 'name:anthony',
        });
        const { hits: { hits: [{ _source }] } } = result;
        expect(_source).to.deep.equal({
          email: 'phings@cheekytinker.com',
          name: 'Anthony Hollingsworth',
        });
      }));
    });
  });
});
