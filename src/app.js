import path from 'path';
import restify from 'restify';
import SwaggerRestify from 'swagger-restify-mw';
import viewmodel from 'viewmodel';
import promisify from 'es6-promisify';
import msgBus from './mbusDomain';
import { log } from './utilities/logging';
import appConfig from './config/application';
import config from './config/denormalizer';
import { domain as cqrsDomain, reset as cqrsReset } from './cqrsDomain';
import { domain as cqrsSagaDomain, reset as cqrsSagaReset } from './cqrsSagaDomain';
import cqrsReadDomain from './cqrsReadDomain';
import { graphQlServerStart } from './graphQl/server';

let started = false;
let graphServer = null;
let server = null;

function restServer() {
  if (server) {
    return server;
  }
  server = restify.createServer({
    name: appConfig.app.name,
    version: appConfig.app.version,
  });
  return server;
}

function closeServers() {
  if (server) {
    server.close();
    server = null;
  }
  if (graphServer) {
    graphServer.close();
    graphServer = null;
  }
}

function startListening() {
  return new Promise((resolve, reject) => {
    try {
      restServer().listen(appConfig.app.restPort, () => {
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
  swaggerRestify.register(restServer());
  /* istanbul ignore next */
  server.use((errX, req, res, next) => {
    log.error(errX.stack);
    res.status(500).send('Something broke!');
    next();
  });
  /* istanbul ignore next */
  restServer().on('InternalServer', (req, res, intErr, cb) => cb());
  /* istanbul ignore next */
  restServer().on('uncaughtException', (serverErr) => {
    log.info(`Uncaught server exception ${serverErr}`);
  });
  /* istanbul ignore next */
  process.on('uncaughtException', (procErr) => {
    log.info(`Uncaught process exception ${procErr}`);
  });
  await startListening();
}

let cb = null;

function setupSagaDomainHandlers(sagaDomainInst) {
  const domainInfo = JSON.stringify(sagaDomainInst.getInfo());
  log.info(`Saga Domain Info ${domainInfo}`);
  /* istanbul ignore next */
  sagaDomainInst.onCommand((cmd) => {
    log.info(`saga domain issued command ${cmd.name}`);
    msgBus.emitCommand(cmd);
    if (cb) {
      cb(cmd);
    }
  });
  /* istanbul ignore next */
  sagaDomainInst.onEventMissing((evt) => {
    log.info(`unhandled saga domain evt ${evt.name}`);
  });
  msgBus.onEvent((event) => {
    log.info(`bus raised event for saga ${JSON.stringify(event)}`);
    sagaDomainInst.handle(event, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
    if (cb) {
      cb(event);
    }
  });
}

function setupCqrsDomainHandlers(domainInst) {
  const domainInfo = domainInst.getInfo();
  log.info(`Domain Info ${domainInfo}`);
  /* istanbul ignore next */
  msgBus.onCommand((cmd) => {
    log.info(`domain received command from bus ${cmd.name}`);
    domainInst.handle(cmd);
    if (cb) {
      cb(cmd);
    }
  });
  /* istanbul ignore next */
  domainInst.onEvent((event) => {
    log.info(`domain raised event ${event.name}`);
    msgBus.emitEvent(event);
    if (cb) {
      cb(event);
    }
  });
}

function setupReadDomainHandlers(readDomainInst) {
  const domainInfo = readDomainInst.getInfo();
  log.info(`Read Domain Info ${domainInfo}`);
  /* istanbul ignore next */
  msgBus.onEvent((evt) => {
    log.info(`read domain received event from bus ${evt.name}`);
    readDomainInst.handle(evt);
    if (cb) {
      cb(evt);
    }
  });
  /* istanbul ignore next */
  readDomainInst.onNotification((not) => {
    log.info(`read domain emitted notification ${not.name}`);
    msgBus.emitNotification(not);
    if (cb) {
      cb(not);
    }
  });
  /* istanbul ignore next */
  readDomainInst.onEventMissing((evt) => {
    log.info(`read domain missing event ${evt}`);
  });
}

function setupDomainHandlers(dom, readDomainInst, sagaDom) {
  msgBus.reset();
  setupCqrsDomainHandlers(dom);
  setupReadDomainHandlers(readDomainInst);
  setupSagaDomainHandlers(sagaDom);
}

async function swaggerRestifyCreate() {
  log.info('Starting swaggerRestifyCreate');
  const swaggerPath = path.join(__dirname, 'config/swagger/swagger.yaml');
  const swaggerConfig = {
    appRoot: __dirname,
    swaggerFile: `${swaggerPath}`,
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

async function startSagaDomain() {
  cqrsSagaReset();
  const sagaDom = cqrsSagaDomain();
  return new Promise((resolve, reject) => {
    sagaDom.init((err, warnings) => {
      /* istanbul ignore next */
      if (err) {
        log.error(`Cqrs Saga Domain failed to start ${err}`);
        reject(`Cqrs Saga Domain failed to start ${err}`);
      }
      /* istanbul ignore next */
      if (warnings) {
        log.error(`Cqrs Saga Domain warnings on start ${warnings}`);
        reject(`Cqrs Saga Domain warnings on start ${warnings}`);
      }
      resolve(sagaDom);
    });
  });
}

async function startCommandDomain() {
  cqrsReset();
  const dom = cqrsDomain();
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
      resolve(dom);
    });
  });
}

async function initReadDomain() {
  return new Promise((resolve, reject) => {
    try {
      cqrsReadDomain.reset();
      const readDomainInst = cqrsReadDomain.readDomain();
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

async function startRestWebServer() {
  log.info('Call restify create');
  const swaggerRestify = await swaggerRestifyCreate();
  log.info('About to start rest server');
  await startRestServer(swaggerRestify);
}

async function startServer() {
  /* istanbul ignore next */
  if (started) {
    log.info('Server already started');
    return;
  }
  log.info('App Starting');
  closeServers();
  const viewModelRead = promisify(viewmodel.read);
  await viewModelRead(config.repository);
  const readDomainInst = await initReadDomain();
  const commandDomainInst = await startCommandDomain();
  const sagaDomainInst = await startSagaDomain();
  setupDomainHandlers(commandDomainInst, readDomainInst, sagaDomainInst);
  await startRestWebServer();
  graphServer = await graphQlServerStart();
  started = true;
}

export default {
  server: restServer,
  start: (callback) => {
    cb = callback;
    return startServer();
  },
  restart: (callback) => {
    cb = callback;
    started = false;
    return startServer();
  },
};
