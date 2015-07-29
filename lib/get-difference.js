var _ = require('underscore');

var Utils = require('./utils');

var level;

var getDifference = function(src, dst, isShallow) {
  if (isShallow > 1)
    level = isShallow;
  else if (isShallow)
    level = 1;

  if (level) {
    src = Utils.rip(src, level);
    dst = Utils.rip(dst, level);
  }

  level = null;
  return compare(src, dst);
};

var compare = function(src, dst) {
  var srcKeys = _.keys(src);
  var dstKeys = _.keys(dst);

  var keys = _.chain([])
    .concat(srcKeys)
    .concat(dstKeys)
    .uniq()
    .value();

  var diff = keys.reduce(function(diff, k) {
    var srcValue = src[k];
    var dstValue = dst[k];

    if (_.isObject(srcValue) && _.isObject(dstValue)) {
      var valueDiff = getDifference(srcValue, dstValue);
      Utils.setFilled(diff, k, valueDiff);
    }

    else if (srcValue !== dstValue) {
      diff[k] = dstValue;
    }

    return diff;
  }, {});

  return diff;
};

module.exports = getDifference;