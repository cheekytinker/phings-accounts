import { describe, it, before, after } from 'mocha';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import shortid from 'shortid';
import path from 'path';
import rimraf from 'rimraf';
import fs from 'fs';
import sinon from 'sinon';
import Log, { log } from '../../../../src/utilities/logging';
import appConfig from '../../../../src/config/application';

const expect = chai.expect;
chai.use(dirtyChai);

describe('unit', () => {
  describe('utilities', () => {
    describe('loggingSpecs', () => {
      describe('when logging', () => {
        let testLogFolderPath = null;
        const sandbox = sinon.sandbox.create();
        const logLevelStub = sandbox.stub(appConfig.app, 'logLevel');
        before((done) => {
          logLevelStub.returns('info');
          testLogFolderPath = path.join(
            appConfig.app.logDir,
            shortid.generate(),
            `${shortid.generate()}.log`);
          done();
        });
        after((done) => {
          sandbox.restore();
          rimraf(path.dirname(testLogFolderPath), () => {
            done();
          });
        });
        it('should expose singleton application log', () => {
          expect(log).to.exist();
        });
        it('should be able to log a warn', (done) => {
          const myLog = new Log(testLogFolderPath);
          myLog.warn('my warn');
          fs.exists(testLogFolderPath, () => {
            fs.readFile(testLogFolderPath, 'utf8', (err, data) => {
              if (err) {
                done(err);
                return;
              }
              expect(data).contains('my warn');
              done();
            });
          });
        });
        it('should be able to log a error', (done) => {
          const myLog = new Log(testLogFolderPath);
          myLog.error('my error');
          fs.exists(testLogFolderPath, () => {
            fs.readFile(testLogFolderPath, 'utf8', (err, data) => {
              if (err) {
                done(err);
                return;
              }
              expect(data).contains('my error');
              done();
            });
          });
        });
        it('should be able to configure to log info', (done) => {
          const myLog = new Log(testLogFolderPath, 'info');
          myLog.info('my info');
          fs.exists(testLogFolderPath, () => {
            fs.readFile(testLogFolderPath, 'utf8', (err, data) => {
              if (err) {
                done(err);
                return;
              }
              expect(data).contains('my info');
              done();
            });
          });
        });
        it('should create the log folder if it does not exist', (done) => {
          const myLog = new Log(testLogFolderPath);
          myLog.error('some text');
          fs.exists(path.dirname(testLogFolderPath), (exists) => {
            if (!exists) {
              done('Folder does not exist');
              return;
            }
            done();
          });
        });
      });
    });
  });
});
