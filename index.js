'use strict';
let Broker = require('sn.core').Default.Broker;
let KeyValueStore = require('sn.core').Default.Store;
let GoogleFinance = require('./lib/markets/google');
let MessageBridge = require('./lib/messageBridge');
let QuoteGrabber = require('./lib/quoteGrabber');

let finance = new GoogleFinance();
let broker = new Broker('sn:topic');
let store = new KeyValueStore('sn:crawl:market:symbols');
let quoteGrabber = new QuoteGrabber(store, finance);
 
let messageBridge = new MessageBridge(broker, quoteGrabber);
messageBridge.start(() => {
  console.log('Market watch started...');
});
