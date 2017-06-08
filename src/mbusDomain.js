import servicebus from 'servicebus';
import appConfig from './config/application';
import { log } from './utilities/logging';

const bus = servicebus.bus({
  url: appConfig.amqpHost,
});

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
  evtSubscriptions.forEach((subscriber) => {
    subscriber(command);
  });
}

export default {
  emitCommand: (command) => {
    log.info(command);
    bus.publish('command', JSON.stringify(command));
  },
  onCommand: (callback) => {
    if (cmdSubscriptions.length === 0) {
      bus.subscribe('command', commandHandler);
    }
    cmdSubscriptions.push(callback);
  },
  emitEvent: (event) => {
    log.info(event);
    bus.publish('event', JSON.stringify(event));
  },
  emitNotification: (not) => {
    log.info(not);
    bus.publish('notification', JSON.stringify(not));
  },
  onEvent: (callback) => {
    if (evtSubscriptions.length === 0) {
      bus.subscribe('event', eventHandler);
    }
    evtSubscriptions.push(callback);
  },
};
