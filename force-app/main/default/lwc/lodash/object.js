/**
* @license
* Lodash (Custom Build) <https://lodash.com/>
* Copyright JS Foundation and other contributors <https://js.foundation/>
* Released under MIT license <https://lodash.com/license>
* Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
* Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
* Build By: ExiaHuang 
* Build Date: 2020-11-28
* lwc-lodash: https://github.com/exiahuang/lwc-lodash
*/

var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function('return this')();

var Symbol = root.Symbol;

var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];
  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var objectProto$1 = Object.prototype;
var nativeObjectToString$1 = objectProto$1.toString;
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';
var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var coreJsData = root['__core-js_shared__'];

var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;
var funcToString$1 = funcProto$1.toString;
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

function getValue(object, key) {
  return object == null ? undefined : object[key];
}

function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var objectProto$3 = Object.prototype;
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$2.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1,
      length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;
    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

function identity(value) {
  return value;
}

function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var nativeMax = Math.max;
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

function constant(value) {
  return function() {
    return value;
  };
}

var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

var HOT_COUNT = 800,
    HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0,
      lastCalled = 0;
  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var setToString = shortOut(baseSetToString);

function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;
    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var objectProto$4 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;
  return value === proto;
}

function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var argsTag = '[object Arguments]';
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

var objectProto$5 = Object.prototype;
var hasOwnProperty$3 = objectProto$5.hasOwnProperty;
var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$3.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArray = Array.isArray;

function stubFalse() {
  return false;
}

var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer = moduleExports ? root.Buffer : undefined;
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
var isBuffer = nativeIsBuffer || stubFalse;

var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
var freeProcess = moduleExports$1 && freeGlobal.process;
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

var objectProto$6 = Object.prototype;
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$4.call(value, key)) &&
        !(skipIndexes && (
           key == 'length' ||
           (isBuff && (key == 'offset' || key == 'parent')) ||
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var nativeKeys = overArg(Object.keys, Object);

var objectProto$7 = Object.prototype;
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$5.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

var objectProto$8 = Object.prototype;
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;
var assign = createAssigner(function(object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty$6.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var objectProto$9 = Object.prototype;
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];
  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$7.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

function keysIn$1(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

var assignIn = createAssigner(function(object, source) {
  copyObject(source, keysIn$1(source), object);
});

var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn$1(source), object, customizer);
});

var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keys(source), object, customizer);
});

var symbolTag = '[object Symbol]';
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var nativeCreate = getNative(Object, 'create');

function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var HASH_UNDEFINED = '__lodash_hash_undefined__';
var objectProto$a = Object.prototype;
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$8.call(data, key) ? data[key] : undefined;
}

var objectProto$b = Object.prototype;
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$9.call(data, key);
}

var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);
  return index < 0 ? undefined : data[index][1];
}

function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

var Map = getNative(root, 'Map');

function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

var FUNC_ERROR_TEXT = 'Expected a function';
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}
memoize.Cache = MapCache;

var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}

var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 ) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var INFINITY = 1 / 0;
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

function toString(value) {
  return value == null ? '' : baseToString(value);
}

function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

var INFINITY$1 = 1 / 0;
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

function baseGet(object, path) {
  path = castPath(path, object);
  var index = 0,
      length = path.length;
  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

function baseAt(object, paths) {
  var index = -1,
      length = paths.length,
      result = Array(length),
      skip = object == null;
  while (++index < length) {
    result[index] = skip ? undefined : get(object, paths[index]);
  }
  return result;
}

function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;
  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);
  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

var at = flatRest(baseAt);

function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

var objectCreate = Object.create;
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

function create(prototype, properties) {
  var result = baseCreate(prototype);
  return properties == null ? result : baseAssign(result, properties);
}

var objectProto$c = Object.prototype;
var hasOwnProperty$a = objectProto$c.hasOwnProperty;
var defaults = baseRest(function(object, sources) {
  object = Object(object);
  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;
  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    length = 1;
  }
  while (++index < length) {
    var source = sources[index];
    var props = keysIn$1(source);
    var propsIndex = -1;
    var propsLength = props.length;
    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];
      if (value === undefined ||
          (eq(value, objectProto$c[key]) && !hasOwnProperty$a.call(object, key))) {
        object[key] = source[key];
      }
    }
  }
  return object;
});

function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);
  this.size = data.size;
  return result;
}

function stackGet(key) {
  return this.__data__.get(key);
}

function stackHas(key) {
  return this.__data__.has(key);
}

var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var baseFor = createBaseFor();

var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;
var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
var Buffer$1 = moduleExports$2 ? root.Buffer : undefined,
    allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}

var Uint8Array = root.Uint8Array;

function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

