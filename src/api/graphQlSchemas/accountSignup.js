import { buildSchema } from 'graphql';

const schema = buildSchema(`
  input PrimaryContact {
    userName: String!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  
  input AccountSignupInput {
      name: String!
      primaryContact: PrimaryContact!
  }
  type AccountSignup {
    key: String!
    name: String!
    status: String
  }
  type Query {
    accountSignup(key: String): AccountSignup
  }
  type Mutation {
    createAccountSignup(input: AccountSignupInput) : AccountSignup
  }
`);

export default schema;

/** *

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
  description: 'An accountSignup signup process',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'accountSignup id',
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
