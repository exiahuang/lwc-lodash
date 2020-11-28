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

var isArray = Array.isArray;

function castArray() {
  if (!arguments.length) {
    return [];
  }
  var value = arguments[0];
  return isArray(value) ? value : [value];
}

function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

function eq(value, other) {
  return value === other || (value !== value && other !== other);
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

var Map = getNative(root, 'Map');

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
var objectProto$3 = Object.prototype;
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

var objectProto$4 = Object.prototype;
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
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

var objectProto$5 = Object.prototype;
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$4.call(object, key) && eq(objValue, value)) ||
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

var objectProto$6 = Object.prototype;
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$5.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

function stubFalse() {
  return false;
}

var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer = moduleExports ? root.Buffer : undefined;
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
var isBuffer = nativeIsBuffer || stubFalse;

var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var MAX_SAFE_INTEGER$1 = 9007199254740991;
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

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

var objectProto$7 = Object.prototype;
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) &&
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

var objectProto$8 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;
  return value === proto;
}

function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var nativeKeys = overArg(Object.keys, Object);

var objectProto$9 = Object.prototype;
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var objectProto$a = Object.prototype;
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];
  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

function keysIn$1(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn$1(source), object);
}

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

function copyArray(source, array) {
  var index = -1,
      length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
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

var objectProto$b = Object.prototype;
var propertyIsEnumerable$1 = objectProto$b.propertyIsEnumerable;
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

function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
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

var getPrototype = overArg(Object.getPrototypeOf, Object);

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

function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
}

var DataView = getNative(root, 'DataView');

var Promise = getNative(root, 'Promise');

var Set = getNative(root, 'Set');

var WeakMap = getNative(root, 'WeakMap');

var mapTag$1 = '[object Map]',
    objectTag$1 = '[object Object]',
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
        Ctor = result == objectTag$1 ? value.constructor : undefined,
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

var objectProto$c = Object.prototype;
var hasOwnProperty$9 = objectProto$c.hasOwnProperty;
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);
  if (length && typeof array[0] == 'string' && hasOwnProperty$9.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var Uint8Array = root.Uint8Array;

function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
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

var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag = '[object Symbol]';
var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
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
    case arrayBufferTag$1:
      return cloneArrayBuffer(object);
    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);
    case dataViewTag$2:
      return cloneDataView(object, isDeep);
    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return cloneTypedArray(object, isDeep);
    case mapTag$2:
      return new Ctor;
    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);
    case regexpTag$1:
      return cloneRegExp(object);
    case setTag$2:
      return new Ctor;
    case symbolTag:
      return cloneSymbol(object);
  }
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

function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

var mapTag$3 = '[object Map]';
function baseIsMap(value) {
  return isObjectLike(value) && getTag$1(value) == mapTag$3;
}

var nodeIsMap = nodeUtil && nodeUtil.isMap;
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

var setTag$3 = '[object Set]';
function baseIsSet(value) {
  return isObjectLike(value) && getTag$1(value) == setTag$3;
}

var nodeIsSet = nodeUtil && nodeUtil.isSet;
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$2 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$1 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';
var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
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
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
cloneableTags[numberTag$2] = cloneableTags[objectTag$2] =
cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
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
    if (tag == objectTag$2 || tag == argsTag$2 || (isFunc && !object)) {
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

var CLONE_SYMBOLS_FLAG$1 = 4;
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG$1);
}

var CLONE_DEEP_FLAG$1 = 1,
    CLONE_SYMBOLS_FLAG$2 = 4;
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$2);
}

var CLONE_DEEP_FLAG$2 = 1,
    CLONE_SYMBOLS_FLAG$3 = 4;
function cloneDeepWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseClone(value, CLONE_DEEP_FLAG$2 | CLONE_SYMBOLS_FLAG$3, customizer);
}

var CLONE_SYMBOLS_FLAG$4 = 4;
function cloneWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseClone(value, CLONE_SYMBOLS_FLAG$4, customizer);
}

function baseConformsTo(object, source, props) {
  var length = props.length;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (length--) {
    var key = props[length],
        predicate = source[key],
        value = object[key];
    if ((value === undefined && !(key in object)) || !predicate(value)) {
      return false;
    }
  }
  return true;
}

function conformsTo(object, source) {
  return source == null || baseConformsTo(object, source, keys(source));
}

function baseGt(value, other) {
  return value > other;
}

var symbolTag$2 = '[object Symbol]';
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag$2);
}

var NAN = 0 / 0;
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

