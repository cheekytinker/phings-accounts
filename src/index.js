import { log } from './utilities/logging';
import app from './app';

app.start()
  .then(() => {
    log.info('App Started');
  })
  .catch((err) => {
    log.error(`App failed to start ${err}`);
  });
