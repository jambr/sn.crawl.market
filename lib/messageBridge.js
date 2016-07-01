'use strict';
let async = require('async');

function MessageBridge(broker, quoteGrabber) { 
  this.start = (started) => {
    broker.subscribe('sn.picker.symbol.create', (message) => {
      quoteGrabber.add(message.exchange, message.symbol, () => {});       
    }, started);
    quoteGrabber.start(1000, (err, prices) => {
      prices.forEach(price => {
        broker.publish('sn.market.value.update', price);
      });
    });
  };
  this.stop = (stopped) => {
    async.series([
      quoteGrabber.stop,
      broker.stop
    ], stopped);
  };
  return Object.freeze(this);
}
module.exports = MessageBridge;
