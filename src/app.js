import { log } from './utilities/logging';
import './utilities/initialiseExternalServices';

export default function start() {
  log.info('code under test');
  let x = 0;
  x += 1;
  log.info(x);
}
