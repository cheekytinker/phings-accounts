const config = {
  app: {
    name: process.env.APPLICATION_NAME || 'phings-accounts',
    version: process.env.APPLICATION_VERSION || '0.1.0',
    logDir: process.env.APPLICATION_LOG_DIR || './log',
    logLevel: process.env.APPLICATION_LOG_LEVEL || 'warn',
    dbHost: process.env.DB_HOST || 'localhost',
    readDbHost: process.env.READ_DB_HOST || 'localhost',
    readDbPort: process.env.READ_DB_PORT || '27017',
    readDbName: process.env.READ_DB_NAME || 'phings-accounts-read',
    mongoRepository: process.env.PHINGS_ACCOUNTS_REPOSITORY || 'phings-accounts',
    amqpHost: process.env.PHINGS_AMQP_HOST || 'amqp://localhost:5672',
    defaultQueue: 'phings-accounts',
  },
};

export default config;
