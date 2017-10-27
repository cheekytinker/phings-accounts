import dotenv from 'dotenv';

dotenv.config();

const config = {
  app: {
    name: process.env.APPLICATION_NAME || 'phings-accounts',
    version: process.env.APPLICATION_VERSION || '0.1.0',
    logDir: process.env.APPLICATION_LOG_DIR || './log',
    logLevel: process.env.APPLICATION_LOG_LEVEL || 'warn',
    restHost: process.env.REST_HOST || 'localhost',
    restPort: process.env.REST_PORT || '10010',
    graphQlPort: process.env.GRAPHQL_PORT || '4000',
    dbHost: process.env.DB_HOST || 'localhost',
    readDbHost: process.env.READ_DB_HOST || 'localhost',
    readDbPort: process.env.READ_DB_PORT || '27017',
    readDbName: process.env.READ_DB_NAME || 'phings-accounts-read',
    mongoRepository: process.env.PHINGS_ACCOUNTS_REPOSITORY || 'phings-accounts',
    amqpHost: process.env.PHINGS_AMQP_HOST || 'amqp://localhost:5672',
    defaultQueue: 'phings-accounts',
    searchHost: process.env.SEARCH_HOST || 'localhost:9200',
    graphDbHost: process.env.GRAPH_DB_HOST || 'http://localhost:7474',
    sagaDbHost: process.env.SAGA_DB_HOST || 'localhost',
    sagaDbPort: process.env.SAGA_DB_PORT || '27017',
    sagaDbName: process.env.SAGA_DB_NAME || 'phings-accounts-saga',
    cacheHost: process.env.CACHE_HOST || 'localhost',
    cachePort: process.env.CACHE_PORT || '6379',
    cachePrefix: process.env.CACHE_PREFIX ||
      `${(process.env.APPLICATION_NAME || 'phings-accounts')}_`,
  },
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY || 'key-25101ab8baae7cb6c615ad5d776aa7f2',
    domain: process.env.MAILGUN_DOMAIN || 'sandboxaedc7f48ed604c4ba0ab06201f222606.mailgun.org',
  },
};

export default config;
