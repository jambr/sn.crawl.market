'use strict';
let QuoteGrabber = require('../lib/quoteGrabber');
let KeyValueStore = require('sn.core').Default.Store;
let should = require('should');
let deride = require('deride');
let async = require('async');

describe('Quote Grabber', () => {
  let quoteGrabber, store, mockBroker, mockFinance, sampleQuotes;

  beforeEach(() => {
    store = new KeyValueStore('sn:test:crawl:market:symbols');
    store.flush();
    mockFinance = deride.stub(['quote']);
    sampleQuotes = [{ 
      ticker: 'VM', 
      exchange: 'LON', 
      price: 'GBX256.70' 
    },{ 
      ticker: 'BARC', 
      exchange: 'LON', 
      price: 'GBX256.70' 
    }];

    mockFinance.setup.quote.toCallbackWith(null, sampleQuotes);
    quoteGrabber = new QuoteGrabber(store, mockFinance, mockBroker);
  });

  it('should let me add symbols to watch', (done) => {
    quoteGrabber.add('LON', 'VM', (err) => {
      should.ifError(err);
      store.get('LON:VM', (err, thing) => {
        should.ifError(err);
        thing.dateAdded.should.not.eql(null);
        done();
      });      
    });
  });

  it('should let me remove symbols from watch', (done) => {
    quoteGrabber.add('LON', 'VM', (err) => {
      should.ifError(err);
      quoteGrabber.remove('LON', 'VM', (err) => {
        should.ifError(err);
        store.get('LON:VM', (err, thing) => {
          should.ifError(err);
          should(thing).eql(null);
          done();
        });      
      });
    });
  });

  it('should get the quotes on a timer', (done) => { 
    async.series([
        (next) => { quoteGrabber.add('LON', 'VM', next); },
        (next) => { quoteGrabber.add('LON', 'BARC', next); },
        (next) => { 
          quoteGrabber.start(100, (err, quotes) => {
            should.ifError(err);
            mockFinance.expect.quote.called.once();
            quotes.should.eql(sampleQuotes);
            quoteGrabber.stop();
            next();
          });
        }], done);
  });

  it('shouldnt fire the tick handler for stocks that havent changed', (done) => {
    async.series([
        (next) => { quoteGrabber.add('LON', 'VM', next); },
        (next) => { quoteGrabber.add('LON', 'BARC', next); },
        (next) => { quoteGrabber.grab(() => {
          sampleQuotes[1].price = 'CHANGED';
          next();
        }); },
        (next) => { quoteGrabber.grab((err, quotes) => {
          should(quotes.length).eql(1);
          next();
        }); }], done);
  });

});