function copyArray(source, array) {
  var index = -1,
      length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var getPrototype = overArg(Object.getPrototypeOf, Object);

function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

var objectTag$1 = '[object Object]';
var funcProto$2 = Function.prototype,
    objectProto$d = Object.prototype;
var funcToString$2 = funcProto$2.toString;
var hasOwnProperty$b = objectProto$d.hasOwnProperty;
var objectCtorString = funcToString$2.call(Object);
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag$1) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$b.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

function safeGet(object, key) {
  return key == '__proto__'
    ? undefined
    : object[key];
}

function toPlainObject(value) {
  return copyObject(value, keysIn$1(value));
}

function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;
  var isCommon = newValue === undefined;
  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;
      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn$1);
}

function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
    stack['delete'](srcValue);
  }
  return objValue;
}

var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

var defaultsDeep = baseRest(function(args) {
  args.push(undefined, customDefaultsMerge);
  return apply(mergeWith, undefined, args);
});

function baseToPairs(object, props) {
  return arrayMap(props, function(key) {
    return [key, object[key]];
  });
}

var DataView = getNative(root, 'DataView');

var Promise = getNative(root, 'Promise');

var Set = getNative(root, 'Set');

var WeakMap = getNative(root, 'WeakMap');

var mapTag$1 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';
var dataViewTag$1 = '[object DataView]';
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);
var getTag = baseGetTag;
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
    (Map && getTag(new Map) != mapTag$1) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag$1) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$1;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$1;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}
var getTag$1 = getTag;

function mapToArray(map) {
  var index = -1,
      result = Array(map.size);
  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

function setToPairs(set) {
  var index = -1,
      result = Array(set.size);
  set.forEach(function(value) {
    result[++index] = [value, value];
  });
  return result;
}

var mapTag$2 = '[object Map]',
    setTag$2 = '[object Set]';
function createToPairs(keysFunc) {
  return function(object) {
    var tag = getTag$1(object);
    if (tag == mapTag$2) {
      return mapToArray(object);
    }
    if (tag == setTag$2) {
      return setToPairs(object);
    }
    return baseToPairs(object, keysFunc(object));
  };
}

var toPairs = createToPairs(keys);

var toPairsIn = createToPairs(keysIn$1);

function baseFindKey(collection, predicate, eachFunc) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = key;
      return false;
    }
  });
  return result;
}

function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

function setCacheHas(value) {
  return this.__data__.has(value);
}

function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;
  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

function cacheHas(cache, key) {
  return cache.has(key);
}

var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;
  stack.set(array, other);
  stack.set(other, array);
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];
    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

function setToArray(set) {
  var index = -1,
      result = Array(set.size);
  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    mapTag$3 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$3 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]';
var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]';
var symbolProto$1 = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$2:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag$1:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;
    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      return eq(+object, +other);
    case errorTag$1:
      return object.name == other.name && object.message == other.message;
    case regexpTag$1:
    case stringTag$1:
      return object == (other + '');
    case mapTag$3:
      var convert = mapToArray;
    case setTag$3:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = setToArray);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;
    case symbolTag$1:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

function stubArray() {
  return [];
}

var objectProto$e = Object.prototype;
var propertyIsEnumerable$1 = objectProto$e.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

var COMPARE_PARTIAL_FLAG$2 = 1;
var objectProto$f = Object.prototype;
var hasOwnProperty$c = objectProto$f.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$c.call(other, key))) {
      return false;
    }
  }
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];
    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var COMPARE_PARTIAL_FLAG$3 = 1;
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$3 = '[object Object]';
var objectProto$g = Object.prototype;
var hasOwnProperty$d = objectProto$g.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag$1 : getTag$1(object),
      othTag = othIsArr ? arrayTag$1 : getTag$1(other);
  objTag = objTag == argsTag$2 ? objectTag$3 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$3 : othTag;
  var objIsObj = objTag == objectTag$3,
      othIsObj = othTag == objectTag$3,
      isSameTag = objTag == othTag;
  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$d.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$d.call(other, '__wrapped__');
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];
    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

function isStrictComparable(value) {
  return value === value && !isObject(value);
}

function getMatchData(object) {
  var result = keys(object),
      length = result.length;
  while (length--) {
    var key = result[length],
        value = object[key];
    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

function hasPath(object, path, hasFunc) {
  path = castPath(path, object);
  var index = -1,
      length = path.length,
      result = false;
  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

function baseIteratee(value) {
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

function findKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate), baseForOwn);
}

var baseForRight = createBaseFor(true);

function baseForOwnRight(object, iteratee) {
  return object && baseForRight(object, iteratee, keys);
}

function findLastKey(object, predicate) {
  return baseFindKey(object, baseIteratee(predicate), baseForOwnRight);
}

function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

function forIn(object, iteratee) {
  return object == null
    ? object
    : baseFor(object, castFunction(iteratee), keysIn$1);
}

function forInRight(object, iteratee) {
  return object == null
    ? object
    : baseForRight(object, castFunction(iteratee), keysIn$1);
}

function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}

