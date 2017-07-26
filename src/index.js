import { log } from './utilities/logging';
import app from './app';

app.start()
  .then(() => {
    log.info('App Started');
    if (process.send) {
      process.send({ status: 'started' });
    }
  })
  .catch((err) => {
    log.error(`App failed to start ${err}`);
    if (process.send) {
      process.send({ status: 'errored' });
    }
  });