function createRelationalOperation(operator) {
  return function(value, other) {
    if (!(typeof value == 'string' && typeof other == 'string')) {
      value = toNumber(value);
      other = toNumber(other);
    }
    return operator(value, other);
  };
}

var gt = createRelationalOperation(baseGt);

var gte = createRelationalOperation(function(value, other) {
  return value >= other;
});

var arrayBufferTag$3 = '[object ArrayBuffer]';
function baseIsArrayBuffer(value) {
  return isObjectLike(value) && baseGetTag(value) == arrayBufferTag$3;
}

var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer;
var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

var boolTag$3 = '[object Boolean]';
function isBoolean(value) {
  return value === true || value === false ||
    (isObjectLike(value) && baseGetTag(value) == boolTag$3);
}

var dateTag$3 = '[object Date]';
function baseIsDate(value) {
  return isObjectLike(value) && baseGetTag(value) == dateTag$3;
}

var nodeIsDate = nodeUtil && nodeUtil.isDate;
var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

var objectTag$3 = '[object Object]';
var funcProto$2 = Function.prototype,
    objectProto$d = Object.prototype;
var funcToString$2 = funcProto$2.toString;
var hasOwnProperty$a = objectProto$d.hasOwnProperty;
var objectCtorString = funcToString$2.call(Object);
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$a.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}

var mapTag$5 = '[object Map]',
    setTag$5 = '[object Set]';
var objectProto$e = Object.prototype;
var hasOwnProperty$b = objectProto$e.hasOwnProperty;
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag$1(value);
  if (tag == mapTag$5 || tag == setTag$5) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty$b.call(value, key)) {
      return false;
    }
  }
  return true;
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

function mapToArray(map) {
  var index = -1,
      result = Array(map.size);
  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
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
var boolTag$4 = '[object Boolean]',
    dateTag$4 = '[object Date]',
    errorTag$2 = '[object Error]',
    mapTag$6 = '[object Map]',
    numberTag$3 = '[object Number]',
    regexpTag$3 = '[object RegExp]',
    setTag$6 = '[object Set]',
    stringTag$3 = '[object String]',
    symbolTag$3 = '[object Symbol]';
var arrayBufferTag$4 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]';
var symbolProto$1 = Symbol ? Symbol.prototype : undefined,
    symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : undefined;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$4:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag$4:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;
    case boolTag$4:
    case dateTag$4:
    case numberTag$3:
      return eq(+object, +other);
    case errorTag$2:
      return object.name == other.name && object.message == other.message;
    case regexpTag$3:
    case stringTag$3:
      return object == (other + '');
    case mapTag$6:
      var convert = mapToArray;
    case setTag$6:
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
    case symbolTag$3:
      if (symbolValueOf$1) {
        return symbolValueOf$1.call(object) == symbolValueOf$1.call(other);
      }
  }
  return false;
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
var argsTag$3 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    objectTag$4 = '[object Object]';
var objectProto$g = Object.prototype;
var hasOwnProperty$d = objectProto$g.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag$2 : getTag$1(object),
      othTag = othIsArr ? arrayTag$2 : getTag$1(other);
  objTag = objTag == argsTag$3 ? objectTag$4 : objTag;
  othTag = othTag == argsTag$3 ? objectTag$4 : othTag;
  var objIsObj = objTag == objectTag$4,
      othIsObj = othTag == objectTag$4,
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

function isEqual(value, other) {
  return baseIsEqual(value, other);
}

function isEqualWith(value, other, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  var result = customizer ? customizer(value, other) : undefined;
  return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
}

var domExcTag = '[object DOMException]',
    errorTag$3 = '[object Error]';
function isError(value) {
  if (!isObjectLike(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == errorTag$3 || tag == domExcTag ||
    (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
}

var nativeIsFinite = root.isFinite;
function isFinite(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}

var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;
  return result === result ? (remainder ? result - remainder : result) : 0;
}

function isInteger(value) {
  return typeof value == 'number' && value == toInteger(value);
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

function isMatch(object, source) {
  return object === source || baseIsMatch(object, source, getMatchData(source));
}

function isMatchWith(object, source, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseIsMatch(object, source, getMatchData(source), customizer);
}

var numberTag$4 = '[object Number]';
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && baseGetTag(value) == numberTag$4);
}

function isNaN(value) {
  return isNumber(value) && value != +value;
}

var isMaskable = coreJsData ? isFunction : stubFalse;

var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.';
function isNative(value) {
  if (isMaskable(value)) {
    throw new Error(CORE_ERROR_TEXT);
  }
  return baseIsNative(value);
}

function isNil(value) {
  return value == null;
}

function isNull(value) {
  return value === null;
}

var regexpTag$4 = '[object RegExp]';
function baseIsRegExp(value) {
  return isObjectLike(value) && baseGetTag(value) == regexpTag$4;
}

var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;
var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

var MAX_SAFE_INTEGER$2 = 9007199254740991;
function isSafeInteger(value) {
  return isInteger(value) && value >= -MAX_SAFE_INTEGER$2 && value <= MAX_SAFE_INTEGER$2;
}

var stringTag$4 = '[object String]';
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag$4);
}

