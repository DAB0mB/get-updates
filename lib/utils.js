var _ = require('underscore');

var rip = function(obj, level) {
  if (level < 1) return {};

  return _.reduce(obj, function(clone, v, k) {
    v = _.isObject(v) ? rip(v, --level) : v;
    clone[k] = v;
    return clone;
  }, {});
};

var toPaths = function(obj) {
  var keys = getKeyPaths(obj);
  var values = getDeepValues(obj);
  return _.object(keys, values);
};

var getKeyPaths = function(obj) {
  var keys = _.keys(obj).map(function(k) {
    var v = obj[k];
    if (!_.isObject(v)) return k;

    return getKeyPaths(v).map(function(subKey) {
      return k + '.' + subKey;
    });
  });

  return _.flatten(keys);
};

var getDeepValues = function(obj) {
  var values = _.values(obj).map(function(v) {
    if (!_.isObject(v))
      return v;
    else
      return getDeepValues(v);
  });

  return _.flatten(values);
};

var setFilled = function(obj, k, v) {
  if (!_.isEmpty(v)) obj[k] = v;
};

var assert = function(result, msg) {
  if (!result) throwErr(msg);
};

var throwErr = function(msg) {
  throw Error('get-updates error - ' + msg);
};

module.exports = {
  rip: rip,
  toPaths: toPaths,
  getKeyPaths: getKeyPaths,
  getDeepValues: getDeepValues,
  setFilled: setFilled,
  assert: assert,
  throwErr: throwErr
};