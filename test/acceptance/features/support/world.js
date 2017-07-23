/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import { defineSupportCode } from 'cucumber';

function RestApiWorld() {
}

defineSupportCode(function ({ setWorldConstructor, setDefaultTimeout }) {
  setWorldConstructor(RestApiWorld);
  setDefaultTimeout(60 * 1000);
});

