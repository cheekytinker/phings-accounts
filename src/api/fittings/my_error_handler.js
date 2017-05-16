import debug from 'debug';
import util from 'util';
import { log } from './../../utilities/logging';

function create() {
  return function error_handler(context, next) {
    const theContext = context;
    if (!util.isError(context.error)) { return next(); }
    const err = context.error;
    debug('jsonErrorHandler: %s', context.error.message);
    try {
      theContext.headers['Content-Type'] = 'application/json';
      if (!context.statusCode || context.statusCode < 400) {
        if (context.response && context.response.statusCode && context.response.statusCode >= 400) {
          theContext.statusCode = context.response.statusCode;
        } else if (err.statusCode && err.statusCode >= 400) {
          theContext.statusCode = err.statusCode;
          delete(err.statusCode);
        } else {
          theContext.statusCode = 500;
        }
      }

      Object.defineProperty(err, 'message', { enumerable: true }); // include message property in response
      if (context.statusCode === 500) {
        console.error(err.stack);
      }
      delete (theContext.error);
      log.info(`ctx ${context.statusCode}`);
      next(null, JSON.stringify(err));
    } catch (err2) {
      debug('jsonErrorHandler unable to stringify error: %j', err);
      next();
    }
  };
}
export {
  create,
};
