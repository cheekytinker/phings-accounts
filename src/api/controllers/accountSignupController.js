import uuidv4 from 'uuid';
import { log } from './../../utilities/logging';
import { domain } from '../../cqrsDomain';

function createAccountSignup(req, res, next) {
  log.info('create account signup');
  domain.handle({
    id: uuidv4(),
    name: 'startAccountSignup',
    aggregate: {
      id: `${req.body.name}`,
      name: 'account',
    },
    payload: {
      name: `${req.body.name}`,
    },
    revision: 0,
    version: 1,
    meta: {
      userId: 'ccd65819-4da4-4df9-9f24-5b10bf89ef89',
    },
  }, (err, events, aggregateData, metaInfos) => {
    if (err) {
      log.info(`Error: ${err.name} : ${err.message} : ${err.more}`);
      res.status(400);
      res.json({
        message: `Error "${err.message}"`,
      });
      next();
      return;
    }
    log.info(aggregateData);
    res.status(201);
    log.info(req);
    const { id, name, status } = aggregateData;
    res.json({
      message: `Account signup "${req.body.name}" created`,
      entity: { id, name, status },
      id: metaInfos.aggregateId,
    });
    next();
  });
}

function readAccountSignup(req, res, next) {
  log.info('readAccountSignup');
  res.status(200);
  res.json({ key: `${req.swagger.params.key.value}` });
  next();
}
export {
  createAccountSignup,
  readAccountSignup,
};
