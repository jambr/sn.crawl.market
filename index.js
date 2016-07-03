'use strict';
let Broker = require('sn.core').Default.Broker;
let KeyValueStore = require('sn.core').Default.Store;
let GoogleFinance = require('./lib/markets/google');
let MessageBridge = require('./lib/messageBridge');
let QuoteGrabber = require('./lib/quoteGrabber');

let finance = new GoogleFinance();
let config = require('./config');
let store = new KeyValueStore('sn:crawl:market:symbols', config.redis);
let broker = new Broker('sn:topic', config.rabbitmq);
let quoteGrabber = new QuoteGrabber(store, finance);
 
let messageBridge = new MessageBridge(broker, quoteGrabber);
messageBridge.start(() => {
  console.log('Market watch started...');
});
