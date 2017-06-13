import express from 'express';
import graphqlHttp from 'express-graphql';
import { log } from '../utilities/logging';
import '../utilities/initialiseExternalServices';
import { schema } from '../api/graphQlSchemas/accountSignup';
import { readAccountSignup } from '../api/queries/readAccountSignup';

const root = {
  accountSignup: readAccountSignup,
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
