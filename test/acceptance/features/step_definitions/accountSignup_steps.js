/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import cp from 'child_process';
import shortid from 'shortid';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import { defineSupportCode } from 'cucumber';
import supertest from 'supertest';
import { wasDelivered } from '../../../../src/externalServices/smtpMessaging';
import app from '../../../../src/app';

const expect = chai.expect;
chai.use(dirtyChai);

function checkEmailReceived(email, subject) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 5);
  const queryParams = {
    begin: (date.getTime() / 1000).toString(),
    ascending: 'no',
    limit: 100,
    pretty: 'no',
    recipient: email,
  };
  return wasDelivered(queryParams, subject, 10)
    .then((delivered) => {
      expect(delivered).is.true();
    });
}

function requestCreateAccountSignup(name, email) {
  return supertest(app.server())
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
    .expect(201)
    .then((res) => {
      expect(res.body).to.deep.equal({
        message: `Account signup "${name}" created`,
      });
    });
}

defineSupportCode(({ Given, When, Then }) => {
  Given(/^an account named "([^"]*)"$/,
    function (accountName) {
      if (accountName === '<autogenerate>') {
        this.accountName = shortid.generate();
      } else {
        this.accountName = accountName;
      }
      return Promise.resolve();
    });

  Given(/^the Primary Contact email is "([^"]*)"$/,
    function (email) {
      this.email = email;
      return Promise.resolve();
    });

  When(/^a create account signup request is made$/,
    function () {
      return requestCreateAccountSignup(this.accountName, this.email);
    });

  When(/^an account verification email is received on the Primary Contact email$/,
    function () {
      const subject = `Phings Account Signup for ${this.accountName}`;
      return checkEmailReceived(this.email, subject);
    });

  When(/^the verify account request is made$/,
    function () {
      return 'pending';
    });

  Then(/^we expect an account signup complete email to arrive at the Primary Contact email$/,
    function () {
      return 'pending';
    });
});
