import restify from 'restify';
import SwaggerRestify from 'swagger-restify-mw';
import viewmodel from 'viewmodel';
import promisify from 'es6-promisify';
import msgBus from './mbusDomain';
import { log } from './utilities/logging';
import './utilities/initialiseExternalServices';
import appConfig from './config/application';
import config from './config/denormalizer';
import { domain, reset } from './cqrsDomain';
import cqrsReadDomain from './cqrsReadDomain';
import { graphQlServerStart } from './graphQl/server';

let started = false;
const server = restify.createServer({
  name: appConfig.app.name,
  version: appConfig.app.version,
});

//  err, repository - how to use this repository
function startRestServer(swaggerRestify) {
  log.info('Restify started');
  swaggerRestify.register(server);

  /* istanbul ignore next */
  server.use((errX, req, res, next) => {
    log.error(errX.stack);
    res.status(500).send('Something broke!');
    next();
  });
  const port = process.env.PORT || 10010;
  graphQlServerStart();
  server.listen(port, () => {
    log.info(`Listening on port ${port}`);
  });
  /* istanbul ignore next */
  server.on('InternalServer', (req, res, intErr, cb) => cb());
  /* istanbul ignore next */
  server.on('uncaughtException', (serverErr) => {
    log.info(`Uncaught server exception ${serverErr}`);
  });
  /* istanbul ignore next */
  process.on('uncaughtException', (procErr) => {
    log.info(`Uncaught process exception ${procErr}`);
  });
  return Promise.resolve();
}

let cb = null;

function setupDomainHandlers(dom, readDomainInst) {
  const domainInfo = dom.getInfo();
  log.info(`Domain Info ${domainInfo}`);
  /* istanbul ignore next */
  msgBus.onEvent((evt) => {
    log.info(`bus raised event ${evt.name}`);
    readDomainInst.handle(evt);
    if (cb) {
      cb(evt);
    }
  });
  /* istanbul ignore next */
  msgBus.onCommand((cmd) => {
    log.info(`received command ${cmd.name}`);
    dom.handle(cmd);
    if (cb) {
      cb(cmd);
    }
  });
  /* istanbul ignore next */
  dom.onEvent((event) => {
    log.info(`domain raised event ${event.name}`);
    msgBus.emitEvent(event);
    if (cb) {
      cb(event);
    }
  });
  const info = dom.getInfo();
  log.info(info);
}

function regsiterReadDomainEvents() {
  /*
   readDomainInst.onEvent((evnt) => {
   log.info(`read domain received event ${evnt.name}`);
   //  let the client know the view has changed - sockets
   //  msgBus.emitEvent(evnt);
   });

   readDomainInst.onNotification((not) => {
   log.info(`read domain emitted notification ${not}`);
   //  msgBus.emitNotification(not);
   });

   readDomainInst.onEventMissing((evnt) => {
   log.info(`read domain missing event ${evnt}`);
   });
   */
}

function swaggerRestifyCreate() {
  log.info('Starting swaggerRestifyCreate');
  const swaggerConfig = {
    appRoot: __dirname,
    swaggerFile: `${__dirname}/config/swagger/swagger.yaml`,
  };
  log.info(config);
  return new Promise((resolve, reject) => {
    SwaggerRestify.create(swaggerConfig, (err, swaggerRestify) => {
      /* istanbul ignore next */
      if (err) {
        log.info(`Error in swaggerRestifyCreate ${err}`);
        return reject(err);
      }
      log.info('swaggerRestifyCreate successful');
      return resolve(swaggerRestify);
    });
  });
}

function startCommandDomain(readDomainInst) {
  reset();
  const dom = domain();
  return new Promise((resolve, reject) => {
    dom.init((err, warnings) => {
      /* istanbul ignore next */
      if (err) {
        log.error(`Cqrs Domain failed to start ${err}`);
        reject(`Cqrs Domain failed to start ${err}`);
      }
      /* istanbul ignore next */
      if (warnings) {
        log.error(`Cqrs Domain warnings on start ${warnings}`);
        reject(`Cqrs Domain warnings on start ${warnings}`);
      }
      log.info('Setup domain handlers');
      setupDomainHandlers(dom, readDomainInst);
      started = true;
      resolve();
    });
  })
  .then(() => {
    log.info('Call restify create');
    return swaggerRestifyCreate();
  })
  .then((swaggerRestify) => {
    log.info('About to start rest server');
    return startRestServer(swaggerRestify);
  });
}

function startServer() {
  /* istanbul ignore next */
  if (started) {
    log.info('Server already started');
    return Promise.resolve();
  }
  log.info('starting');
  const viewModelRead = promisify(viewmodel.read);
  let readDomainInst = null;
  return viewModelRead(config.repository)
      .then(() => {
        readDomainInst = cqrsReadDomain.readDomain();
        regsiterReadDomainEvents();
        return new Promise((resolve, reject) => {
          try {
            readDomainInst.init(() => {
              resolve();
            });
          } catch (err) {
            /* istanbul ignore next */
            reject(err);
          }
        });
      })
      .then((warnings) => {
        /* istanbul ignore next */
        if (warnings) {
          log.error(`Warnings ${warnings}`);
          return Promise.reject('Cqrs Read Domain failed to start');
        }
        return startCommandDomain(readDomainInst);
      });
}

export default {
  server,
  start: (callback) => {
    cb = callback;
    return startServer();
  },
};
