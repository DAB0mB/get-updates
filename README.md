# Get Updates

Deep compares two documents and creates a Mongo updates object, useful when wanting to sync between client and server.
Originaly created as a utility for [angular-meteor](https://github.com/DAB0mB/angular-meteor.git).

## Example

```js
var src = {
  obj: {
    prop: 'value'
  },

  arr: [1, 2, 3]
};

var dst = {
  obj: {
    prop: 'changedValue'
  },

  arr: [1, 2]
};

expect(getUpdates(src, dst)).to.deep.equal({
  $set: {
    'obj.prop': 'newValue'
  },

  $unset: {
    'arr.2': undefined
  },

  $pull: {
    'arr': null
  },
});
```

## Download
The source is available for download from [GitHub](http://github.com/DAB0mB/get-updates).