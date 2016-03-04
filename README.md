# circular-json-es6

A replacement for `JSON.stringify` and `JSON.parse` that can handle circular references (persists reference structure).

**This implementation requires environments with native ES6 Map support,** but is decently faster than [circular-json](https://github.com/WebReflection/circular-json) (see benchmark with `npm run bench`).

``` js
var CircularJSON = require('circular-json-es6')

var obj = {}
obj.a = obj

var clone = CircularJSON.parse(CircularJSON.stringify(obj))

clone.a === clone // -> true
```
