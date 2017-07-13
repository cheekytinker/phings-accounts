import { describe, it, before } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import neo4j from 'neo4j';
import config from '../../../src/config/application';

const expect = chai.expect;
chai.use(dirtyChai);

describe('integration', () => {
  describe('neo4jSpecs', () => {
    describe('when searching in an index', () => {
      let db = null;
      before(() => {
        db = new neo4j.GraphDatabase(config.app.graphDbHost);
      });
      it('should find using match', (done) => {
        db.cypher({
          query: 'MATCH (n:User)-[r:LIKES]->(m) WITH m, avg(r.rate) as avg_rate where avg_rate < 3 RETURN m',
          params: {
          },
        }, (err, results) => {
          if (err) {
            done(err);
          }
          const [result] = results;
          expect(result.m._id).to.equal(1393);
          done();
        });
      });
    });
  });
});