function isUndefined(value) {
  return value === undefined;
}

var weakMapTag$3 = '[object WeakMap]';
function isWeakMap(value) {
  return isObjectLike(value) && getTag$1(value) == weakMapTag$3;
}

var weakSetTag = '[object WeakSet]';
function isWeakSet(value) {
  return isObjectLike(value) && baseGetTag(value) == weakSetTag;
}

function baseLt(value, other) {
  return value < other;
}

var lt = createRelationalOperation(baseLt);

var lte = createRelationalOperation(function(value, other) {
  return value <= other;
});

function iteratorToArray(iterator) {
  var data,
      result = [];
  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

function asciiToArray(string) {
  return string.split('');
}

var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';
var rsZWJ = '\\u200d';
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

var rsAstralRange$1 = '\\ud800-\\udfff',
    rsComboMarksRange$1 = '\\u0300-\\u036f',
    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
    rsVarRange$1 = '\\ufe0e\\ufe0f';
var rsAstral = '[' + rsAstralRange$1 + ']',
    rsCombo = '[' + rsComboRange$1 + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange$1 + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ$1 = '\\u200d';
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange$1 + ']?',
    rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

var mapTag$7 = '[object Map]',
    setTag$7 = '[object Set]';
var symIterator = Symbol ? Symbol.iterator : undefined;
function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }
  if (symIterator && value[symIterator]) {
    return iteratorToArray(value[symIterator]());
  }
  var tag = getTag$1(value),
      func = tag == mapTag$7 ? mapToArray : (tag == setTag$7 ? setToArray : values);
  return func(value);
}

function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

var MAX_ARRAY_LENGTH = 4294967295;
function toLength(value) {
  return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
}

function toPlainObject(value) {
  return copyObject(value, keysIn$1(value));
}

var MAX_SAFE_INTEGER$3 = 9007199254740991;
function toSafeInteger(value) {
  return value
    ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER$3, MAX_SAFE_INTEGER$3)
    : (value === 0 ? value : 0);
}

var INFINITY$1 = 1 / 0;
var symbolProto$2 = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto$2 ? symbolProto$2.toString : undefined;
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
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

function toString(value) {
  return value == null ? '' : baseToString(value);
}

var lang_default = {
  castArray, clone, cloneDeep, cloneDeepWith, cloneWith,
  conformsTo, eq, gt, gte, isArguments,
  isArray, isArrayBuffer, isArrayLike, isArrayLikeObject, isBoolean,
  isBuffer, isDate, isElement, isEmpty, isEqual,
  isEqualWith, isError, isFinite, isFunction, isInteger,
  isLength, isMap, isMatch, isMatchWith, isNaN,
  isNative, isNil, isNull, isNumber, isObject,
  isObjectLike, isPlainObject, isRegExp, isSafeInteger, isSet,
  isString, isSymbol, isTypedArray, isUndefined, isWeakMap,
  isWeakSet, lt, lte, toArray, toFinite,
  toInteger, toLength, toNumber, toPlainObject, toSafeInteger,
  toString
};

export { castArray, clone, cloneDeep, cloneDeepWith, cloneWith, conformsTo, eq, gt, gte, isArguments, isArray, isArrayBuffer, isArrayLike, isArrayLikeObject, isBoolean, isBuffer, isDate, isElement, isEmpty, isEqual, isEqualWith, isError, isFinite, isFunction, isInteger, isLength, isMap, isMatch, isMatchWith, isNaN, isNative, isNil, isNull, isNumber, isObject, isObjectLike, isPlainObject, isRegExp, isSafeInteger, isSet, isString, isSymbol, isTypedArray, isUndefined, isWeakMap, isWeakSet, lt, lte, toArray, toFinite, toInteger, toLength, toNumber, toPlainObject, toSafeInteger, toString };
