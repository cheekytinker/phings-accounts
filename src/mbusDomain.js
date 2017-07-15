import servicebus from './servicebusWrapper';
import { log } from './utilities/logging';

const evtSubscriptions = [];
const cmdSubscriptions = [];

function eventHandler(message) {
  const event = JSON.parse(message);
  log.info(`Handle event ${event}`);
  evtSubscriptions.forEach((subscriber) => {
    subscriber(event);
  });
}

function commandHandler(message) {
  const command = JSON.parse(message);
  log.info(`Handler command ${command}`);
  cmdSubscriptions.forEach((subscriber) => {
    subscriber(command);
  });
}

function clearSubscriptions() {
  evtSubscriptions.length = 0;
  cmdSubscriptions.length = 0;
}

export default {
  reset: () => {
    clearSubscriptions();
    servicebus.reset();
  },
  clearSubscriptions,
  emitCommand: (command) => {
    log.info(command);
    servicebus.bus().publish('command', JSON.stringify(command));
  },
  onCommand: (callback) => {
    if (cmdSubscriptions.length === 0) {
      servicebus.bus().subscribe('command', commandHandler);
    }
    cmdSubscriptions.push(callback);
  },
  emitEvent: (event) => {
    log.info(event);
    servicebus.bus().publish('event', JSON.stringify(event));
  },
  emitNotification: (not) => {
    log.info(not);
    servicebus.bus().publish('notification', JSON.stringify(not));
  },
  onEvent: (callback) => {
    if (evtSubscriptions.length === 0) {
      servicebus.bus().subscribe('event', eventHandler);
    }
    evtSubscriptions.push(callback);
  },
};
