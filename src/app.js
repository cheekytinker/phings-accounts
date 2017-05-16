import restify from 'restify';
import SwaggerRestify from 'swagger-restify-mw';
import { log } from './utilities/logging';
import './utilities/initialiseExternalServices';
import appConfig from './config/application';

export default function start() {
}

log.info('starting');
const server = restify.createServer({
  name: appConfig.app.name,
  version: appConfig.app.version,
});

const config = {
  appRoot: __dirname,
  swaggerFile: `${__dirname}/config/swagger/swagger.yaml`,
};
console.log(config);
SwaggerRestify.create(config, (err, swaggerRestify) => {
  log.info('Restify started');
  /* istanbul ignore next */
  if (err) {
    log.error(err);
    throw err;
  }

  swaggerRestify.register(server);

  const port = process.env.PORT || 10010;
  server.listen(port, () => {
    log.info(`Listening on port ${port}`);
  });
});

export const app = server;
