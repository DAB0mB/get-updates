var GetUpdates = require('..');
var Chai = require('chai');

var expect = Chai.expect;

describe('get-updates', function() {
  it('should define a "$set" property when the destination object has extra properties', function() {
    var src = {
      a: 'a',
      b: {
        c: 'c'
      },
      d: [1, 2, 3]
    };

    var dst = {
      a: 'a',
      b: {
        c: 'c',
        e: 'e'
      },
      d: [1, 2, 4, 3]
    };

    var expectedUpdates = {
      $set: {
        'b.e': 'e',
        'd.2': 4,
        'd.3': 3
      }
    };

    var actualUpdates = GetUpdates(src, dst);
    expect(actualUpdates).to.deep.equal(expectedUpdates);
  });

  it('should define an "$unset" property when the destination object has missing properties', function() {
    var src = {
      a: 'a',
      b: {
        c: 'c',
        e: 'e'
      }
    };

    var dst = {
      b: {
        c: 'c'
      }
    };

    var expectedUpdates = {
      $unset: {
        'a': undefined,
        'b.e': undefined
      }
    };

    var actualUpdates = GetUpdates(src, dst);
    expect(actualUpdates).to.deep.equal(expectedUpdates);
  });

  it('should define a "$pull" property when the destination object has an array value with missing elements', function() {
    var src = {
      arr: [1, 2, 3, 4, 5]
    };

    var dst = {
      arr: [1, 2, 3]
    };

    var expectedUpdates = {
      $unset: {
        'arr.3': undefined,
        'arr.4': undefined
      },

      $pull: {
        'arr': null
      }
    };

    var actualUpdates = GetUpdates(src, dst);
    expect(actualUpdates).to.deep.equal(expectedUpdates);
  });
});