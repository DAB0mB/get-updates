# Get Updates

Deep compares two documents and creates a Mongo updates object, useful when wanting to sync between client and server.
Originaly created as a utility for [angular-meteor](https://github.com/DAB0mB/angular-meteor.git).

## Example

```js
var src = {
  outerFoo: {
    innerFoo: 'foo'
  },

  bar: ['foo', 'bar', 'baz']
};

var dst = {
  outerFoo: {
    innerFoo: 'baz'
  },

  bar: ['foo', 'bar']
};

var updates = getUpdates(src, dst);

/*
 {
   $set: {
     'outerFoo.innerFoo': 'baz'
   },

   $unset: {
     'bar.2': undefined
   },

   $pull: {
     'bar': null
   },
 }
 */
```

## Download
The source is available for download from [GitHub](http://github.com/DAB0mB/get-updates).