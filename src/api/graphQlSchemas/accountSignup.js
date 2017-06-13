import { buildSchema } from 'graphql';
/***

import {

  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLSchema,
  GraphQLInterfaceType,
} from 'graphql/type';

const entityInterface = new GraphQLInterfaceType({
  name: 'Entity',
  description: 'An entity',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'id',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name',
    },
  }),
  resolveType(entity) {
    if (entity.type === 'AccountSignup') {
      return accountSignupType;
    }
    return null;
  },
});

const accountSignupType = new GraphQLObjectType({
  name: 'AccountSignup',
  description: 'An account signup process',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'account id',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Account Name',
    },
  }),
  interfaces: [entityInterface],
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    accountSignup: {
      type: entityInterface,
      args: {
        name: {
          type: GraphQLString,
        },
      },
    },
  }),
});

const AccountSignupSchema = new GraphQLSchema({
  query: queryType,
  types: [accountSignupType],
});

**/

const schema = buildSchema(`
  type AccountSignup {
    key: String
    name: String
    status: String
  }
  type Query {
    accountSignup(key: String): AccountSignup
  }
`);

export {
  schema,
}