function forOwnRight(object, iteratee) {
  return object && baseForOwnRight(object, castFunction(iteratee));
}

function baseFunctions(object, props) {
  return arrayFilter(props, function(key) {
    return isFunction(object[key]);
  });
}

function functions(object) {
  return object == null ? [] : baseFunctions(object, keys(object));
}

function functionsIn(object) {
  return object == null ? [] : baseFunctions(object, keysIn$1(object));
}

var objectProto$h = Object.prototype;
var hasOwnProperty$e = objectProto$h.hasOwnProperty;
function baseHas(object, key) {
  return object != null && hasOwnProperty$e.call(object, key);
}

function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

function baseInverter(object, setter, iteratee, accumulator) {
  baseForOwn(object, function(value, key, object) {
    setter(accumulator, iteratee(value), key, object);
  });
  return accumulator;
}

function createInverter(setter, toIteratee) {
  return function(object, iteratee) {
    return baseInverter(object, setter, toIteratee(iteratee), {});
  };
}

var objectProto$i = Object.prototype;
var nativeObjectToString$2 = objectProto$i.toString;
var invert = createInverter(function(result, value, key) {
  if (value != null &&
      typeof value.toString != 'function') {
    value = nativeObjectToString$2.call(value);
  }
  result[value] = key;
}, constant(identity));

var objectProto$j = Object.prototype;
var hasOwnProperty$f = objectProto$j.hasOwnProperty;
var nativeObjectToString$3 = objectProto$j.toString;
var invertBy = createInverter(function(result, value, key) {
  if (value != null &&
      typeof value.toString != 'function') {
    value = nativeObjectToString$3.call(value);
  }
  if (hasOwnProperty$f.call(result, value)) {
    result[value].push(key);
  } else {
    result[value] = [key];
  }
}, baseIteratee);

function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;
  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

function baseInvoke(object, path, args) {
  path = castPath(path, object);
  object = parent(object, path);
  var func = object == null ? object : object[toKey(last(path))];
  return func == null ? undefined : apply(func, object, args);
}

var invoke = baseRest(baseInvoke);

function mapKeys(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee);
  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, iteratee(value, key, object), value);
  });
  return result;
}

function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee);
  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}

var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn$1(source), object);
}

function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
}

var objectProto$k = Object.prototype;
var hasOwnProperty$g = objectProto$k.hasOwnProperty;
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);
  if (length && typeof array[0] == 'string' && hasOwnProperty$g.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var reFlags = /\w*$/;
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var symbolProto$2 = Symbol ? Symbol.prototype : undefined,
    symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;
function cloneSymbol(symbol) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}

var boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]';
var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$2:
      return cloneArrayBuffer(object);
    case boolTag$2:
    case dateTag$2:
      return new Ctor(+object);
    case dataViewTag$3:
      return cloneDataView(object, isDeep);
    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return cloneTypedArray(object, isDeep);
    case mapTag$4:
      return new Ctor;
    case numberTag$2:
    case stringTag$2:
      return new Ctor(object);
    case regexpTag$2:
      return cloneRegExp(object);
    case setTag$4:
      return new Ctor;
    case symbolTag$2:
      return cloneSymbol(object);
  }
}

var mapTag$5 = '[object Map]';
function baseIsMap(value) {
  return isObjectLike(value) && getTag$1(value) == mapTag$5;
}

var nodeIsMap = nodeUtil && nodeUtil.isMap;
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

var setTag$5 = '[object Set]';
function baseIsSet(value) {
  return isObjectLike(value) && getTag$1(value) == setTag$5;
}

var nodeIsSet = nodeUtil && nodeUtil.isSet;
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;
var argsTag$3 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$2 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$6 = '[object Map]',
    numberTag$3 = '[object Number]',
    objectTag$4 = '[object Object]',
    regexpTag$3 = '[object RegExp]',
    setTag$6 = '[object Set]',
    stringTag$3 = '[object String]',
    symbolTag$3 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';
var arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';
var cloneableTags = {};
cloneableTags[argsTag$3] = cloneableTags[arrayTag$2] =
cloneableTags[arrayBufferTag$3] = cloneableTags[dataViewTag$4] =
cloneableTags[boolTag$3] = cloneableTags[dateTag$3] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$6] =
cloneableTags[numberTag$3] = cloneableTags[objectTag$4] =
cloneableTags[regexpTag$3] = cloneableTags[setTag$6] =
cloneableTags[stringTag$3] = cloneableTags[symbolTag$3] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$2] = cloneableTags[funcTag$2] =
cloneableTags[weakMapTag$2] = false;
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;
    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$4 || tag == argsTag$3 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
    return result;
  }
  if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
    return result;
  }
  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);
  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

var CLONE_DEEP_FLAG$1 = 1,
    CLONE_FLAT_FLAG$1 = 2,
    CLONE_SYMBOLS_FLAG$1 = 4;
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG$1 | CLONE_FLAT_FLAG$1 | CLONE_SYMBOLS_FLAG$1, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

var FUNC_ERROR_TEXT$1 = 'Expected a function';
function negate(predicate) {
  if (typeof predicate != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0: return !predicate.call(this);
      case 1: return !predicate.call(this, args[0]);
      case 2: return !predicate.call(this, args[0], args[1]);
      case 3: return !predicate.call(this, args[0], args[1], args[2]);
    }
    return !predicate.apply(this, args);
  };
}

function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);
  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;
  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;
    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};
  while (++index < length) {
    var path = paths[index],
        value = baseGet(object, path);
    if (predicate(value, path)) {
      baseSet(result, castPath(path, object), value);
    }
  }
  return result;
}

function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }
  var props = arrayMap(getAllKeysIn(object), function(prop) {
    return [prop];
  });
  predicate = baseIteratee(predicate);
  return basePickBy(object, props, function(value, path) {
    return predicate(value, path[0]);
  });
}

function omitBy(object, predicate) {
  return pickBy(object, negate(baseIteratee(predicate)));
}

function basePick(object, paths) {
  return basePickBy(object, paths, function(value, path) {
    return hasIn(object, path);
  });
}

var pick = flatRest(function(object, paths) {
  return object == null ? {} : basePick(object, paths);
});

function result(object, path, defaultValue) {
  path = castPath(path, object);
  var index = -1,
      length = path.length;
  if (!length) {
    length = 1;
    object = undefined;
  }
  while (++index < length) {
    var value = object == null ? undefined : object[toKey(path[index])];
    if (value === undefined) {
      index = length;
      value = defaultValue;
    }
    object = isFunction(value) ? value.call(object) : value;
  }
  return object;
}

function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

function setWith(object, path, value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseSet(object, path, value, customizer);
}

function transform(object, iteratee, accumulator) {
  var isArr = isArray(object),
      isArrLike = isArr || isBuffer(object) || isTypedArray(object);
  iteratee = baseIteratee(iteratee);
  if (accumulator == null) {
    var Ctor = object && object.constructor;
    if (isArrLike) {
      accumulator = isArr ? new Ctor : [];
    }
    else if (isObject(object)) {
      accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
    }
    else {
      accumulator = {};
    }
  }
  (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
    return iteratee(accumulator, value, index, object);
  });
  return accumulator;
}

function unset(object, path) {
  return object == null ? true : baseUnset(object, path);
}

function baseUpdate(object, path, updater, customizer) {
  return baseSet(object, path, updater(baseGet(object, path)), customizer);
}

function update(object, path, updater) {
  return object == null ? object : baseUpdate(object, path, castFunction(updater));
}

function updateWith(object, path, updater, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
}

function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

function valuesIn(object) {
  return object == null ? [] : baseValues(object, keysIn$1(object));
}

var object_default = {
  assign, assignIn, assignInWith, assignWith, at,
  create, defaults, defaultsDeep, entries: toPairs, entriesIn: toPairsIn,
  extend: assignIn, extendWith: assignInWith, findKey, findLastKey, forIn,
  forInRight, forOwn, forOwnRight, functions, functionsIn,
  get, has, hasIn, invert, invertBy,
  invoke, keys, keysIn: keysIn$1, mapKeys, mapValues,
  merge, mergeWith, omit, omitBy, pick,
  pickBy, result, set, setWith, toPairs,
  toPairsIn, transform, unset, update, updateWith,
  values, valuesIn
};

export { assign, assignIn, assignInWith, assignWith, at, create, defaults, defaultsDeep, toPairs as entries, toPairsIn as entriesIn, assignIn as extend, assignInWith as extendWith, findKey, findLastKey, forIn, forInRight, forOwn, forOwnRight, functions, functionsIn, get, has, hasIn, invert, invertBy, invoke, keys, keysIn$1 as keysIn, mapKeys, mapValues, merge, mergeWith, omit, omitBy, pick, pickBy, result, set, setWith, toPairs, toPairsIn, transform, unset, update, updateWith, values, valuesIn };
