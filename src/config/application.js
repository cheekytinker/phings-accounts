const config = {
  app: {
    name: process.env.APPLICATION_NAME || 'phings-accounts',
    version: process.env.APPLICATION_VERSION || '0.1.0',
    logDir: process.env.APPLICATION_LOG_DIR || './log',
    logLevel: process.env.APPLICATION_LOG_LEVEL || 'warn',
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
  },
};

export default config;
