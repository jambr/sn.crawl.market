'use strict';
let request = require('request');
function Google() {
  this.quote = (symbols, done) => {

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
        return quote;
      });
      mapped = mapped.length === 1 ? mapped[0] : mapped;
      done(err, mapped);
    });
  };

  return Object.freeze(this);
}
module.exports = Google;
