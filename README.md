# Get Updates

Deep compares two documents and creates a Mongo updates object, useful when wanting to sync between client and server.
Originaly created as a utility for [angular-meteor](https://github.com/Urigo/angular-meteor.git).

## Usage

This module exports a function which gets the following parameters:
- `src` - A source object to compare with.
- `dst` - A destination object to compare to.
- `isShallow` - Represents the deepness level of the comparison, by default, will do a deep comparison. Can either be a truthy value or a number bigger than 1. If truthy, will perform a shallow comparison. If a number bigger than 1, will perform a limited comparison as specified.

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
    'obj.prop': 'changedValue'
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
Alternatively, you can install using Node Package Manager (`npm`):

    npm install mongodb-get-updates