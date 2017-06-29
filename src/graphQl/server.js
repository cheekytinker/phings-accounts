import express from 'express';
import graphqlHttp from 'express-graphql';
import { log } from '../utilities/logging';
import '../utilities/initialiseExternalServices';
import schema from '../api/graphQlSchemas/accountSignup';
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
  app.listen(4000, () => log.info('Now browse to localhost:4000/graphql'));
}

module.exports = {
  graphQlServerStart: start,
};
