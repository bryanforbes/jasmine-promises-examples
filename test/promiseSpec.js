var promise = require('when');

describe('setup', function() {
  it('test env works', function() {
    expect(true).toBe(true);
  });
});

function promiseThatResolves() {
  return promise.promise(function(resolve) { resolve(); });
}
function promiseThatRejects() {
  return promise.promise(function(_, reject) { reject('A rejected promise'); });
}

describe('promises and jasmine', function() {
  it('the simplest passing promise test', function(done) {
    promiseThatResolves().then(success).done();

    function success() {
      expect(true).toBe(true);
      done();
    }
    // Issues here:
    // - missing `done();` on the last line makes the tests run looong (5s) until the timeout catches
    //   that would be acceptable, since it kinda gives a hint where to look
    // - to have the function success at all makes the flow of the test just a bit harder to read
  });

  it('a bit better passing promise test', function(done) {
    var success = jasmine.createSpy('success');
    promiseThatResolves().then(success).done();

    success.andCallFake(function() {
      expect(success).toHaveBeenCalled();
      done();
    });
    // Pro
    // - removes the little meaningful `expect(true).toBe(true);` and replaces it by something
    //   that shows a meaning when failing.
    //
    // Contra:
    // - the spy+callFake construct is not easy to understand on first sight
  });
});
