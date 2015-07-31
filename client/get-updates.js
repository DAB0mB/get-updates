(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.getUpdates = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

var Utils = require('./utils');

var getDifference = function(src, dst, isShallow) {
  var level;

  if (isShallow > 1)
    level = isShallow;
  else if (isShallow)
    level = 1;

  if (level) {
    src = Utils.rip(src, level);
    dst = Utils.rip(dst, level);
  }

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils":3}],2:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./get-difference":1,"./utils":3}],3:[function(require,module,exports){
(function (global){
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2])(2)
});