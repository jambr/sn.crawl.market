'use strict';
let DebugFactory = require('sn.core').DebugFactory;
let debugFactory = new DebugFactory();
let debug = debugFactory.give('sn:crawl:market:quoteGrabber');

function QuoteGrabber(store, finance) {
  let ticker;
  this.add = (exchange, ticker, done) => {
    debug(`adding ${exchange}:${ticker} to watch list`);

    store.set(`${exchange}:${ticker}`, {
      dateAdded: Date.now()
    }, done);
  };
  this.remove = (exchange, ticker, done) => {
    debug(`removing ${exchange}:${ticker} from watch list`);
    store.remove(`${exchange}:${ticker}`, done);
  };
  this.start = (interval, tickHandler) => {
    ticker = setInterval(() => {
      store.keys((err, symbols) => {
        if(symbols && symbols.length !== 0) {
          debug('doing price update');
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
