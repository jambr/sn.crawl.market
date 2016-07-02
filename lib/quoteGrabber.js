'use strict';
let DebugFactory = require('sn.core').DebugFactory;
let debugFactory = new DebugFactory();
let debug = debugFactory.give('sn:crawl:market:quoteGrabber');
let async = require('async');
let _ = require('lodash');

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

  this.grab = (done) => {
    let symbols;
    let keys;

    let handleStoreGet = (results, next) => {
      symbols = results;
      keys = Object.keys(symbols);
      next(null, keys);
    };

    let handleQuoteResults = (quotes, next) => {
      let quotesToReturn = [];

      async.forEach(quotes, (quote, nextQuote) => {
        let key = `${quote.exchange}:${quote.ticker}`;
        let oldQuote = symbols[key].quote;

        if(_.isEqual(oldQuote, quote)) {
          nextQuote();
        } else {
          symbols[key].quote = quote;
          quotesToReturn.push(quote);
          store.set(key, symbols[key], nextQuote);
        }
      }, (err) => {
        next(err, quotesToReturn);
      });
    };

    async.waterfall([
        store.getAll,
        handleStoreGet,
        finance.quote,
        handleQuoteResults
    ], done);
  };

  this.start = (interval, tickHandler) => {
    ticker = setInterval(() => {
      this.grab(tickHandler);
    }, interval);
  };

  this.stop = () => {
    clearInterval(ticker);
  };

  return Object.freeze(this);
}
module.exports = QuoteGrabber;
