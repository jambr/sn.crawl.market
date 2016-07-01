'use strict';
let QuoteGrabber = require('../lib/quoteGrabber');
let KeyValueStore = require('sn.core').Default.Store;
let should = require('should');
let deride = require('deride');

describe('Quote Grabber', () => {
  let quoteGrabber, store, mockBroker, mockFinance;

  beforeEach(() => {
    store = new KeyValueStore('sn:crawl:market:symbols');
    store.flush();
    mockFinance = deride.stub(['quote']);
    mockFinance.setup.quote.toCallbackWith(null, [{}]);
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
    quoteGrabber.add('LON', 'VM', () => {
      quoteGrabber.start(100, (err, quotes) => {
        should.ifError(err);
        quotes.should.eql([{}]);
        mockFinance.expect.quote.called.once();
        quoteGrabber.stop();
        done();
      });
    });
  });

});
