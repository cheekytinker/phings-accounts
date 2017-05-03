const config = {
  app: {
    name: process.env.APPLICATION_NAME || 'unknown',
    logDir: process.env.APPLICATION_LOG_DIR || './log',
    logLevel: process.env.APPLICATION_LOG_LEVEL || 'info',
  },
};

export default config;
