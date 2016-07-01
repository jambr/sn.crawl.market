'use strict';
let request = require('request');
let DebugFactory = require('sn.core').DebugFactory;
let debugFactory = new DebugFactory();

function Google() {
  this.quote = (symbols, done) => {
    debugFactory.give('sn:crawl:market:google')('quoting for', symbols);

    let url = 'https://www.google.com/finance/info?client=ig&q=' + `${symbols}`;
    request.get({
      url: url, 
      json: true
    }, (err, response, data) => {
      data = JSON.parse(data.substring(3));
      let mapped = data.map(result => { 
        let quote = {};
        quote.ticker = result.t;
        quote.exchange = result.e;
        quote.price = result.l_cur;
        quote.change = result.c;
        quote.change_percent = result.cp;
        quote.lastTradeTime = result.lt;
        quote.dividend = result.div;
        quote.yield = result.yld;
        // Hacky way to remove null fields
        return JSON.parse(JSON.stringify(quote));
      });
      mapped = (symbols instanceof Array) ? mapped : mapped[0];
      done(err, mapped);
    });
  };

  return Object.freeze(this);
}
module.exports = Google;
