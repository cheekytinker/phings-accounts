import { describe, it, before } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import neo4j from 'neo4j';
import config from '../../../src/config/application';

const expect = chai.expect;
chai.use(dirtyChai);

function cypher(db, queryOptions) {
  return new Promise((resolve, reject) => {
    db.cypher(queryOptions, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
}

describe('integration', () => {
  describe('neo4jSpecs', () => {
    describe('when searching in an index', () => {
      let db = null;
      before(() => {
        db = new neo4j.GraphDatabase(config.app.graphDbHost);
      });
      it('should find using match', (done) => {
        cypher(db, {
          query: 'MERGE (n:User {objectId:100000, name:"Fred"})',
        })
        .then(() => cypher(db, {
          query: 'MATCH (n:User) WHERE n.name = "Fred" RETURN n',
          params: {},
        }))
        .then((results) => {
          const [result] = results;
          expect(result.n.properties.objectId).to.equal(100000);
          done();
        })
        .catch((err) => {
          done(err);
        });
      }).timeout(5000);
    });
  });
});
