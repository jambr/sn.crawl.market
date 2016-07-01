'use strict';
let MessageBridge = require('../lib/messageBridge');
let Broker = require('sn.core').Default.Broker;

let deride = require('deride');
let should = require('should');

describe('Message Bridge', () => {
  let messageBridge, broker, mockQuoteGrabber;
  beforeEach(() => {
    mockQuoteGrabber = deride.stub(['add', 'start']);
    broker = new Broker('stocknet.topic.test');
    messageBridge = new MessageBridge(broker, mockQuoteGrabber);
  });
  afterEach(done => {
    broker.reset(done);
  });

  it('should subscribe to picker symbol creates and save to the quote grabber', (done) => {
    mockQuoteGrabber.setup.add.toDoThis((exchange, ticker) => {
      should(exchange).eql('LON');
      should(ticker).eql('VM');
      done();
    });
    messageBridge.start(() => {
      broker.publish('sn.picker.symbol.create', {
        id: 'LON:VM', 
        exchange: 'LON', 
        symbol: 'VM'
      });
    });
  });

  it('should publish price changes to the world', (done) => {
    mockQuoteGrabber.setup.start.toDoThis((interval, handler) => {
      setTimeout(() => {
        handler(['some market value']);
      }, 100);
    });

    messageBridge.start(() => {
      broker.subscribe('sn.market.value.update', (message) => {
        should(message).eql('some market value');
        done();
      });
    });

  });

});
