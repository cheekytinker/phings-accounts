import servicebus from 'servicebus';
import appConfig from './config/application';

module.exports = {
  bus: () => servicebus.bus({
    url: appConfig.amqpHost,
  }),
};
