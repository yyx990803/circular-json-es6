function encode (data, replacer, list, seen) {
  var stored, key, value, i, l
  var seenIndex = seen.get(data)
  if (seenIndex != null) {
    return seenIndex
  }
  var index = list.length
  if (isPlainObject(data)) {
    stored = {}
    seen.set(data, index)
    list.push(stored)
    var keys = Object.keys(data)
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i]
      value = data[key]
      if (replacer) {
        value = replacer.call(data, key, value)
      }
      stored[key] = encode(value, replacer, list, seen)
    }
  } else if (Array.isArray(data)) {
    stored = []
    seen.set(data, index)
    list.push(stored)
    for (i = 0, l = data.length; i < l; i++) {
      value = data[i]
      if (replacer) {
       value = replacer.call(data, i, value)
      }
      stored[i] = encode(value, replacer, list, seen)
    }
    seen.set(data, list.length)
  } else {
    index = list.length
    list.push(data)
  }
  return index
}

function decode (list, reviver) {
  var i = list.length
  var j, k, data, key, value
  while (i--) {
    var data = list[i]
    if (isPlainObject(data)) {
      var keys = Object.keys(data)
      for (j = 0, k = keys.length; j < k; j++) {
        key = keys[j]
        value = list[data[key]]
        if (reviver) value = reviver.call(data, key, value)
        data[key] = value
      }
    } else if (Array.isArray(data)) {
      for (j = 0, k = data.length; j < k; j++) {
        value = list[data[j]]
        if (reviver) value = reviver.call(data, j, value)
        data[j] = value
      }
    }
  }
}

function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

exports.stringify = function stringify (data, replacer, space) {
  try {
    return JSON.stringify([data])
  } catch (e) {
    var list = []
    encode(data, replacer, list, new Map())
    return space
      ? JSON.stringify(list, null, space) // simply having the space arg makes it slower
      : JSON.stringify(list)
  }
}

exports.parse = function parse (data, reviver) {
  var list = JSON.parse(data)
  if (list.length > 1) {
    decode(list, reviver)
  }
  return list[0]
}
