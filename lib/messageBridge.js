'use strict';
let async = require('async');

function MessageBridge(broker, quoteGrabber) { 
  this.start = (started) => {
    broker.subscribePersistent(
      'sn.picker.symbol.*', 
      'sn.picker',
      (message, meta, ack) => {
      switch(meta.routingKey) {
        case 'sn.picker.symbol.create':
          quoteGrabber.add(message.exchange, message.symbol, ack);       
          break;
        case 'sn.picker.symbol.delete':
          quoteGrabber.remove(message.exchange, message.symbol, ack);
          break;
      }
    }, started);
    quoteGrabber.start(10000, (err, prices) => {
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
