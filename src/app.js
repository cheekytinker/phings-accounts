import restify from 'restify';
import SwaggerRestify from 'swagger-restify-mw';
import viewmodel from 'viewmodel';
import msgBus from './mbusDomain';
import { log } from './utilities/logging';
import './utilities/initialiseExternalServices';
import appConfig from './config/application';
import config from './config/denormalizer';
import { domain } from './cqrsDomain';
import { readDomain } from './cqrsReadDomain';


export default function start() {
}

log.info('starting');
const server = restify.createServer({
  name: appConfig.app.name,
  version: appConfig.app.version,
});

const swaggerConfig = {
  appRoot: __dirname,
  swaggerFile: `${__dirname}/config/swagger/swagger.yaml`,
};
log.info(config);

readDomain.onEvent((evnt) => {
  log.info(`read domain received event ${evnt.name}`);
  //let the client know the view has changed - sockets
  //msgBus.emitEvent(evnt);
});

readDomain.onNotification((not) => {
  log.info(`read domain emitted notification ${not}`);
  //msgBus.emitNotification(not);
});

readDomain.onEventMissing((evnt) => {
  log.info(`read domain missing event ${evnt}`);
});

viewmodel.read(config.repository, (err, repository) => {
  readDomain.init((err2, warnings2) => {
    if (warnings2) {
      log.info(`Warnings ${warnings2}`);
      throw new Error('Cqrs Read Domain failed to start');
    }
    if (err2) {
      log.info(`Read Domain Error ${err2}`);
      return;
    }
    domain.init((err3, warnings) => {
      if (warnings) {
        log.info(`Warnings ${warnings}`);
        throw new Error('Cqrs Domain failed to start');
      }
      if (err3) {
        log.info(`Cqrs Domain Error ${err}`);
        return;
      }
      msgBus.onEvent((evt) => {
        log.info(`bus raised event ${evt.name}`);
        readDomain.handle(evt);
      });
      msgBus.onCommand((cmd) => {
        log.info(`received command ${cmd.name}`);
        domain.handle(cmd);
      });
      domain.onEvent((event) => {
        log.info(`domain raised event ${event.name}`);
        msgBus.emitEvent(event);
      });
      const info = domain.getInfo();
      log.info(info);
      SwaggerRestify.create(swaggerConfig, (swaggerErr, swaggerRestify) => {
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
  });
});
export const app = server;
