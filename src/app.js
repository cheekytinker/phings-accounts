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

function startListening() {
  return new Promise((resolve, reject) => {
    try {
      server.listen(appConfig.app.restPort, () => {
        log.info(`Listening on port ${appConfig.app.restPort}`);
        resolve();
      });
    } catch (err) /* istanbul ignore next */ {
      log.error(err);
      reject(err);
    }
  });
}

//  err, repository - how to use this repository
async function startRestServer(swaggerRestify) {
  log.info('Restify started');
  swaggerRestify.register(server);
  /* istanbul ignore next */
  server.use((errX, req, res, next) => {
    log.error(errX.stack);
    res.status(500).send('Something broke!');
    next();
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
  await graphQlServerStart();
  await startListening();
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

async function swaggerRestifyCreate() {
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

async function startCommandDomain(readDomainInst) {
  reset();
  const dom = domain();
  await new Promise((resolve, reject) => {
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
  });
  log.info('Call restify create');
  const swaggerRestify = await swaggerRestifyCreate();
  log.info('About to start rest server');
  await startRestServer(swaggerRestify);
}

async function initReadDomain() {
  return new Promise((resolve, reject) => {
    try {
      const readDomainInst = cqrsReadDomain.readDomain();
      regsiterReadDomainEvents();
      readDomainInst.init((warnings) => {
        /* istanbul ignore next */
        if (warnings) {
          log.error(`Warnings ${warnings}`);
          reject('Cqrs Read Domain failed to start');
        }
        resolve(readDomainInst);
      });
    } catch (err) {
      /* istanbul ignore next */
      reject(err);
    }
  });
}

async function startServer() {
  /* istanbul ignore next */
  if (started) {
    log.info('Server already started');
    return;
  }
  log.info('starting');
  const viewModelRead = promisify(viewmodel.read);
  await viewModelRead(config.repository);
  const readDomainInst = await initReadDomain();
  await startCommandDomain(readDomainInst);
}

export default {
  server,
  start: (callback) => {
    cb = callback;
    return startServer();
  },
};
