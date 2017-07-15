import express from 'express';
import graphqlHttp from 'express-graphql';
import { log } from '../utilities/logging';
import schema from '../api/graphQlSchemas/accountSignup';
import config from '../config/application';
import readAccountSignup from '../api/queries/readAccountSignup';
import createAccountSignup from '../api/mutations/createAccountSignup';

const root = {
  accountSignup: readAccountSignup,
  createAccountSignup,
};

let server = null;

function start() {
  server = express();
  server.use('/graphql', graphqlHttp({
    schema,
    rootValue: root,
    graphiql: true,
  }));
  return new Promise((resolve, reject) => {
    try {
      const graphServer = server.listen(config.app.graphQlPort, () => {
        log.info(`GraphQl on localhost:${config.app.graphQlPort}/graphql`);
        resolve(graphServer);
      });
    } catch (err) /* istanbul ignore next */ {
      log.error(err);
      reject(err);
    }
  });
}

module.exports = {
  graphQlServerStart: start,
};
