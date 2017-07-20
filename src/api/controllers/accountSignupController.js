import { log } from './../../utilities/logging';
import createAccountSignup from '../mutations/createAccountSignup';
import verifyAccountSignup from '../mutations/verifyAccountSignup';
import readAccountSignup from '../queries/readAccountSignup';
import errorCodes from '../../utilities/errorCodes';

function createAccountSignupRest(req, res, next) {
  log.info('create accountSignup signup');
  return createAccountSignup({
    input: req.body,
  })
    .then((data) => {
      res.status(201);
      const { name } = data;
      res.json({
        message: `Account signup "${name}" created`,
      });
      next();
    })
    .catch((err) => {
      log.info(`Error: ${err.name} : ${err.message} : ${err.more}`);
      res.status(400);
      res.json({
        message: `Error "${err.message}"`,
      });
      next();
    });
}

function readAccountSignupRest(req, res, next) {
  return readAccountSignup({ key: req.swagger.params.key.value })
    .then((accountSignup) => {
      log.info('success readAccountSignup');
      res.status(200);
      const { key, name, status } = accountSignup;
      res.json({ key, name, status });
      next();
    })
    .catch((err) => {
      if (err.code && (err.code === errorCodes.notFound)) {
        log.info(`Account signup not found ${req.swagger.params.key.value}`);
        res.status(404);
        res.json(err.message);
        next();
        return;
      }
      if (err.code && (err.code === errorCodes.badRequest)) {
        log.info(`Bad request ${err.message}`);
        res.status(400);
        res.json(err.message);
        next();
        return;
      }
      log.error(err);
      res.status(500);
      res.json(err.message);
      next();
    });
}

function verifyAccountSignupRest(req, res, next) {
  log.info('verify account signup');
  return verifyAccountSignup({
    input: {
      key: req.swagger.params.key.value,
      verificationCode: req.swagger.params.verificationCode.value,
    },
  })
    .then((data) => {
      res.status(200);
      const { name } = data;
      res.json({
        message: `Account signup "${name}" verification submitted`,
      });
      next();
    })
    .catch((err) => {
      log.info(`Error: ${err.name} : ${err.message} : ${err.more}`);
      res.status(400);
      res.json({
        message: `Error "${err.message}"`,
      });
      next();
    });
}

function friendlyVerifyAccountSignupRest(req, res, next) {
  return verifyAccountSignupRest(req, res, next);
}

export {
  createAccountSignupRest,
  readAccountSignupRest,
  verifyAccountSignupRest,
  friendlyVerifyAccountSignupRest,
};
