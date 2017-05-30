import restify from 'restify';
import SwaggerRestify from 'swagger-restify-mw';
import msgBus from './mbusDomain';
import { log } from './utilities/logging';
import './utilities/initialiseExternalServices';
import appConfig from './config/application';
import { domain } from './cqrsDomain';


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
log.info(config);

domain.init((err, warnings) => {
  if (warnings) {
    log.info(`Warnings ${warnings}`);
    throw new Error('Cqrs Domain failed to start');
  }
  if (err) {
    log.info(`Error ${err}`);
    return;
  }
  msgBus.onCommand((cmd) => {
    log.info(`received command ${cmd}`);
    domain.handle(cmd);
  });
  domain.onEvent((event) => {
    log.info(`received event ${event}`);
    msgBus.emitEvent(event);
  });
  const info = domain.getInfo();
  log.info(info);

  SwaggerRestify.create(config, (swaggerErr, swaggerRestify) => {
    log.info('Restify started');
    /* istanbul ignore next */
    if (swaggerErr) {
      log.error(swaggerErr);
      throw swaggerErr;
    }

    swaggerRestify.register(server);

    const port = process.env.PORT || 10010;
    server.listen(port, () => {
      log.info(`Listening on port ${port}`);
    });
  });
});

export const app = server;
