import servicebus from 'servicebus';
import retry from 'servicebus-retry';
import appConfig from './config/application';
import { log } from './utilities/logging';

let theBus = null;

module.exports = {
  reset: () => {
    theBus = null;
  },
  bus: () => {
    if (theBus) {
      return theBus;
    }
    log.info(`Connecting to amqpHost ${appConfig.app.amqpHost}`);
    theBus = servicebus.bus({
      url: appConfig.app.amqpHost,
    });
    theBus.use(theBus.logger());
    theBus.use(theBus.correlate());
    theBus.use(retry({
      store: new retry.MemoryStore(),
    }));
    log.info(`Created bus connection: ${JSON.stringify(theBus)}`);
    return theBus;
  },
};
