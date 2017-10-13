/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import { defineSupportCode } from 'cucumber';
import cp from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';

defineSupportCode(function ({ registerHandler }) {
  registerHandler('BeforeFeatures', function () {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    console.log(JSON.stringify(envConfig));
    // replace with running of docker image
    const proc = cp.fork('./build/index', {
      env: envConfig,
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
