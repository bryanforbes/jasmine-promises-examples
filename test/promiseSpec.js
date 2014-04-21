var promise = require('when');

describe('setup', function() {
  it('test env works', function() {
    expect(true).toBe(true);
  });
});

function promise1() {
  return promise.promise(function(resolve) { resolve(); });
}

describe('promises and jasmine', function() {
  it('the simplest passing promise test', function(done) {
    promise1().then(success);

    function success() {
      expect(true).toBe(true);
      done();
    }
  });
});
