const newman = require('newman');
const app = require('./build/app');
const collection = require('./test/acceptance/postman/postman_collection.json');
const environment = require('./test/acceptance/postman/postman_environment.json');

app.default
  .start()
  .then(() => {
    newman.run({
      collection,
      reporters: ['cli', 'html', 'junit'],
      reporter: {
        junit: { export: './testoutput/postmanXmlResults.xml' },
        html: { export: './testoutput/postmanHtmlResults.html' },
      },
      environment,
    }, (err, summary) => {
      if (err) {
        process.exit(1);
        throw err;
      }
      if (summary.run.failures.length !== 0) {
        process.exit(-1);
      }
      process.exit(0);
    });
  });

