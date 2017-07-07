import mongoose from 'mongoose';
import config from '../config/application';

const mongoRepository = config.app.mongoRepository;
const host = config.app.dbHost;
const dbConnectionUrl = `mongodb://${host}:27017/${mongoRepository}`;

mongoose.Promise = global.Promise;
mongoose.connect(dbConnectionUrl);

