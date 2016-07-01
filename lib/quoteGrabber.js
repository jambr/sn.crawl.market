'use strict';
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
      store.keys((err, symbols) => {
        if(symbols) {
          finance.quote(symbols, tickHandler);
        }
      });
    }, interval);
  };
  this.stop = () => {
    clearInterval(ticker);
  };
  return Object.freeze(this);
}
module.exports = QuoteGrabber;
