'use strict';
let async = require('async');

function QuoteGrabber(store, finance) {
  let ticker;
  this.add = (exchange, ticker, done) => {
    store.set(`${exchange}:${ticker}`, {
      dateAdded: Date.now()
    }, done);
  };
  this.remove = (exchange, ticker, done) => {
    store.remove(`${exchange}:${ticker}`, done);
  };
  this.start = (interval, tickHandler) => {
    ticker = setInterval(() => {
      async.waterfall([
        store.keys, 
        finance.quote 
      ], tickHandler);
    }, interval);
  };
  this.stop = () => {
    clearInterval(ticker);
  };
  return Object.freeze(this);
}
module.exports = QuoteGrabber;
