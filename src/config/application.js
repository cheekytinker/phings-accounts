const config = {
  app: {
    name: process.env.APPLICATION_NAME || 'phings-accounts',
    version: process.env.APPLICATION_VERSION || '0.1.0',
    logDir: process.env.APPLICATION_LOG_DIR || './log',
    logLevel: process.env.APPLICATION_LOG_LEVEL || 'info',
    dbHost: process.env.DB_HOST || 'localhost',
    mongoRepository: process.env.PHINGS_ACCOUNTS_REPOSITORY || 'phings-accounts',
  },
};

export default config;
