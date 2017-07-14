import express from 'express';
import graphqlHttp from 'express-graphql';
import { log } from '../utilities/logging';
import '../utilities/initialiseExternalServices';
import schema from '../api/graphQlSchemas/accountSignup';
import config from '../config/application';
import readAccountSignup from '../api/queries/readAccountSignup';
import createAccountSignup from '../api/mutations/createAccountSignup';

const root = {
  accountSignup: readAccountSignup,
  createAccountSignup,
};

function start() {
  const app = express();
  app.use('/graphql', graphqlHttp({
    schema,
    rootValue: root,
    graphiql: true,
  }));
  return new Promise((resolve, reject) => {
    try {
      app.listen(config.app.graphQlPort, () => {
        log.info(`GraphQl on localhost:${config.app.graphQlPort}/graphql`);
        resolve(app);
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
