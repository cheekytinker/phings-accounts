/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import { defineSupportCode } from 'cucumber';
import app from '../../../../src/app';

defineSupportCode(function ({ registerHandler }) {
  registerHandler('BeforeFeatures', function () {
    return app.restart();
  });
});
