/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import { defineSupportCode } from 'cucumber';
import cp from 'child_process';

defineSupportCode(function ({ registerHandler }) {
  registerHandler('BeforeFeatures', function () {
    // replace with running of docker image
    const proc = cp.fork('./build/src/index', {
    });
    return new Promise((resolve, reject) => {
      proc.on('message', (m) => {
        if (m.status === 'started') {
          resolve();
        }
        if (m.status === 'errored') {
          reject();
        }
      });
    });
  });
});
