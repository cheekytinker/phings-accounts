/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import shortid from 'shortid';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import { defineSupportCode } from 'cucumber';
import supertest from 'supertest';
import { log } from '../../../../src/utilities/logging';
import { wasDelivered, getMessageDetails } from '../../../../src/externalServices/smtpMessaging';
import config from '../../../../src/config/application';

const expect = chai.expect;
chai.use(dirtyChai);

function checkEmailReceived(email, subject) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 5);
  const queryParams = {
    begin: (date.getTime() / 1000).toString(),
    ascending: 'yes',
    limit: 100,
    pretty: 'no',
    recipient: email,
  };
  return wasDelivered(queryParams, subject, 10);
}

function requestVerifyAccountSignup(name, verificationCode) {
  const query = `/accountSignups/${name}/verification/${verificationCode}`;
  log.info(query);
  return supertest(`${config.app.restHost}:${config.app.restPort}`)
    .put(query)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .then(res => Promise.resolve({ status: res.status, body: res.body }));
}

function requestCreateAccountSignup(name, email) {
  return supertest(`${config.app.restHost}:${config.app.restPort}`)
    .post('/accountSignups/')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({
      name,
      primaryContact: {
        email,
        userName: `admin${name}`,
        password: 'pass123',
        firstName: 'fname',
        lastName: 'lname',
      },
    })
    .expect('Content-Type', 'application/json')
    .then(res => Promise.resolve({ status: res.status, body: res.body }));
}

function findVerificationCode(messageDetails) {
  const verificationCode = messageDetails['body-html'].match(/.*verification\/(.*)"/i);
  if (!verificationCode || verificationCode.length < 2) {
    return null;
  }
  return verificationCode[1];
}

const PLACEHOLDERS = [
  'accountName',
];

function replacePlaceHolders(world, responseMessage) {
  let ret = responseMessage;
  PLACEHOLDERS.forEach((ph) => { ret = ret.replace(`<${ph}>`, world[ph]); });
  return ret;
}

defineSupportCode(({ Given, When, Then }) => {
  Given(/^an account named '([^']*)'$/,
    function (accountName) {
      if (accountName === '<autogenerate>') {
        this.accountName = shortid.generate();
      } else {
        this.accountName = accountName;
      }
      return Promise.resolve();
    });

  Given(/^the Primary Contact email is '([^']*)'$/,
    function (email) {
      this.email = email;
      return Promise.resolve();
    });

  When(/^a create account signup request is made$/,
    function () {
      this.responseCode = null;
      this.responseBody = null;
      const world = this;
      return requestCreateAccountSignup(
        this.accountName,
        this.email,
      )
      .then((res) => {
        world.responseCode = res.status;
        world.responseBody = res.body;
      });
    });

  When(/^the response is (\d+) '([^']*)'$/, function (responseCode, responseMessage) {
    const message = replacePlaceHolders(this, responseMessage);
    expect(this.responseCode).to.equal(responseCode);
    expect(this.responseBody.message).to.equal(message);
    return Promise.resolve();
  });

  When(/^an account verification email is received on the Primary Contact email$/,
    function () {
      const subject = `Phings Account Signup for ${this.accountName}`;
      return checkEmailReceived(this.email, subject)
        .then(message => getMessageDetails(message))
        .then((messageDetails) => {
          this.verificationCode = findVerificationCode(messageDetails);
        })
        .catch((err) => {
          throw Error(err);
        });
    });

  When(/^the verify account request is made$/,
    function () {
      this.responseBody = null;
      this.responseCode = null;
      const world = this;
      return requestVerifyAccountSignup(this.accountName, this.verificationCode)
        .then((res) => {
          world.responseCode = res.status;
          world.responseBody = res.body;
        });
    });

  When(/^the response to be (\d+) '([^']*)'$/, function (responseCode, responseMessage) {
    const message = replacePlaceHolders(this, responseMessage);
    expect(this.responseCode).to.equal(responseCode);
    expect(this.responseBody.message).to.equal(message);
    return Promise.resolve();
  });

  Then(/^we expect an account signup complete email to arrive at the Primary Contact email$/,
    function () {
      const subject = `Phings Account Signup for ${this.accountName}`;
      return checkEmailReceived(this.email, subject)
        .then(message => getMessageDetails(message))
        .then((messageDetails) => {
          this.verificationCode = findVerificationCode(messageDetails);
        });
    });
});
