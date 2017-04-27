import { describe, it } from 'mocha';
import { expect } from 'chai';
import { start } from '../../lib/app';

describe('unit', () => {
  describe('account', () => {
    describe('app', () => {
      describe('when started', () => {
        it('should...', () => {
          start();
        });
      });
    });
  });
});