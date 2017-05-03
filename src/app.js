import log from './utilities/logging';

export default function start() {
  log.info('code under test');
  let x = 0;
  x += 1;
  log.info(x);
}
