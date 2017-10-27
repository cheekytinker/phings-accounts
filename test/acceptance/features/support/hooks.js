/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import { defineSupportCode } from 'cucumber';
import cp from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';

defineSupportCode(function ({ registerHandler }) {
  registerHandler('BeforeFeatures', function () {
    let envConfig = {};
    if (fs.existsSync('.env')) {
      envConfig = dotenv.parse(fs.readFileSync('.env'));
      // replace with running of docker image
    } else {
      envConfig = process.env;
    }
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
