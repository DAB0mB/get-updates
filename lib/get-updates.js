var _ = require('underscore');

var GetDifference = require('./get-difference');
var Utils = require('./utils');

var getUpdates = function(src, dst, isShallow) {
  Utils.assert(_.isObject(src), 'first argument must be an object');
  Utils.assert(_.isObject(dst), 'second argument must be an object');

  var diff = GetDifference(src, dst, isShallow);
  var paths = Utils.toPaths(diff);

  var set = createSet(paths);
  var unset = createUnset(paths);
  var pull = createPull(unset);

  var updates = {};
  Utils.setFilled(updates, '$set', set);
  Utils.setFilled(updates, '$unset', unset);
  Utils.setFilled(updates, '$pull', pull);

  return updates;
};

var createSet = function(paths) {
  return _.omit(paths, _.isUndefined);
};

var createUnset = function(paths) {
  return _.pick(paths, _.isUndefined);
};

var createPull = function(unset) {
  var arrKeyPaths = _.keys(unset).map(function(k) {
    var split = k.match(/(.*)\.\d+$/);
    return split && split[1];
  });

  return _.compact(arrKeyPaths).reduce(function(pull, k) {
    pull[k] = null;
    return pull;
  }, {});
};

module.exports = getUpdates;