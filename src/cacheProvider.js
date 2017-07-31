import redis from 'redis';
import promisify from 'es6-promisify';
import appConfig from './config/application';
import { log } from './utilities/logging';

let singleCacheClient = null;
promisify(redis.RedisClient.prototype);
promisify(redis.Multi.prototype);

class CacheClient {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }
  async set(key, value) {
    log.info(`SET ${key} with ${value}`);
    await this.redisClient.set(key, value);
  }
  async setWithExpiry(key, value, expires) {
    log.info(`SETWITHEXPIRY ${key} with ${value}`);
    await this.redisClient.set(key, value);
    log.info(`EXPIRE ${key} with ${expires}`);
    await this.redisClient.expire(key, expires);
  }
  async get(key) {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }
  close() {
    this.redisClient.quit();
  }
}

function createCacheClient() {
  return new Promise((resolve, reject) => {
    if (singleCacheClient) {
      resolve(singleCacheClient);
    }
    try {
      const options = {
        prefix: appConfig.app.cachePrefix,
      };
      const client = redis.createClient(appConfig.app.cachePort, appConfig.app.cacheHost, options);
      client.on('connect', () => {
        singleCacheClient = new CacheClient(client);
        resolve(singleCacheClient);
      });
    } catch (err) {
      log.error(`cacheProvider Error ${err}`);
      reject(err);
    }
  });
}

function createKey(context, entityId) {
  return `${context}_${entityId}`;
}

module.exports = {
  createKey,
  cache: createCacheClient,
  reset: () => {
    if (singleCacheClient) {
      singleCacheClient.close();
    }
    singleCacheClient = null;
  },
};
