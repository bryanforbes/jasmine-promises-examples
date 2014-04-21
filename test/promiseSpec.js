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
function functionThatCallsMockedDependency(externalDependency) {
  return promise.promise(function(resolve) {
    externalDependency.method();
    resolve();
  });
}

describe('promises and jasmine', function() {
  describe('resolving promises', function() {
    it('the simplest', function(done) {
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

    it('a bit better', function(done) {
      var success = jasmine.createSpy('success');
      promiseThatResolves().then(success).done();

      success.andCallFake(function() {
        expect(success).toHaveBeenCalled();
        done();
      });
      // Pro
      // - removes the little meaningful `expect(true).toBe(true);` and replaces it by something
      //   that shows a meaningful message when failing (kinda: `success should have been called ...`).
      //
      // Contra:
      // - the spy+callFake construct is not easy to understand on first sight
    });
  });

  it('a rejected promise example', function(done) {
    var success = jasmine.createSpy('success');
    var reject = jasmine.createSpy('reject');
    promiseThatRejects()
      .then(success)
      .catch(reject)
      .done();

    reject.andCallFake(function() {
      expect(reject).toHaveBeenCalled(); // we expect this, to pass test
      done();
    });
    success.andCallFake(function() {
      expect(success).not.toHaveBeenCalled(); // test fails when this is called
      done();
    });
    // Issues:
    // - if the promise resolves unexpectedly then the test will run into the timeout
    //   therefore I added the success spy+fake, sucks a bit imho
  });

  it('testing for a mock-call', function(done) {
    var myMock = {method: jasmine.createSpy('method')};
    functionThatCallsMockedDependency(myMock)
      .then(success)
      .done();
    
    function success() {
      expect(myMock.method).toHaveBeenCalled();
      done();
    }
    // Note
    // - I used to forget the `.done()` at the end of the promise, which swallowed
    //   the "got function but expected spy" message from jasmine and ran into a timeout
    //   since i have `.done()` there that issue is gone :)
  });
});
