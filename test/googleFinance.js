'use strict';
let GoogleFinance = require('../lib/markets').Google;
let assert = require('assert');

describe('Google Finance', () => {
  let googleFinance = new GoogleFinance();

  it('should get the current data for a single symbol', (done) => {
    googleFinance.quote('LON:VM', (err, result) => {
      assert.ifError(err);
      result.ticker.should.eql('VM');
      result.exchange.should.eql('LON');
      done();
    });
  });

  it('should let me get the current data for multiple symbols', (done) => {
    googleFinance.quote(['LON:VM', 'LON:BARC'], (err, result) => {
      assert.ifError(err);
      result.length.should.eql(2);
      let vm = result[0];
      let barc = result[1];

      vm.ticker.should.eql('VM');
      vm.exchange.should.eql('LON');
      barc.ticker.should.eql('BARC');
      barc.exchange.should.eql('LON');

      done();
    });
  });
});
