var _ = require('underscore');
var Chai = require('chai');

var GetUpdates = require('..');

var expect = Chai.expect;

describe('get-updates', function() {
  describe('validations', function() {
    it('should throw an error if first argument is not an object', function() {
      var boundGetUpdates = _.partial(GetUpdates);
      expect(boundGetUpdates).to.throw(Error, /first argument.*object/); 
    });

    it('should throw an error if second argument is not an object', function() {
      var boundGetUpdates = _.partial(GetUpdates, {});
      expect(boundGetUpdates).to.throw(Error, /second argument.*object/);
    });
  });

  describe('general functionality', function() {
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

  describe('"isShallow" option', function() {
    it('should return shallow updates if option is truthy', function() {
      var src = {
        a: 'a',
        b: {
          c: 'c'
        }
      };

      var dst = {
        a: 'changed',
        b: {
          c: 'changed'
        }
      };

      var expectedUpdates = {
        $set: {
          'a': 'changed',
        }
      };

      var actualUpdates = GetUpdates(src, dst, true);
      expect(actualUpdates).to.deep.equal(expectedUpdates);
    });

    it('should return limited updates as specified if option is a number bigger than 1', function() {
      var src = {
        a: 'a',
        b: {
          c: 'c',
          d: {
            e: 'd'
          }
        }
      };

      var dst = {
        a: 'changed',
        b: {
          c: 'changed',
          d: {
            e: 'changed'
          }
        }
      };

      var expectedUpdates = {
        $set: {
          'a': 'changed',
          'b.c': 'changed'
        }
      };

      var actualUpdates = GetUpdates(src, dst, 2);
      expect(actualUpdates).to.deep.equal(expectedUpdates);
    });
  });
});