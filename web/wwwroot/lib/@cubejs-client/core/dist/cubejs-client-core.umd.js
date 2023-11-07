(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cubejs = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn) {
	  var module = { exports: {} };
		return fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global$1 =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var call$2 = Function.prototype.call;

	var functionCall = call$2.bind ? call$2.bind(call$2) : function () {
	  return call$2.apply(call$2, arguments);
	};

	var $propertyIsEnumerable$2 = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$3 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$3 && !$propertyIsEnumerable$2.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	var f$7 = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$3(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable$2;

	var objectPropertyIsEnumerable = {
		f: f$7
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var FunctionPrototype$3 = Function.prototype;
	var bind$4 = FunctionPrototype$3.bind;
	var call$1 = FunctionPrototype$3.call;
	var callBind = bind$4 && bind$4.bind(call$1);

	var functionUncurryThis = bind$4 ? function (fn) {
	  return fn && callBind(call$1, fn);
	} : function (fn) {
	  return fn && function () {
	    return call$1.apply(fn, arguments);
	  };
	};

	var toString$3 = functionUncurryThis({}.toString);
	var stringSlice$6 = functionUncurryThis(''.slice);

	var classofRaw = function (it) {
	  return stringSlice$6(toString$3(it), 8, -1);
	};

	var Object$5 = global$1.Object;
	var split$1 = functionUncurryThis(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object$5('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split$1(it, '') : Object$5(it);
	} : Object$5;

	var TypeError$l = global$1.TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError$l("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	var isCallable = function (argument) {
	  return typeof argument == 'function';
	};

	var isObject = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable(it);
	};

	var aFunction = function (argument) {
	  return isCallable(argument) ? argument : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$1[namespace]) : global$1[namespace] && global$1[namespace][method];
	};

	var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process$3 = global$1.process;
	var Deno = global$1.Deno;
	var versions = process$3 && process$3.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  var symbol = Symbol();
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && engineV8Version && engineV8Version < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */

	var useSymbolAsUid = nativeSymbol
	  && !Symbol.sham
	  && typeof Symbol.iterator == 'symbol';

	var Object$4 = global$1.Object;

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn('Symbol');
	  return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, Object$4(it));
	};

	var String$5 = global$1.String;

	var tryToString = function (argument) {
	  try {
	    return String$5(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var TypeError$k = global$1.TypeError;

	// `Assert: IsCallable(argument) is true`
	var aCallable = function (argument) {
	  if (isCallable(argument)) return argument;
	  throw TypeError$k(tryToString(argument) + ' is not a function');
	};

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable(func);
	};

	var TypeError$j = global$1.TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
	  if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input))) return val;
	  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
	  throw TypeError$j("Can't convert object to primitive value");
	};

	var isPure = false;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$8 = Object.defineProperty;

	var setGlobal = function (key, value) {
	  try {
	    defineProperty$8(global$1, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    global$1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store$1 = global$1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store$1;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.19.3',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});
	});

	var Object$3 = global$1.Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object$3(requireObjectCoercible(argument));
	};

	var hasOwnProperty = functionUncurryThis({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject(it), key);
	};

	var id = 0;
	var postfix = Math.random();
	var toString$2 = functionUncurryThis(1.0.toString);

	var uid = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$2(++id + postfix, 36);
	};

	var WellKnownSymbolsStore$1 = shared('wks');
	var Symbol$2 = global$1.Symbol;
	var symbolFor = Symbol$2 && Symbol$2['for'];
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$2 : Symbol$2 && Symbol$2.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!hasOwnProperty_1(WellKnownSymbolsStore$1, name) || !(nativeSymbol || typeof WellKnownSymbolsStore$1[name] == 'string')) {
	    var description = 'Symbol.' + name;
	    if (nativeSymbol && hasOwnProperty_1(Symbol$2, name)) {
	      WellKnownSymbolsStore$1[name] = Symbol$2[name];
	    } else if (useSymbolAsUid && symbolFor) {
	      WellKnownSymbolsStore$1[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
	    }
	  } return WellKnownSymbolsStore$1[name];
	};

	var TypeError$i = global$1.TypeError;
	var TO_PRIMITIVE$1 = wellKnownSymbol('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive = function (input, pref) {
	  if (!isObject(input) || isSymbol(input)) return input;
	  var exoticToPrim = getMethod(input, TO_PRIMITIVE$1);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = functionCall(exoticToPrim, input, pref);
	    if (!isObject(result) || isSymbol(result)) return result;
	    throw TypeError$i("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var document$3 = global$1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS$1 = isObject(document$3) && isObject(document$3.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS$1 ? document$3.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	var f$6 = descriptors ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPropertyKey(P);
	  if (ie8DomDefine) try {
	    return $getOwnPropertyDescriptor$1(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwnProperty_1(O, P)) return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$6
	};

	var String$4 = global$1.String;
	var TypeError$h = global$1.TypeError;

	// `Assert: Type(argument) is Object`
	var anObject = function (argument) {
	  if (isObject(argument)) return argument;
	  throw TypeError$h(String$4(argument) + ' is not an object');
	};

	var TypeError$g = global$1.TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty$1 = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	var f$5 = descriptors ? $defineProperty$1 : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return $defineProperty$1(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError$g('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$5
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var functionToString$1 = functionUncurryThis(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable(sharedStore.inspectSource)) {
	  sharedStore.inspectSource = function (it) {
	    return functionToString$1(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap$1 = global$1.WeakMap;

	var nativeWeakMap = isCallable(WeakMap$1) && /native code/.test(inspectSource(WeakMap$1));

	var keys$3 = shared('keys');

	var sharedKey = function (key) {
	  return keys$3[key] || (keys$3[key] = uid(key));
	};

	var hiddenKeys$1 = {};

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$f = global$1.TypeError;
	var WeakMap = global$1.WeakMap;
	var set$1, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set$1(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError$f('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap || sharedStore.state) {
	  var store = sharedStore.state || (sharedStore.state = new WeakMap());
	  var wmget = functionUncurryThis(store.get);
	  var wmhas = functionUncurryThis(store.has);
	  var wmset = functionUncurryThis(store.set);
	  set$1 = function (it, metadata) {
	    if (wmhas(store, it)) throw new TypeError$f(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset(store, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget(store, it) || {};
	  };
	  has = function (it) {
	    return wmhas(store, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys$1[STATE] = true;
	  set$1 = function (it, metadata) {
	    if (hasOwnProperty_1(it, STATE)) throw new TypeError$f(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwnProperty_1(it, STATE);
	  };
	}

	var internalState = {
	  set: set$1,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var FunctionPrototype$2 = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwnProperty_1(FunctionPrototype$2, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE = EXISTS && (!descriptors || (descriptors && getDescriptor(FunctionPrototype$2, 'name').configurable));

	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var redefine = createCommonjsModule(function (module) {
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var name = options && options.name !== undefined ? options.name : key;
	  var state;
	  if (isCallable(value)) {
	    if (String(name).slice(0, 7) === 'Symbol(') {
	      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	    }
	    if (!hasOwnProperty_1(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
	      createNonEnumerableProperty(value, 'name', name);
	    }
	    state = enforceInternalState(value);
	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	    }
	  }
	  if (O === global$1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return isCallable(this) && getInternalState(this).source || inspectSource(this);
	});
	});

	var ceil = Math.ceil;
	var floor$2 = Math.floor;

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- safe
	  return number !== number || number === 0 ? 0 : (number > 0 ? floor$2 : ceil)(number);
	};

	var max$3 = Math.max;
	var min$3 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toIntegerOrInfinity(index);
	  return integer < 0 ? max$3(integer + length, 0) : min$3(integer, length);
	};

	var min$2 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min$2(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike = function (obj) {
	  return toLength(obj.length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$5 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = lengthOfArrayLike(O);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$5(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$5(false)
	};

	var indexOf$1 = arrayIncludes.indexOf;


	var push$7 = functionUncurryThis([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwnProperty_1(hiddenKeys$1, key) && hasOwnProperty_1(O, key) && push$7(result, key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwnProperty_1(O, key = names[i++])) {
	    ~indexOf$1(result, key) || push$7(result, key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys);
	};

	var objectGetOwnPropertyNames = {
		f: f$4
	};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	var f$3 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$3
	};

	var concat$2 = functionUncurryThis([].concat);

	// all object keys, includes non-enumerable and symbols
	var ownKeys$4 = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? concat$2(keys, getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys$4(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwnProperty_1(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : isCallable(detection) ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	  options.name        - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global$1;
	  } else if (STATIC) {
	    target = global$1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$2(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	var bind$3 = functionUncurryThis(functionUncurryThis.bind);

	// optional / simple context binding
	var functionBindContext = function (fn, that) {
	  aCallable(fn);
	  return that === undefined ? fn : bind$3 ? bind$3(fn, that) : function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe
	var isArray = Array.isArray || function isArray(argument) {
	  return classofRaw(argument) == 'Array';
	};

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var test$1 = {};

	test$1[TO_STRING_TAG$3] = 'z';

	var toStringTagSupport = String(test$1) === '[object z]';

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
	var Object$2 = global$1.Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object$2(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	};

	var noop = function () { /* empty */ };
	var empty = [];
	var construct$1 = getBuiltIn('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec$2 = functionUncurryThis(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

	var isConstructorModern = function (argument) {
	  if (!isCallable(argument)) return false;
	  try {
	    construct$1(noop, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function (argument) {
	  if (!isCallable(argument)) return false;
	  switch (classof(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction': return false;
	    // we can't check .prototype since constructors produced by .bind haven't it
	  } return INCORRECT_TO_STRING || !!exec$2(constructorRegExp, inspectSource(argument));
	};

	// `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor
	var isConstructor = !construct$1 || fails(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call)
	    || !isConstructorModern(Object)
	    || !isConstructorModern(function () { called = true; })
	    || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var SPECIES$6 = wellKnownSymbol('species');
	var Array$4 = global$1.Array;

	// a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesConstructor = function (originalArray) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (isConstructor(C) && (C === Array$4 || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES$6];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? Array$4 : C;
	};

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var push$6 = functionUncurryThis([].push);

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
	var createMethod$4 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var IS_FILTER_REJECT = TYPE == 7;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that);
	    var length = lengthOfArrayLike(self);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push$6(target, value);      // filter
	        } else switch (TYPE) {
	          case 4: return false;             // every
	          case 7: push$6(target, value);      // filterReject
	        }
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$4(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$4(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$4(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$4(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$4(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$4(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$4(6),
	  // `Array.prototype.filterReject` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterReject: createMethod$4(7)
	};

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $forEach$1 = arrayIteration.forEach;


	var STRICT_METHOD$5 = arrayMethodIsStrict('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	var arrayForEach = !STRICT_METHOD$5 ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`


	var classList = documentCreateElement('span').classList;
	var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

	var domTokenListPrototype = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

	var handlePrototype$1 = function (CollectionPrototype) {
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	};

	for (var COLLECTION_NAME$1 in domIterables) {
	  if (domIterables[COLLECTION_NAME$1]) {
	    handlePrototype$1(global$1[COLLECTION_NAME$1] && global$1[COLLECTION_NAME$1].prototype);
	  }
	}

	handlePrototype$1(domTokenListPrototype);

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	var FAILS_ON_PRIMITIVES$2 = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var FunctionPrototype$1 = Function.prototype;
	var apply = FunctionPrototype$1.apply;
	var bind$2 = FunctionPrototype$1.bind;
	var call = FunctionPrototype$1.call;

	// eslint-disable-next-line es/no-reflect -- safe
	var functionApply = typeof Reflect == 'object' && Reflect.apply || (bind$2 ? call.bind(apply) : function () {
	  return call.apply(apply, arguments);
	});

	var String$3 = global$1.String;

	var toString$1 = function (argument) {
	  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return String$3(argument);
	};

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], props[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */

	var GT = '>';
	var LT = '<';
	var PROTOTYPE$1 = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE$1][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys$1[IE_PROTO$1] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE$1] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE$1] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPropertyKey(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var Array$3 = global$1.Array;
	var max$2 = Math.max;

	var arraySliceSimple = function (O, start, end) {
	  var length = lengthOfArrayLike(O);
	  var k = toAbsoluteIndex(start, length);
	  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	  var result = Array$3(max$2(fin - k, 0));
	  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
	  result.length = n;
	  return result;
	};

	/* eslint-disable es/no-object-getownpropertynames -- safe */

	var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;


	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return $getOwnPropertyNames$1(it);
	  } catch (error) {
	    return arraySliceSimple(windowNames);
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$2 = function getOwnPropertyNames(it) {
	  return windowNames && classofRaw(it) == 'Window'
	    ? getWindowNames(it)
	    : $getOwnPropertyNames$1(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$2
	};

	var arraySlice$1 = functionUncurryThis([].slice);

	var f$1 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$1
	};

	var path$1 = global$1;

	var defineProperty$7 = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path$1.Symbol || (path$1.Symbol = {});
	  if (!hasOwnProperty_1(Symbol, NAME)) defineProperty$7(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var defineProperty$6 = objectDefineProperty.f;



	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !hasOwnProperty_1(it = STATIC ? it : it.prototype, TO_STRING_TAG$1)) {
	    defineProperty$6(it, TO_STRING_TAG$1, { configurable: true, value: TAG });
	  }
	};

	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	var setInternalState$5 = internalState.set;
	var getInternalState$4 = internalState.getterFor(SYMBOL);

	var ObjectPrototype$2 = Object[PROTOTYPE];
	var $Symbol = global$1.Symbol;
	var SymbolPrototype$1 = $Symbol && $Symbol[PROTOTYPE];
	var TypeError$e = global$1.TypeError;
	var QObject = global$1.QObject;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty = objectDefineProperty.f;
	var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable = objectPropertyIsEnumerable.f;
	var push$5 = functionUncurryThis([].push);

	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore = shared('wks');

	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty({}, 'a', {
	    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$2, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype$2[P];
	  nativeDefineProperty(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$2) {
	    nativeDefineProperty(ObjectPrototype$2, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty;

	var wrap$1 = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate(SymbolPrototype$1);
	  setInternalState$5(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype$2) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPropertyKey(P);
	  anObject(Attributes);
	  if (hasOwnProperty_1(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!hasOwnProperty_1(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (hasOwnProperty_1(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!descriptors || functionCall($propertyIsEnumerable$1, properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable$1 = function propertyIsEnumerable(V) {
	  var P = toPropertyKey(V);
	  var enumerable = functionCall(nativePropertyIsEnumerable, this, P);
	  if (this === ObjectPrototype$2 && hasOwnProperty_1(AllSymbols, P) && !hasOwnProperty_1(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !hasOwnProperty_1(this, P) || !hasOwnProperty_1(AllSymbols, P) || hasOwnProperty_1(this, HIDDEN) && this[HIDDEN][P]
	    ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPropertyKey(P);
	  if (it === ObjectPrototype$2 && hasOwnProperty_1(AllSymbols, key) && !hasOwnProperty_1(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && hasOwnProperty_1(AllSymbols, key) && !(hasOwnProperty_1(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!hasOwnProperty_1(AllSymbols, key) && !hasOwnProperty_1(hiddenKeys$1, key)) push$5(result, key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$2;
	  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (hasOwnProperty_1(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwnProperty_1(ObjectPrototype$2, key))) {
	      push$5(result, AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.es/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (objectIsPrototypeOf(SymbolPrototype$1, this)) throw TypeError$e('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : toString$1(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype$2) functionCall(setter, ObjectPrototypeSymbols, value);
	      if (hasOwnProperty_1(this, HIDDEN) && hasOwnProperty_1(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$2, tag, { configurable: true, set: setter });
	    return wrap$1(tag, description);
	  };

	  SymbolPrototype$1 = $Symbol[PROTOTYPE];

	  redefine(SymbolPrototype$1, 'toString', function toString() {
	    return getInternalState$4(this).tag;
	  });

	  redefine($Symbol, 'withoutSetter', function (description) {
	    return wrap$1(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable$1;
	  objectDefineProperty.f = $defineProperty;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap$1(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty(SymbolPrototype$1, 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState$4(this).description;
	      }
	    });
	    {
	      redefine(ObjectPrototype$2, 'propertyIsEnumerable', $propertyIsEnumerable$1, { unsafe: true });
	    }
	  }
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  // `Symbol.for` method
	  // https://tc39.es/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = toString$1(key);
	    if (hasOwnProperty_1(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.es/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError$e(sym + ' is not a symbol');
	    if (hasOwnProperty_1(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.es/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.es/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.es/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return objectGetOwnPropertySymbols.f(toObject(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.es/ecma262/#sec-json.stringify
	if ($stringify) {
	  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
	    var symbol = $Symbol();
	    // MS Edge converts symbol values to JSON as {}
	    return $stringify([symbol]) != '[null]'
	      // WebKit converts symbol values to JSON as null
	      || $stringify({ a: symbol }) != '{}'
	      // V8 throws on boxed symbols
	      || $stringify(Object(symbol)) != '{}';
	  });

	  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
	    // eslint-disable-next-line no-unused-vars -- required for `.length`
	    stringify: function stringify(it, replacer, space) {
	      var args = arraySlice$1(arguments);
	      var $replacer = replacer;
	      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	      if (!isArray(replacer)) replacer = function (key, value) {
	        if (isCallable($replacer)) value = functionCall($replacer, this, key, value);
	        if (!isSymbol(value)) return value;
	      };
	      args[1] = replacer;
	      return functionApply($stringify, null, args);
	    }
	  });
	}

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!SymbolPrototype$1[TO_PRIMITIVE]) {
	  var valueOf = SymbolPrototype$1.valueOf;
	  // eslint-disable-next-line no-unused-vars -- required for .length
	  redefine(SymbolPrototype$1, TO_PRIMITIVE, function (hint) {
	    // TODO: improve hint logic
	    return functionCall(valueOf, this);
	  });
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys$1[HIDDEN] = true;

	var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;


	var FAILS_ON_PRIMITIVES$1 = fails(function () { nativeGetOwnPropertyDescriptor(1); });
	var FORCED$5 = !descriptors || FAILS_ON_PRIMITIVES$1;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	_export({ target: 'Object', stat: true, forced: FORCED$5, sham: !descriptors }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
	  }
	});

	// `Object.getOwnPropertyDescriptors` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	_export({ target: 'Object', stat: true, sham: !descriptors }, {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = toIndexedObject(object);
	    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	    var keys = ownKeys$4(O);
	    var result = {};
	    var index = 0;
	    var key, descriptor;
	    while (keys.length > index) {
	      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
	      if (descriptor !== undefined) createProperty(result, key, descriptor);
	    }
	    return result;
	  }
	});

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	_export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
	  defineProperties: objectDefineProperties
	});

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	_export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
	  defineProperty: objectDefineProperty.f
	});

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArrayLimit(arr, i) {
	  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

	  if (_i == null) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;

	  var _s, _e;

	  try {
	    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) {
	    arr2[i] = arr[i];
	  }

	  return arr2;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	  }, _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  Object.defineProperty(Constructor, "prototype", {
	    writable: false
	  });
	  return Constructor;
	}

	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
	  try {
	    var info = gen[key](arg);
	    var value = info.value;
	  } catch (error) {
	    reject(error);
	    return;
	  }

	  if (info.done) {
	    resolve(value);
	  } else {
	    Promise.resolve(value).then(_next, _throw);
	  }
	}

	function _asyncToGenerator(fn) {
	  return function () {
	    var self = this,
	        args = arguments;
	    return new Promise(function (resolve, reject) {
	      var gen = fn.apply(self, args);

	      function _next(value) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
	      }

	      function _throw(err) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
	      }

	      _next(undefined);
	    });
	  };
	}

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var runtime_1 = createCommonjsModule(function (module) {
	var runtime = (function (exports) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  function define(obj, key, value) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	    return obj[key];
	  }
	  try {
	    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
	    define({}, "");
	  } catch (err) {
	    define = function(obj, key, value) {
	      return obj[key] = value;
	    };
	  }

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  exports.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  define(IteratorPrototype, iteratorSymbol, function () {
	    return this;
	  });

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = GeneratorFunctionPrototype;
	  define(Gp, "constructor", GeneratorFunctionPrototype);
	  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
	  GeneratorFunction.displayName = define(
	    GeneratorFunctionPrototype,
	    toStringTagSymbol,
	    "GeneratorFunction"
	  );

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      define(prototype, method, function(arg) {
	        return this._invoke(method, arg);
	      });
	    });
	  }

	  exports.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  exports.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      define(genFun, toStringTagSymbol, "GeneratorFunction");
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  exports.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return PromiseImpl.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return PromiseImpl.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function(error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new PromiseImpl(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
	    return this;
	  });
	  exports.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    if (PromiseImpl === void 0) PromiseImpl = Promise;

	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList),
	      PromiseImpl
	    );

	    return exports.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        // Note: ["return"] must be used for ES3 parsing compatibility.
	        if (delegate.iterator["return"]) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined$1;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  define(Gp, toStringTagSymbol, "Generator");

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  define(Gp, iteratorSymbol, function() {
	    return this;
	  });

	  define(Gp, "toString", function() {
	    return "[object Generator]";
	  });

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  exports.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined$1;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  exports.values = values;

	  function doneResult() {
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined$1;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined$1;
	      }

	      return ContinueSentinel;
	    }
	  };

	  // Regardless of whether this script is executing as a CommonJS module
	  // or not, return the runtime object so that we can declare the variable
	  // regeneratorRuntime in the outer scope, which allows this module to be
	  // injected easily by `bin/regenerator --include-runtime script.js`.
	  return exports;

	}(
	  // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	  module.exports 
	));

	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  // This module should not be running in strict mode, so the above
	  // assignment should always work unless something is misconfigured. Just
	  // in case runtime.js accidentally runs in strict mode, in modern engines
	  // we can explicitly access globalThis. In older engines we can escape
	  // strict mode using a global Function call. This could conceivably fail
	  // if a Content Security Policy forbids using Function, but in that case
	  // the proper solution is to fix the accidental strict mode problem. If
	  // you've misconfigured your bundler to force strict mode and applied a
	  // CSP to forbid Function, and you're not willing to fix either of those
	  // problems, please detail your unique predicament in a GitHub issue.
	  if (typeof globalThis === "object") {
	    globalThis.regeneratorRuntime = runtime;
	  } else {
	    Function("r", "regeneratorRuntime = r")(runtime);
	  }
	}
	});

	var regenerator = runtime_1;

	var nativePromiseConstructor = global$1.Promise;

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var String$2 = global$1.String;
	var TypeError$d = global$1.TypeError;

	var aPossiblePrototype = function (argument) {
	  if (typeof argument == 'object' || isCallable(argument)) return argument;
	  throw TypeError$d("Can't set " + String$2(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */

	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    setter = functionUncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var SPECIES$5 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$5]) {
	    defineProperty(Constructor, SPECIES$5, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var TypeError$c = global$1.TypeError;

	var anInstance = function (it, Prototype) {
	  if (objectIsPrototypeOf(Prototype, it)) return it;
	  throw TypeError$c('Incorrect invocation');
	};

	var iterators = {};

	var ITERATOR$8 = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$8] === it);
	};

	var ITERATOR$7 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return getMethod(it, ITERATOR$7)
	    || getMethod(it, '@@iterator')
	    || iterators[classof(it)];
	};

	var TypeError$b = global$1.TypeError;

	var getIterator = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
	  if (aCallable(iteratorMethod)) return anObject(functionCall(iteratorMethod, argument));
	  throw TypeError$b(tryToString(argument) + ' is not iterable');
	};

	var iteratorClose = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject(iterator);
	  try {
	    innerResult = getMethod(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }
	    innerResult = functionCall(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject(innerResult);
	  return value;
	};

	var TypeError$a = global$1.TypeError;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var ResultPrototype = Result.prototype;

	var iterate = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = functionBindContext(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose(iterator, 'normal', condition);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    } return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (!iterFn) throw TypeError$a(tryToString(iterable) + ' is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && objectIsPrototypeOf(ResultPrototype, result)) return result;
	      } return new Result(false);
	    }
	    iterator = getIterator(iterable, iterFn);
	  }

	  next = iterator.next;
	  while (!(step = functionCall(next, iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose(iterator, 'throw', error);
	    }
	    if (typeof result == 'object' && result && objectIsPrototypeOf(ResultPrototype, result)) return result;
	  } return new Result(false);
	};

	var ITERATOR$6 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$6] = function () {
	    return this;
	  };
	  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$6] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var TypeError$9 = global$1.TypeError;

	// `Assert: IsConstructor(argument) is true`
	var aConstructor = function (argument) {
	  if (isConstructor(argument)) return argument;
	  throw TypeError$9(tryToString(argument) + ' is not a constructor');
	};

	var SPECIES$4 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aConstructor(S);
	};

	var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(engineUserAgent);

	var engineIsNode = classofRaw(global$1.process) == 'process';

	var set = global$1.setImmediate;
	var clear = global$1.clearImmediate;
	var process$2 = global$1.process;
	var Dispatch = global$1.Dispatch;
	var Function$3 = global$1.Function;
	var MessageChannel = global$1.MessageChannel;
	var String$1 = global$1.String;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var location, defer, channel, port;

	try {
	  // Deno throws a ReferenceError on `location` access without `--location` flag
	  location = global$1.location;
	} catch (error) { /* empty */ }

	var run = function (id) {
	  if (hasOwnProperty_1(queue, id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global$1.postMessage(String$1(id), location.protocol + '//' + location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set || !clear) {
	  set = function setImmediate(fn) {
	    var args = arraySlice$1(arguments, 1);
	    queue[++counter] = function () {
	      functionApply(isCallable(fn) ? fn : Function$3(fn), undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (engineIsNode) {
	    defer = function (id) {
	      process$2.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !engineIsIos) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = functionBindContext(port.postMessage, port);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    global$1.addEventListener &&
	    isCallable(global$1.postMessage) &&
	    !global$1.importScripts &&
	    location && location.protocol !== 'file:' &&
	    !fails(post)
	  ) {
	    defer = post;
	    global$1.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
	    defer = function (id) {
	      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task$1 = {
	  set: set,
	  clear: clear
	};

	var engineIsIosPebble = /ipad|iphone|ipod/i.test(engineUserAgent) && global$1.Pebble !== undefined;

	var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var macrotask = task$1.set;





	var MutationObserver = global$1.MutationObserver || global$1.WebKitMutationObserver;
	var document$2 = global$1.document;
	var process$1 = global$1.process;
	var Promise$1 = global$1.Promise;
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$1(global$1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify$1, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (engineIsNode && (parent = process$1.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify$1();
	        else last = undefined;
	        throw error;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
	  if (!engineIsIos && !engineIsNode && !engineIsWebosWebkit && MutationObserver && document$2) {
	    toggle = true;
	    node = document$2.createTextNode('');
	    new MutationObserver(flush).observe(node, { characterData: true });
	    notify$1 = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (!engineIsIosPebble && Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    // workaround of WebKit ~ iOS Safari 10.1 bug
	    promise.constructor = Promise$1;
	    then = functionBindContext(promise.then, promise);
	    notify$1 = function () {
	      then(flush);
	    };
	  // Node.js without promises
	  } else if (engineIsNode) {
	    notify$1 = function () {
	      process$1.nextTick(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    // strange IE + webpack dev server bug - use .bind(global)
	    macrotask = functionBindContext(macrotask, global$1);
	    notify$1 = function () {
	      macrotask(flush);
	    };
	  }
	}

	var microtask = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last) last.next = task;
	  if (!head) {
	    head = task;
	    notify$1();
	  } last = task;
	};

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aCallable(resolve);
	  this.reject = aCallable(reject);
	};

	// `NewPromiseCapability` abstract operation
	// https://tc39.es/ecma262/#sec-newpromisecapability
	var f = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability$1 = {
		f: f
	};

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability$1.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var hostReportErrors = function (a, b) {
	  var console = global$1.console;
	  if (console && console.error) {
	    arguments.length == 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var engineIsBrowser = typeof window == 'object';

	var task = task$1.set;












	var SPECIES$3 = wellKnownSymbol('species');
	var PROMISE = 'Promise';

	var getInternalState$3 = internalState.getterFor(PROMISE);
	var setInternalState$4 = internalState.set;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var NativePromisePrototype = nativePromiseConstructor && nativePromiseConstructor.prototype;
	var PromiseConstructor = nativePromiseConstructor;
	var PromisePrototype = NativePromisePrototype;
	var TypeError$8 = global$1.TypeError;
	var document$1 = global$1.document;
	var process = global$1.process;
	var newPromiseCapability = newPromiseCapability$1.f;
	var newGenericPromiseCapability = newPromiseCapability;

	var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$1.dispatchEvent);
	var NATIVE_REJECTION_EVENT = isCallable(global$1.PromiseRejectionEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var SUBCLASSING = false;

	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	var FORCED$4 = isForced_1(PROMISE, function () {
	  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(PromiseConstructor);
	  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(PromiseConstructor);
	  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	  // We can't detect it synchronously, so just check versions
	  if (!GLOBAL_CORE_JS_PROMISE && engineV8Version === 66) return true;
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (engineV8Version >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
	  // Detect correctness of subclassing with @@species support
	  var promise = new PromiseConstructor(function (resolve) { resolve(1); });
	  var FakePromise = function (exec) {
	    exec(function () { /* empty */ }, function () { /* empty */ });
	  };
	  var constructor = promise.constructor = {};
	  constructor[SPECIES$3] = FakePromise;
	  SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
	  if (!SUBCLASSING) return true;
	  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	  return !GLOBAL_CORE_JS_PROMISE && engineIsBrowser && !NATIVE_REJECTION_EVENT;
	});

	var INCORRECT_ITERATION$1 = FORCED$4 || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && isCallable(then = it.then) ? then : false;
	};

	var notify = function (state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED;
	    var index = 0;
	    // variable length - can't use forEach
	    while (chain.length > index) {
	      var reaction = chain[index++];
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
	            state.rejection = HANDLED;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // can throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$8('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            functionCall(then, result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    }
	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$1.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global$1.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (!NATIVE_REJECTION_EVENT && (handler = global$1['on' + name])) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (state) {
	  functionCall(task, global$1, function () {
	    var promise = state.facade;
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (engineIsNode) {
	          process.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = engineIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (state) {
	  functionCall(task, global$1, function () {
	    var promise = state.facade;
	    if (engineIsNode) {
	      process.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind$1 = function (fn, state, unwrap) {
	  return function (value) {
	    fn(state, value, unwrap);
	  };
	};

	var internalReject = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify(state, true);
	};

	var internalResolve = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (state.facade === value) throw TypeError$8("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask(function () {
	        var wrapper = { done: false };
	        try {
	          functionCall(then, value,
	            bind$1(internalResolve, wrapper, state),
	            bind$1(internalReject, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify(state, false);
	    }
	  } catch (error) {
	    internalReject({ done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED$4) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromisePrototype);
	    aCallable(executor);
	    functionCall(Internal, this);
	    var state = getInternalState$3(this);
	    try {
	      executor(bind$1(internalResolve, state), bind$1(internalReject, state));
	    } catch (error) {
	      internalReject(state, error);
	    }
	  };
	  PromisePrototype = PromiseConstructor.prototype;
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  Internal = function Promise(executor) {
	    setInternalState$4(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };
	  Internal.prototype = redefineAll(PromisePrototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.es/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reactions = state.reactions;
	      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
	      reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
	      reaction.fail = isCallable(onRejected) && onRejected;
	      reaction.domain = engineIsNode ? process.domain : undefined;
	      state.parent = true;
	      reactions[reactions.length] = reaction;
	      if (state.state != PENDING) notify(state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.es/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState$3(promise);
	    this.promise = promise;
	    this.resolve = bind$1(internalResolve, state);
	    this.reject = bind$1(internalReject, state);
	  };
	  newPromiseCapability$1.f = newPromiseCapability = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if (isCallable(nativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
	    nativeThen = NativePromisePrototype.then;

	    if (!SUBCLASSING) {
	      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
	      redefine(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
	        var that = this;
	        return new PromiseConstructor(function (resolve, reject) {
	          functionCall(nativeThen, that, resolve, reject);
	        }).then(onFulfilled, onRejected);
	      // https://github.com/zloirock/core-js/issues/640
	      }, { unsafe: true });

	      // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
	      redefine(NativePromisePrototype, 'catch', PromisePrototype['catch'], { unsafe: true });
	    }

	    // make `.constructor === Promise` work for native promise-based APIs
	    try {
	      delete NativePromisePrototype.constructor;
	    } catch (error) { /* empty */ }

	    // make `instanceof Promise` work for native promise-based APIs
	    if (objectSetPrototypeOf) {
	      objectSetPrototypeOf(NativePromisePrototype, PromisePrototype);
	    }
	  }
	}

	_export({ global: true, wrap: true, forced: FORCED$4 }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	PromiseWrapper = getBuiltIn(PROMISE);

	// statics
	_export({ target: PROMISE, stat: true, forced: FORCED$4 }, {
	  // `Promise.reject` method
	  // https://tc39.es/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    functionCall(capability.reject, undefined, r);
	    return capability.promise;
	  }
	});

	_export({ target: PROMISE, stat: true, forced: FORCED$4 }, {
	  // `Promise.resolve` method
	  // https://tc39.es/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve(this, x);
	  }
	});

	_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 }, {
	  // `Promise.all` method
	  // https://tc39.es/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aCallable(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        remaining++;
	        functionCall($promiseResolve, C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.es/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aCallable(C.resolve);
	      iterate(iterable, function (promise) {
	        functionCall($promiseResolve, C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	// `Array.isArray` method
	// https://tc39.es/ecma262/#sec-array.isarray
	_export({ target: 'Array', stat: true }, {
	  isArray: isArray
	});

	var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check
	var Function$2 = global$1.Function;

	var wrap = function (scheduler) {
	  return function (handler, timeout /* , ...arguments */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? arraySlice$1(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      functionApply(isCallable(handler) ? handler : Function$2(handler), this, args);
	    } : handler, timeout);
	  };
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	_export({ global: true, bind: true, forced: MSIE }, {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap(global$1.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap(global$1.setInterval)
	});

	var SPECIES$2 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$2] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var $filter = arrayIteration.filter;


	var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('filter');

	// `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $map = arrayIteration.map;


	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');

	// `Array.prototype.map` method
	// https://tc39.es/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $propertyIsEnumerable = objectPropertyIsEnumerable.f;

	var propertyIsEnumerable = functionUncurryThis($propertyIsEnumerable);
	var push$4 = functionUncurryThis([].push);

	// `Object.{ entries, values }` methods implementation
	var createMethod$3 = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject(it);
	    var keys = objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!descriptors || propertyIsEnumerable(O, key)) {
	        push$4(result, TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.es/ecma262/#sec-object.entries
	  entries: createMethod$3(true),
	  // `Object.values` method
	  // https://tc39.es/ecma262/#sec-object.values
	  values: createMethod$3(false)
	};

	var $entries = objectToArray.entries;

	// `Object.entries` method
	// https://tc39.es/ecma262/#sec-object.entries
	_export({ target: 'Object', stat: true }, {
	  entries: function entries(O) {
	    return $entries(O);
	  }
	});

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    isCallable(NewTarget = dummy.constructor) &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	// `thisNumberValue` abstract operation
	// https://tc39.es/ecma262/#sec-thisnumbervalue
	var thisNumberValue = functionUncurryThis(1.0.valueOf);

	// a string of all valid unicode whitespaces
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
	  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var replace$4 = functionUncurryThis(''.replace);
	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$2 = function (TYPE) {
	  return function ($this) {
	    var string = toString$1(requireObjectCoercible($this));
	    if (TYPE & 1) string = replace$4(string, ltrim, '');
	    if (TYPE & 2) string = replace$4(string, rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$2(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimend
	  end: createMethod$2(2),
	  // `String.prototype.trim` method
	  // https://tc39.es/ecma262/#sec-string.prototype.trim
	  trim: createMethod$2(3)
	};

	var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var defineProperty$5 = objectDefineProperty.f;

	var trim$1 = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global$1[NUMBER];
	var NumberPrototype = NativeNumber.prototype;
	var TypeError$7 = global$1.TypeError;
	var arraySlice = functionUncurryThis(''.slice);
	var charCodeAt$1 = functionUncurryThis(''.charCodeAt);

	// `ToNumeric` abstract operation
	// https://tc39.es/ecma262/#sec-tonumeric
	var toNumeric = function (value) {
	  var primValue = toPrimitive(value, 'number');
	  return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
	};

	// `ToNumber` abstract operation
	// https://tc39.es/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, 'number');
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (isSymbol(it)) throw TypeError$7('Cannot convert a Symbol value to a number');
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim$1(it);
	    first = charCodeAt$1(it, 0);
	    if (first === 43 || first === 45) {
	      third = charCodeAt$1(it, 2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (charCodeAt$1(it, 1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = arraySlice(it, 2);
	      length = digits.length;
	      for (index = 0; index < length; index++) {
	        code = charCodeAt$1(digits, index);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.es/ecma262/#sec-number-constructor
	if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
	    var dummy = this;
	    // check on 1..constructor(foo) case
	    return objectIsPrototypeOf(NumberPrototype, dummy) && fails(function () { thisNumberValue(dummy); })
	      ? inheritIfRequired(Object(n), dummy, NumberWrapper) : n;
	  };
	  for (var keys$2 = descriptors ? getOwnPropertyNames$1(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
	    // ESNext
	    'fromString,range'
	  ).split(','), j = 0, key; keys$2.length > j; j++) {
	    if (hasOwnProperty_1(NativeNumber, key = keys$2[j]) && !hasOwnProperty_1(NumberWrapper, key)) {
	      defineProperty$5(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine(global$1, NUMBER, NumberWrapper);
	}

	// Unique ID creation requires a high quality random # generator. In the browser we therefore
	// require the crypto API and do not support built-in fallback to lower quality random number
	// generators (like Math.random()).
	var getRandomValues;
	var rnds8 = new Uint8Array(16);
	function rng() {
	  // lazy load so that environments that need to polyfill have a chance to do so
	  if (!getRandomValues) {
	    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
	    // find the complete implementation of crypto (msCrypto) on IE11.
	    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

	    if (!getRandomValues) {
	      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
	    }
	  }

	  return getRandomValues(rnds8);
	}

	var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

	function validate(uuid) {
	  return typeof uuid === 'string' && REGEX.test(uuid);
	}

	/**
	 * Convert array of 16 byte values to UUID string format of the form:
	 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */

	var byteToHex = [];

	for (var i = 0; i < 256; ++i) {
	  byteToHex.push((i + 0x100).toString(16).substr(1));
	}

	function stringify(arr) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	  // Note: Be careful editing this code!  It's been tuned for performance
	  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
	  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
	  // of the following:
	  // - One or more input array values don't map to a hex octet (leading to
	  // "undefined" in the uuid)
	  // - Invalid input values for the RFC `version` or `variant` fields

	  if (!validate(uuid)) {
	    throw TypeError('Stringified UUID is invalid');
	  }

	  return uuid;
	}

	function v4(options, buf, offset) {
	  options = options || {};
	  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

	  rnds[6] = rnds[6] & 0x0f | 0x40;
	  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

	  if (buf) {
	    offset = offset || 0;

	    for (var i = 0; i < 16; ++i) {
	      buf[offset + i] = rnds[i];
	    }

	    return buf;
	  }

	  return stringify(rnds);
	}

	function _objectWithoutPropertiesLoose(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;

	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }

	  return target;
	}

	function _objectWithoutProperties(source, excluded) {
	  if (source == null) return {};
	  var target = _objectWithoutPropertiesLoose(source, excluded);
	  var key, i;

	  if (Object.getOwnPropertySymbols) {
	    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

	    for (i = 0; i < sourceSymbolKeys.length; i++) {
	      key = sourceSymbolKeys[i];
	      if (excluded.indexOf(key) >= 0) continue;
	      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
	      target[key] = source[key];
	    }
	  }

	  return target;
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}

	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO = sharedKey('IE_PROTO');
	var Object$1 = global$1.Object;
	var ObjectPrototype$1 = Object$1.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object$1.getPrototypeOf : function (O) {
	  var object = toObject(O);
	  if (hasOwnProperty_1(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;
	  if (isCallable(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  } return object instanceof Object$1 ? ObjectPrototype$1 : null;
	};

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS$1 = false;

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

	/* eslint-disable es/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype$2[ITERATOR$5].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable(IteratorPrototype$2[ITERATOR$5])) {
	  redefine(IteratorPrototype$2, ITERATOR$5, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var PROPER_FUNCTION_NAME$2 = functionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
	var IteratorPrototype = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$4]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
	        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$4])) {
	          redefine(CurrentIteratorPrototype, ITERATOR$4, returnThis);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
	  if (PROPER_FUNCTION_NAME$2 && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    if (CONFIGURABLE_FUNCTION_NAME) {
	      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
	    } else {
	      INCORRECT_VALUES_NAME = true;
	      defaultIterator = function values() { return functionCall(nativeIterator, this); };
	    }
	  }

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
	  }

	  // define iterator
	  if (IterablePrototype[ITERATOR$4] !== defaultIterator) {
	    redefine(IterablePrototype, ITERATOR$4, defaultIterator, { name: DEFAULT });
	  }
	  iterators[NAME] = defaultIterator;

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$3 = internalState.set;
	var getInternalState$2 = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState$3(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$2(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
	iterators.Arguments = iterators.Array;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it


	var arrayBufferNonExtensible = fails(function () {
	  if (typeof ArrayBuffer == 'function') {
	    var buffer = new ArrayBuffer(8);
	    // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
	    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
	  }
	});

	// eslint-disable-next-line es/no-object-isextensible -- safe
	var $isExtensible = Object.isExtensible;
	var FAILS_ON_PRIMITIVES = fails(function () { $isExtensible(1); });

	// `Object.isExtensible` method
	// https://tc39.es/ecma262/#sec-object.isextensible
	var objectIsExtensible = (FAILS_ON_PRIMITIVES || arrayBufferNonExtensible) ? function isExtensible(it) {
	  if (!isObject(it)) return false;
	  if (arrayBufferNonExtensible && classofRaw(it) == 'ArrayBuffer') return false;
	  return $isExtensible ? $isExtensible(it) : true;
	} : $isExtensible;

	var freezing = !fails(function () {
	  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	var defineProperty = objectDefineProperty.f;






	var REQUIRED = false;
	var METADATA = uid('meta');
	var id = 0;

	var setMetadata = function (it) {
	  defineProperty(it, METADATA, { value: {
	    objectID: 'O' + id++, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!hasOwnProperty_1(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!objectIsExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData = function (it, create) {
	  if (!hasOwnProperty_1(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!objectIsExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (freezing && REQUIRED && objectIsExtensible(it) && !hasOwnProperty_1(it, METADATA)) setMetadata(it);
	  return it;
	};

	var enable = function () {
	  meta.enable = function () { /* empty */ };
	  REQUIRED = true;
	  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	  var splice = functionUncurryThis([].splice);
	  var test = {};
	  test[METADATA] = 1;

	  // prevent exposing of metadata key
	  if (getOwnPropertyNames(test).length) {
	    objectGetOwnPropertyNames.f = function (it) {
	      var result = getOwnPropertyNames(it);
	      for (var i = 0, length = result.length; i < length; i++) {
	        if (result[i] === METADATA) {
	          splice(result, i, 1);
	          break;
	        }
	      } return result;
	    };

	    _export({ target: 'Object', stat: true, forced: true }, {
	      getOwnPropertyNames: objectGetOwnPropertyNamesExternal.f
	    });
	  }
	};

	var meta = module.exports = {
	  enable: enable,
	  fastKey: fastKey,
	  getWeakData: getWeakData,
	  onFreeze: onFreeze
	};

	hiddenKeys$1[METADATA] = true;
	});

	var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = global$1[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var uncurriedNativeMethod = functionUncurryThis(NativePrototype[KEY]);
	    redefine(NativePrototype, KEY,
	      KEY == 'add' ? function add(value) {
	        uncurriedNativeMethod(this, value === 0 ? 0 : value);
	        return this;
	      } : KEY == 'delete' ? function (key) {
	        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	      } : KEY == 'get' ? function get(key) {
	        return IS_WEAK && !isObject(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	      } : KEY == 'has' ? function has(key) {
	        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	      } : function set(key, value) {
	        uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
	        return this;
	      }
	    );
	  };

	  var REPLACE = isForced_1(
	    CONSTRUCTOR_NAME,
	    !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
	      new NativeConstructor().entries().next();
	    }))
	  );

	  if (REPLACE) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    internalMetadata.enable();
	  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new -- required for testing
	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (dummy, iterable) {
	        anInstance(dummy, NativePrototype);
	        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
	        if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

	    // weak collections should not contains .clear method
	    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  _export({ global: true, forced: Constructor != NativeConstructor }, exported);

	  setToStringTag(Constructor, CONSTRUCTOR_NAME);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};

	var defineProperty$4 = objectDefineProperty.f;








	var fastKey = internalMetadata.fastKey;


	var setInternalState$2 = internalState.set;
	var internalStateGetterFor = internalState.getterFor;

	var collectionStrong = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var Constructor = wrapper(function (that, iterable) {
	      anInstance(that, Prototype);
	      setInternalState$2(that, {
	        type: CONSTRUCTOR_NAME,
	        index: objectCreate(null),
	        first: undefined,
	        last: undefined,
	        size: 0
	      });
	      if (!descriptors) that.size = 0;
	      if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	    });

	    var Prototype = Constructor.prototype;

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var entry = getEntry(that, key);
	      var previous, index;
	      // change existing entry
	      if (entry) {
	        entry.value = value;
	      // create new entry
	      } else {
	        state.last = entry = {
	          index: index = fastKey(key, true),
	          key: key,
	          value: value,
	          previous: previous = state.last,
	          next: undefined,
	          removed: false
	        };
	        if (!state.first) state.first = entry;
	        if (previous) previous.next = entry;
	        if (descriptors) state.size++;
	        else that.size++;
	        // add to index
	        if (index !== 'F') state.index[index] = entry;
	      } return that;
	    };

	    var getEntry = function (that, key) {
	      var state = getInternalState(that);
	      // fast case
	      var index = fastKey(key);
	      var entry;
	      if (index !== 'F') return state.index[index];
	      // frozen object case
	      for (entry = state.first; entry; entry = entry.next) {
	        if (entry.key == key) return entry;
	      }
	    };

	    redefineAll(Prototype, {
	      // `{ Map, Set }.prototype.clear()` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.clear
	      // https://tc39.es/ecma262/#sec-set.prototype.clear
	      clear: function clear() {
	        var that = this;
	        var state = getInternalState(that);
	        var data = state.index;
	        var entry = state.first;
	        while (entry) {
	          entry.removed = true;
	          if (entry.previous) entry.previous = entry.previous.next = undefined;
	          delete data[entry.index];
	          entry = entry.next;
	        }
	        state.first = state.last = undefined;
	        if (descriptors) state.size = 0;
	        else that.size = 0;
	      },
	      // `{ Map, Set }.prototype.delete(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.delete
	      // https://tc39.es/ecma262/#sec-set.prototype.delete
	      'delete': function (key) {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.next;
	          var prev = entry.previous;
	          delete state.index[entry.index];
	          entry.removed = true;
	          if (prev) prev.next = next;
	          if (next) next.previous = prev;
	          if (state.first == entry) state.first = next;
	          if (state.last == entry) state.last = prev;
	          if (descriptors) state.size--;
	          else that.size--;
	        } return !!entry;
	      },
	      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.foreach
	      // https://tc39.es/ecma262/#sec-set.prototype.foreach
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        var state = getInternalState(this);
	        var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	        var entry;
	        while (entry = entry ? entry.next : state.first) {
	          boundFunction(entry.value, entry.key, this);
	          // revert to the last existing entry
	          while (entry && entry.removed) entry = entry.previous;
	        }
	      },
	      // `{ Map, Set}.prototype.has(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.has
	      // https://tc39.es/ecma262/#sec-set.prototype.has
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });

	    redefineAll(Prototype, IS_MAP ? {
	      // `Map.prototype.get(key)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.get
	      get: function get(key) {
	        var entry = getEntry(this, key);
	        return entry && entry.value;
	      },
	      // `Map.prototype.set(key, value)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.set
	      set: function set(key, value) {
	        return define(this, key === 0 ? 0 : key, value);
	      }
	    } : {
	      // `Set.prototype.add(value)` method
	      // https://tc39.es/ecma262/#sec-set.prototype.add
	      add: function add(value) {
	        return define(this, value = value === 0 ? 0 : value, value);
	      }
	    });
	    if (descriptors) defineProperty$4(Prototype, 'size', {
	      get: function () {
	        return getInternalState(this).size;
	      }
	    });
	    return Constructor;
	  },
	  setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
	    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
	    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
	    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
	    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
	    // https://tc39.es/ecma262/#sec-map.prototype.entries
	    // https://tc39.es/ecma262/#sec-map.prototype.keys
	    // https://tc39.es/ecma262/#sec-map.prototype.values
	    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
	    // https://tc39.es/ecma262/#sec-set.prototype.entries
	    // https://tc39.es/ecma262/#sec-set.prototype.keys
	    // https://tc39.es/ecma262/#sec-set.prototype.values
	    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
	    defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
	      setInternalState$2(this, {
	        type: ITERATOR_NAME,
	        target: iterated,
	        state: getInternalCollectionState(iterated),
	        kind: kind,
	        last: undefined
	      });
	    }, function () {
	      var state = getInternalIteratorState(this);
	      var kind = state.kind;
	      var entry = state.last;
	      // revert to the last existing entry
	      while (entry && entry.removed) entry = entry.previous;
	      // get next entry
	      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
	        // or finish the iteration
	        state.target = undefined;
	        return { value: undefined, done: true };
	      }
	      // return step by kind
	      if (kind == 'keys') return { value: entry.key, done: false };
	      if (kind == 'values') return { value: entry.value, done: false };
	      return { value: [entry.key, entry.value], done: false };
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // `{ Map, Set }.prototype[@@species]` accessors
	    // https://tc39.es/ecma262/#sec-get-map-@@species
	    // https://tc39.es/ecma262/#sec-get-set-@@species
	    setSpecies(CONSTRUCTOR_NAME);
	  }
	};

	// `Map` constructor
	// https://tc39.es/ecma262/#sec-map-objects
	collection('Map', function (init) {
	  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var charAt$6 = functionUncurryThis(''.charAt);
	var charCodeAt = functionUncurryThis(''.charCodeAt);
	var stringSlice$5 = functionUncurryThis(''.slice);

	var createMethod$1 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString$1(requireObjectCoercible($this));
	    var position = toIntegerOrInfinity(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING
	          ? charAt$6(S, position)
	          : first
	        : CONVERT_TO_STRING
	          ? stringSlice$5(S, position, position + 2)
	          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$1(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$1(true)
	};

	var charAt$5 = stringMultibyte.charAt;




	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$1 = internalState.set;
	var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$1(this, {
	    type: STRING_ITERATOR,
	    string: toString$1(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$1(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt$5(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR$3] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype, ITERATOR$3, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR$3] = ArrayValues;
	    }
	    if (!CollectionPrototype[TO_STRING_TAG]) {
	      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
	    }
	    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      }
	    }
	  }
	};

	for (var COLLECTION_NAME in domIterables) {
	  handlePrototype(global$1[COLLECTION_NAME] && global$1[COLLECTION_NAME].prototype, COLLECTION_NAME);
	}

	handlePrototype(domTokenListPrototype, 'DOMTokenList');

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};

	var Array$2 = global$1.Array;

	// `Array.from` method implementation
	// https://tc39.es/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var IS_CONSTRUCTOR = isConstructor(this);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod && !(this == Array$2 && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = getIterator(O, iteratorMethod);
	    next = iterator.next;
	    result = IS_CONSTRUCTOR ? new this() : [];
	    for (;!(step = functionCall(next, iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = lengthOfArrayLike(O);
	    result = IS_CONSTRUCTOR ? new this(length) : Array$2(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  // eslint-disable-next-line es/no-array-from -- required for testing
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.es/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var $includes = arrayIncludes.includes;


	// `Array.prototype.includes` method
	// https://tc39.es/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');

	var MATCH$2 = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH$2]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var TypeError$6 = global$1.TypeError;

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError$6("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (error1) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (error2) { /* empty */ }
	  } return false;
	};

	var stringIndexOf$1 = functionUncurryThis(''.indexOf);

	// `String.prototype.includes` method
	// https://tc39.es/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~stringIndexOf$1(
	      toString$1(requireObjectCoercible(this)),
	      toString$1(notARegexp(searchString)),
	      arguments.length > 1 ? arguments[1] : undefined
	    );
	  }
	});

	var $values = objectToArray.values;

	// `Object.values` method
	// https://tc39.es/ecma262/#sec-object.values
	_export({ target: 'Object', stat: true }, {
	  values: function values(O) {
	    return $values(O);
	  }
	});

	var $find = arrayIteration.find;


	var FIND = 'find';
	var SKIPS_HOLES = true;

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

	// `Array.prototype.find` method
	// https://tc39.es/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';
	var TypeError$5 = global$1.TypeError;

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED$3 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED$3 }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike(E);
	        if (n + len > MAX_SAFE_INTEGER$1) throw TypeError$5(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER$1) throw TypeError$5(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	var $RegExp$2 = global$1.RegExp;

	var UNSUPPORTED_Y$3 = fails(function () {
	  var re = $RegExp$2('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	// UC Browser bug
	// https://github.com/zloirock/core-js/issues/1008
	var MISSED_STICKY$1 = UNSUPPORTED_Y$3 || fails(function () {
	  return !$RegExp$2('a', 'y').sticky;
	});

	var BROKEN_CARET = UNSUPPORTED_Y$3 || fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp$2('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
	  BROKEN_CARET: BROKEN_CARET,
	  MISSED_STICKY: MISSED_STICKY$1,
	  UNSUPPORTED_Y: UNSUPPORTED_Y$3
	};

	// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
	var $RegExp$1 = global$1.RegExp;

	var regexpUnsupportedDotAll = fails(function () {
	  var re = $RegExp$1('.', 's');
	  return !(re.dotAll && re.exec('\n') && re.flags === 's');
	});

	// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
	var $RegExp = global$1.RegExp;

	var regexpUnsupportedNcg = fails(function () {
	  var re = $RegExp('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' ||
	    'b'.replace(re, '$<a>c') !== 'bc';
	});

	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
	/* eslint-disable regexp/no-useless-quantifier -- testing */







	var getInternalState = internalState.get;



	var nativeReplace = shared('native-string-replace', String.prototype.replace);
	var nativeExec = RegExp.prototype.exec;
	var patchedExec = nativeExec;
	var charAt$4 = functionUncurryThis(''.charAt);
	var indexOf = functionUncurryThis(''.indexOf);
	var replace$3 = functionUncurryThis(''.replace);
	var stringSlice$4 = functionUncurryThis(''.slice);

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  functionCall(nativeExec, re1, 'a');
	  functionCall(nativeExec, re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$2 = regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$2 || regexpUnsupportedDotAll || regexpUnsupportedNcg;

	if (PATCH) {
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState(re);
	    var str = toString$1(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex, match, i, object, group;

	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = functionCall(patchedExec, raw, str);
	      re.lastIndex = raw.lastIndex;
	      return result;
	    }

	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y$2 && re.sticky;
	    var flags = functionCall(regexpFlags, re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = replace$3(flags, 'y', '');
	      if (indexOf(flags, 'g') === -1) {
	        flags += 'g';
	      }

	      strCopy = stringSlice$4(str, re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$4(str, re.lastIndex - 1) !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = functionCall(nativeExec, sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = stringSlice$4(match.input, charsAdded);
	        match[0] = stringSlice$4(match[0], charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      functionCall(nativeReplace, match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    if (match && groups) {
	      match.groups = object = objectCreate(null);
	      for (i = 0; i < groups.length; i++) {
	        group = groups[i];
	        object[group[0]] = match[group[1]];
	      }
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	// `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec
	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points








	var SPECIES$1 = wellKnownSymbol('species');
	var RegExpPrototype$2 = RegExp.prototype;

	var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$1] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    FORCED
	  ) {
	    var uncurriedNativeRegExpMethod = functionUncurryThis(/./[SYMBOL]);
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var uncurriedNativeMethod = functionUncurryThis(nativeMethod);
	      var $exec = regexp.exec;
	      if ($exec === regexpExec || $exec === RegExpPrototype$2.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
	        }
	        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
	      }
	      return { done: false };
	    });

	    redefine(String.prototype, KEY, methods[0]);
	    redefine(RegExpPrototype$2, SYMBOL, methods[1]);
	  }

	  if (SHAM) createNonEnumerableProperty(RegExpPrototype$2[SYMBOL], 'sham', true);
	};

	var charAt$3 = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt$3(S, index).length : 1);
	};

	var TypeError$4 = global$1.TypeError;

	// `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (isCallable(exec)) {
	    var result = functionCall(exec, R, S);
	    if (result !== null) anObject(result);
	    return result;
	  }
	  if (classofRaw(R) === 'RegExp') return functionCall(regexpExec, R, S);
	  throw TypeError$4('RegExp#exec called on incompatible receiver');
	};

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y;
	var MAX_UINT32 = 0xFFFFFFFF;
	var min$1 = Math.min;
	var $push = [].push;
	var exec$1 = functionUncurryThis(/./.exec);
	var push$3 = functionUncurryThis($push);
	var stringSlice$3 = functionUncurryThis(''.slice);

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	// @@split logic
	fixRegexpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    // eslint-disable-next-line regexp/no-empty-group -- required for testing
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
	    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
	    '.'.split(/()()/).length > 1 ||
	    ''.split(/.?/).length
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = toString$1(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string];
	      // If `separator` is not a regex, use native split
	      if (!isRegexp(separator)) {
	        return functionCall(nativeSplit, string, separator, lim);
	      }
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = functionCall(regexpExec, separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;
	        if (lastIndex > lastLastIndex) {
	          push$3(output, stringSlice$3(string, lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) functionApply($push, output, arraySliceSimple(match, 1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }
	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string.length) {
	        if (lastLength || !exec$1(separatorCopy, '')) push$3(output, '');
	      } else push$3(output, stringSlice$3(string, lastLastIndex));
	      return output.length > lim ? arraySliceSimple(output, 0, lim) : output;
	    };
	  // Chakra, V8
	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : functionCall(nativeSplit, this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [
	    // `String.prototype.split` method
	    // https://tc39.es/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = requireObjectCoercible(this);
	      var splitter = separator == undefined ? undefined : getMethod(separator, SPLIT);
	      return splitter
	        ? functionCall(splitter, separator, O, limit)
	        : functionCall(internalSplit, toString$1(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (string, limit) {
	      var rx = anObject(this);
	      var S = toString$1(string);
	      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

	      if (res.done) return res.value;

	      var C = speciesConstructor(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (UNSUPPORTED_Y$1 ? 'g' : 'y');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(UNSUPPORTED_Y$1 ? '^(?:' + rx.source + ')' : rx, flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = UNSUPPORTED_Y$1 ? 0 : q;
	        var z = regexpExecAbstract(splitter, UNSUPPORTED_Y$1 ? stringSlice$3(S, q) : S);
	        var e;
	        if (
	          z === null ||
	          (e = min$1(toLength(splitter.lastIndex + (UNSUPPORTED_Y$1 ? q : 0)), S.length)) === p
	        ) {
	          q = advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          push$3(A, stringSlice$3(S, p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            push$3(A, z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      push$3(A, stringSlice$3(S, p));
	      return A;
	    }
	  ];
	}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y$1);

	var un$Join = functionUncurryThis([].join);

	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD$4 = arrayMethodIsStrict('join', ',');

	// `Array.prototype.join` method
	// https://tc39.es/ecma262/#sec-array.prototype.join
	_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$4 }, {
	  join: function join(separator) {
	    return un$Join(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var DatePrototype = Date.prototype;
	var INVALID_DATE = 'Invalid Date';
	var TO_STRING$1 = 'toString';
	var un$DateToString = functionUncurryThis(DatePrototype[TO_STRING$1]);
	var getTime = functionUncurryThis(DatePrototype.getTime);

	// `Date.prototype.toString` method
	// https://tc39.es/ecma262/#sec-date.prototype.tostring
	if (String(new Date(NaN)) != INVALID_DATE) {
	  redefine(DatePrototype, TO_STRING$1, function toString() {
	    var value = getTime(this);
	    // eslint-disable-next-line no-self-compare -- NaN check
	    return value === value ? un$DateToString(this) : INVALID_DATE;
	  });
	}

	var PROPER_FUNCTION_NAME$1 = functionName.PROPER;







	var TO_STRING = 'toString';
	var RegExpPrototype$1 = RegExp.prototype;
	var n$ToString = RegExpPrototype$1[TO_STRING];
	var getFlags$1 = functionUncurryThis(regexpFlags);

	var NOT_GENERIC = fails(function () { return n$ToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = PROPER_FUNCTION_NAME$1 && n$ToString.name != TO_STRING;

	// `RegExp.prototype.toString` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var p = toString$1(R.source);
	    var rf = R.flags;
	    var f = toString$1(rf === undefined && objectIsPrototypeOf(RegExpPrototype$1, R) && !('flags' in RegExpPrototype$1) ? getFlags$1(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	// @@match logic
	fixRegexpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.es/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible(this);
	      var matcher = regexp == undefined ? undefined : getMethod(regexp, MATCH);
	      return matcher ? functionCall(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString$1(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
	    function (string) {
	      var rx = anObject(this);
	      var S = toString$1(string);
	      var res = maybeCallNative(nativeMatch, rx, S);

	      if (res.done) return res.value;

	      if (!rx.global) return regexpExecAbstract(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regexpExecAbstract(rx, S)) !== null) {
	        var matchStr = toString$1(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	var TypeError$3 = global$1.TypeError;

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aCallable(callbackfn);
	    var O = toObject(that);
	    var self = indexedObject(O);
	    var length = lengthOfArrayLike(O);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError$3('Reduce of empty array with no initial value');
	      }
	    }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduce
	  left: createMethod(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
	  right: createMethod(true)
	};

	var $reduce = arrayReduce.left;




	var STRICT_METHOD$3 = arrayMethodIsStrict('reduce');
	// Chrome 80-82 has a critical bug
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
	var CHROME_BUG = !engineIsNode && engineV8Version > 79 && engineV8Version < 83;

	// `Array.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-array.prototype.reduce
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$3 || CHROME_BUG }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    var length = arguments.length;
	    return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
	  }
	});

	// `Number.isNaN` method
	// https://tc39.es/ecma262/#sec-number.isnan
	_export({ target: 'Number', stat: true }, {
	  isNaN: function isNaN(number) {
	    // eslint-disable-next-line no-self-compare -- NaN check
	    return number != number;
	  }
	});

	var trim = stringTrim.trim;


	var charAt$2 = functionUncurryThis(''.charAt);
	var n$ParseFloat = global$1.parseFloat;
	var Symbol$1 = global$1.Symbol;
	var ITERATOR$2 = Symbol$1 && Symbol$1.iterator;
	var FORCED$2 = 1 / n$ParseFloat(whitespaces + '-0') !== -Infinity
	  // MS Edge 18- broken with boxed symbols
	  || (ITERATOR$2 && !fails(function () { n$ParseFloat(Object(ITERATOR$2)); }));

	// `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string
	var numberParseFloat = FORCED$2 ? function parseFloat(string) {
	  var trimmedString = trim(toString$1(string));
	  var result = n$ParseFloat(trimmedString);
	  return result === 0 && charAt$2(trimmedString, 0) == '-' ? -0 : result;
	} : n$ParseFloat;

	// `Number.parseFloat` method
	// https://tc39.es/ecma262/#sec-number.parseFloat
	// eslint-disable-next-line es/no-number-parsefloat -- required for testing
	_export({ target: 'Number', stat: true, forced: Number.parseFloat != numberParseFloat }, {
	  parseFloat: numberParseFloat
	});

	// `Set` constructor
	// https://tc39.es/ecma262/#sec-set-objects
	collection('Set', function (init) {
	  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	/* eslint-disable es/no-array-prototype-indexof -- required for testing */


	var $IndexOf = arrayIncludes.indexOf;


	var un$IndexOf = functionUncurryThis([].indexOf);

	var NEGATIVE_ZERO = !!un$IndexOf && 1 / un$IndexOf([1], 1, -0) < 0;
	var STRICT_METHOD$2 = arrayMethodIsStrict('indexOf');

	// `Array.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$2 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? un$IndexOf(this, searchElement, fromIndex) || 0
	      : $IndexOf(this, searchElement, fromIndex);
	  }
	});

	var PROPER_FUNCTION_NAME = functionName.PROPER;



	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails(function () {
	    return !!whitespaces[METHOD_NAME]()
	      || non[METHOD_NAME]() !== non
	      || (PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME);
	  });
	};

	var $trim = stringTrim.trim;


	// `String.prototype.trim` method
	// https://tc39.es/ecma262/#sec-string.prototype.trim
	_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var dayjs_min = createCommonjsModule(function (module, exports) {
	!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},D="en",v={};v[D]=M;var p=function(t){return t instanceof _},S=function(t,e,n){var r;if(!t)return D;if("string"==typeof t)v[t]&&(r=t),e&&(v[t]=e,r=t);else {var i=t.name;v[i]=t,r=i;}return !n&&r&&(D=r),r||!n&&D},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=g;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===$)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),$=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},l=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case c:return r?$(1,0):$(31,11);case f:return r?$(1,M):$(0,M+1);case o:var D=this.$locale().weekStart||0,v=(y<D?y+7:y)-D;return $(r?m-v:m+(6-v),M);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),$=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],l=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[$](l),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,$=this;r=Number(r);var l=O.p(h),y=function(t){var e=w($);return O.w(e.date(e.date()+Math.round(t*r)),$)};if(l===f)return this.set(f,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return y(1);if(l===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||$;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].substr(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||l[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,g=this-M,D=O.m(this,M);return D=(l={},l[c]=D/12,l[f]=D,l[h]=D/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/n,l[s]=g/e,l[i]=g/t,l)[y]||g,$?D:O.a(D)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return v[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),b=_.prototype;return w.prototype=b,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){b[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=v[D],w.Ls=v,w.p={},w}));
	});

	var quarterOfYear = createCommonjsModule(function (module, exports) {
	!function(t,n){module.exports=n();}(commonjsGlobal,(function(){var t="month",n="quarter";return function(e,i){var r=i.prototype;r.quarter=function(t){return this.$utils().u(t)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(t-1))};var s=r.add;r.add=function(e,i){return e=Number(e),this.$utils().p(i)===n?this.add(3*e,t):s.bind(this)(e,i)};var u=r.startOf;r.startOf=function(e,i){var r=this.$utils(),s=!!r.u(i)||i;if(r.p(e)===n){var o=this.quarter()-1;return s?this.month(3*o).startOf(t).startOf("day"):this.month(3*o+2).endOf(t).endOf("day")}return u.bind(this)(e,i)};}}));
	});

	var en = createCommonjsModule(function (module, exports) {
	!function(e,n){module.exports=n();}(commonjsGlobal,(function(){return {name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")}}));
	});

	function _isPlaceholder(a) {
	  return a != null && _typeof(a) === 'object' && a['@@functional/placeholder'] === true;
	}

	/**
	 * Optimized internal one-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */

	function _curry1(fn) {
	  return function f1(a) {
	    if (arguments.length === 0 || _isPlaceholder(a)) {
	      return f1;
	    } else {
	      return fn.apply(this, arguments);
	    }
	  };
	}

	/**
	 * Optimized internal two-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */

	function _curry2(fn) {
	  return function f2(a, b) {
	    switch (arguments.length) {
	      case 0:
	        return f2;

	      case 1:
	        return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
	          return fn(a, _b);
	        });

	      default:
	        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
	          return fn(_a, b);
	        }) : _isPlaceholder(b) ? _curry1(function (_b) {
	          return fn(a, _b);
	        }) : fn(a, b);
	    }
	  };
	}

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');

	var SPECIES = wellKnownSymbol('species');
	var Array$1 = global$1.Array;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = lengthOfArrayLike(O);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (isConstructor(Constructor) && (Constructor === Array$1 || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array$1 || Constructor === undefined) {
	        return arraySlice$1(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array$1 : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	function _arity(n, fn) {
	  /* eslint-disable no-unused-vars */
	  switch (n) {
	    case 0:
	      return function () {
	        return fn.apply(this, arguments);
	      };

	    case 1:
	      return function (a0) {
	        return fn.apply(this, arguments);
	      };

	    case 2:
	      return function (a0, a1) {
	        return fn.apply(this, arguments);
	      };

	    case 3:
	      return function (a0, a1, a2) {
	        return fn.apply(this, arguments);
	      };

	    case 4:
	      return function (a0, a1, a2, a3) {
	        return fn.apply(this, arguments);
	      };

	    case 5:
	      return function (a0, a1, a2, a3, a4) {
	        return fn.apply(this, arguments);
	      };

	    case 6:
	      return function (a0, a1, a2, a3, a4, a5) {
	        return fn.apply(this, arguments);
	      };

	    case 7:
	      return function (a0, a1, a2, a3, a4, a5, a6) {
	        return fn.apply(this, arguments);
	      };

	    case 8:
	      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
	        return fn.apply(this, arguments);
	      };

	    case 9:
	      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
	        return fn.apply(this, arguments);
	      };

	    case 10:
	      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
	        return fn.apply(this, arguments);
	      };

	    default:
	      throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
	  }
	}

	/**
	 * Internal curryN function.
	 *
	 * @private
	 * @category Function
	 * @param {Number} length The arity of the curried function.
	 * @param {Array} received An array of arguments received thus far.
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */

	function _curryN(length, received, fn) {
	  return function () {
	    var combined = [];
	    var argsIdx = 0;
	    var left = length;
	    var combinedIdx = 0;

	    while (combinedIdx < received.length || argsIdx < arguments.length) {
	      var result;

	      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
	        result = received[combinedIdx];
	      } else {
	        result = arguments[argsIdx];
	        argsIdx += 1;
	      }

	      combined[combinedIdx] = result;

	      if (!_isPlaceholder(result)) {
	        left -= 1;
	      }

	      combinedIdx += 1;
	    }

	    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
	  };
	}

	/**
	 * Returns a curried equivalent of the provided function, with the specified
	 * arity. The curried function has two unusual capabilities. First, its
	 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
	 * following are equivalent:
	 *
	 *   - `g(1)(2)(3)`
	 *   - `g(1)(2, 3)`
	 *   - `g(1, 2)(3)`
	 *   - `g(1, 2, 3)`
	 *
	 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
	 * "gaps", allowing partial application of any combination of arguments,
	 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
	 * the following are equivalent:
	 *
	 *   - `g(1, 2, 3)`
	 *   - `g(_, 2, 3)(1)`
	 *   - `g(_, _, 3)(1)(2)`
	 *   - `g(_, _, 3)(1, 2)`
	 *   - `g(_, 2)(1)(3)`
	 *   - `g(_, 2)(1, 3)`
	 *   - `g(_, 2)(_, 3)(1)`
	 *
	 * @func
	 * @memberOf R
	 * @since v0.5.0
	 * @category Function
	 * @sig Number -> (* -> a) -> (* -> a)
	 * @param {Number} length The arity for the returned function.
	 * @param {Function} fn The function to curry.
	 * @return {Function} A new, curried function.
	 * @see R.curry
	 * @example
	 *
	 *      const sumArgs = (...args) => R.sum(args);
	 *
	 *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
	 *      const f = curriedAddFourNumbers(1, 2);
	 *      const g = f(3);
	 *      g(4); //=> 10
	 */

	var curryN = /*#__PURE__*/_curry2(function curryN(length, fn) {
	  if (length === 1) {
	    return _curry1(fn);
	  }

	  return _arity(length, _curryN(length, [], fn));
	});

	/**
	 * Optimized internal three-arity curry function.
	 *
	 * @private
	 * @category Function
	 * @param {Function} fn The function to curry.
	 * @return {Function} The curried function.
	 */

	function _curry3(fn) {
	  return function f3(a, b, c) {
	    switch (arguments.length) {
	      case 0:
	        return f3;

	      case 1:
	        return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
	          return fn(a, _b, _c);
	        });

	      case 2:
	        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
	          return fn(_a, b, _c);
	        }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
	          return fn(a, _b, _c);
	        }) : _curry1(function (_c) {
	          return fn(a, b, _c);
	        });

	      default:
	        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
	          return fn(_a, _b, c);
	        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
	          return fn(_a, b, _c);
	        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
	          return fn(a, _b, _c);
	        }) : _isPlaceholder(a) ? _curry1(function (_a) {
	          return fn(_a, b, c);
	        }) : _isPlaceholder(b) ? _curry1(function (_b) {
	          return fn(a, _b, c);
	        }) : _isPlaceholder(c) ? _curry1(function (_c) {
	          return fn(a, b, _c);
	        }) : fn(a, b, c);
	    }
	  };
	}

	/**
	 * Tests whether or not an object is an array.
	 *
	 * @private
	 * @param {*} val The object to test.
	 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
	 * @example
	 *
	 *      _isArray([]); //=> true
	 *      _isArray(null); //=> false
	 *      _isArray({}); //=> false
	 */
	var _isArray = Array.isArray || function _isArray(val) {
	  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
	};

	function _isTransformer(obj) {
	  return obj != null && typeof obj['@@transducer/step'] === 'function';
	}

	/**
	 * Returns a function that dispatches with different strategies based on the
	 * object in list position (last argument). If it is an array, executes [fn].
	 * Otherwise, if it has a function with one of the given method names, it will
	 * execute that function (functor case). Otherwise, if it is a transformer,
	 * uses transducer [xf] to return a new transformer (transducer case).
	 * Otherwise, it will default to executing [fn].
	 *
	 * @private
	 * @param {Array} methodNames properties to check for a custom implementation
	 * @param {Function} xf transducer to initialize if object is transformer
	 * @param {Function} fn default ramda implementation
	 * @return {Function} A function that dispatches on object in list position
	 */

	function _dispatchable(methodNames, xf, fn) {
	  return function () {
	    if (arguments.length === 0) {
	      return fn();
	    }

	    var args = Array.prototype.slice.call(arguments, 0);
	    var obj = args.pop();

	    if (!_isArray(obj)) {
	      var idx = 0;

	      while (idx < methodNames.length) {
	        if (typeof obj[methodNames[idx]] === 'function') {
	          return obj[methodNames[idx]].apply(obj, args);
	        }

	        idx += 1;
	      }

	      if (_isTransformer(obj)) {
	        var transducer = xf.apply(null, args);
	        return transducer(obj);
	      }
	    }

	    return fn.apply(this, arguments);
	  };
	}

	function _reduced(x) {
	  return x && x['@@transducer/reduced'] ? x : {
	    '@@transducer/value': x,
	    '@@transducer/reduced': true
	  };
	}

	var _xfBase = {
	  init: function init() {
	    return this.xf['@@transducer/init']();
	  },
	  result: function result(_result) {
	    return this.xf['@@transducer/result'](_result);
	  }
	};

	function _map(fn, functor) {
	  var idx = 0;
	  var len = functor.length;
	  var result = Array(len);

	  while (idx < len) {
	    result[idx] = fn(functor[idx]);
	    idx += 1;
	  }

	  return result;
	}

	var defineProperty$3 = objectDefineProperty.f;


	var NativeSymbol = global$1.Symbol;
	var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

	if (descriptors && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString$1(arguments[0]);
	    var result = objectIsPrototypeOf(SymbolPrototype, this)
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };

	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  SymbolWrapper.prototype = SymbolPrototype;
	  SymbolPrototype.constructor = SymbolWrapper;

	  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
	  var symbolToString = functionUncurryThis(SymbolPrototype.toString);
	  var symbolValueOf = functionUncurryThis(SymbolPrototype.valueOf);
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  var replace$2 = functionUncurryThis(''.replace);
	  var stringSlice$2 = functionUncurryThis(''.slice);

	  defineProperty$3(SymbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = symbolValueOf(this);
	      var string = symbolToString(symbol);
	      if (hasOwnProperty_1(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = NATIVE_SYMBOL ? stringSlice$2(string, 7, -1) : replace$2(string, regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	// `Symbol.iterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol('iterator');

	function _isString(x) {
	  return Object.prototype.toString.call(x) === '[object String]';
	}

	/**
	 * Tests whether or not an object is similar to an array.
	 *
	 * @private
	 * @category Type
	 * @category List
	 * @sig * -> Boolean
	 * @param {*} x The object to test.
	 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
	 * @example
	 *
	 *      _isArrayLike([]); //=> true
	 *      _isArrayLike(true); //=> false
	 *      _isArrayLike({}); //=> false
	 *      _isArrayLike({length: 10}); //=> false
	 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
	 */

	var _isArrayLike = /*#__PURE__*/_curry1(function isArrayLike(x) {
	  if (_isArray(x)) {
	    return true;
	  }

	  if (!x) {
	    return false;
	  }

	  if (_typeof(x) !== 'object') {
	    return false;
	  }

	  if (_isString(x)) {
	    return false;
	  }

	  if (x.nodeType === 1) {
	    return !!x.length;
	  }

	  if (x.length === 0) {
	    return true;
	  }

	  if (x.length > 0) {
	    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
	  }

	  return false;
	});

	var XWrap = /*#__PURE__*/function () {
	  function XWrap(fn) {
	    this.f = fn;
	  }

	  XWrap.prototype['@@transducer/init'] = function () {
	    throw new Error('init not implemented on XWrap');
	  };

	  XWrap.prototype['@@transducer/result'] = function (acc) {
	    return acc;
	  };

	  XWrap.prototype['@@transducer/step'] = function (acc, x) {
	    return this.f(acc, x);
	  };

	  return XWrap;
	}();

	function _xwrap(fn) {
	  return new XWrap(fn);
	}

	/**
	 * Creates a function that is bound to a context.
	 * Note: `R.bind` does not provide the additional argument-binding capabilities of
	 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.6.0
	 * @category Function
	 * @category Object
	 * @sig (* -> *) -> {*} -> (* -> *)
	 * @param {Function} fn The function to bind to context
	 * @param {Object} thisObj The context to bind `fn` to
	 * @return {Function} A function that will execute in the context of `thisObj`.
	 * @see R.partial
	 * @example
	 *
	 *      const log = R.bind(console.log, console);
	 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
	 *      // logs {a: 2}
	 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
	 */

	var bind = /*#__PURE__*/_curry2(function bind(fn, thisObj) {
	  return _arity(fn.length, function () {
	    return fn.apply(thisObj, arguments);
	  });
	});

	function _arrayReduce(xf, acc, list) {
	  var idx = 0;
	  var len = list.length;

	  while (idx < len) {
	    acc = xf['@@transducer/step'](acc, list[idx]);

	    if (acc && acc['@@transducer/reduced']) {
	      acc = acc['@@transducer/value'];
	      break;
	    }

	    idx += 1;
	  }

	  return xf['@@transducer/result'](acc);
	}

	function _iterableReduce(xf, acc, iter) {
	  var step = iter.next();

	  while (!step.done) {
	    acc = xf['@@transducer/step'](acc, step.value);

	    if (acc && acc['@@transducer/reduced']) {
	      acc = acc['@@transducer/value'];
	      break;
	    }

	    step = iter.next();
	  }

	  return xf['@@transducer/result'](acc);
	}

	function _methodReduce(xf, acc, obj, methodName) {
	  return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
	}

	var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
	function _reduce(fn, acc, list) {
	  if (typeof fn === 'function') {
	    fn = _xwrap(fn);
	  }

	  if (_isArrayLike(list)) {
	    return _arrayReduce(fn, acc, list);
	  }

	  if (typeof list['fantasy-land/reduce'] === 'function') {
	    return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
	  }

	  if (list[symIterator] != null) {
	    return _iterableReduce(fn, acc, list[symIterator]());
	  }

	  if (typeof list.next === 'function') {
	    return _iterableReduce(fn, acc, list);
	  }

	  if (typeof list.reduce === 'function') {
	    return _methodReduce(fn, acc, list, 'reduce');
	  }

	  throw new TypeError('reduce: list must be array or iterable');
	}

	var XMap = /*#__PURE__*/function () {
	  function XMap(f, xf) {
	    this.xf = xf;
	    this.f = f;
	  }

	  XMap.prototype['@@transducer/init'] = _xfBase.init;
	  XMap.prototype['@@transducer/result'] = _xfBase.result;

	  XMap.prototype['@@transducer/step'] = function (result, input) {
	    return this.xf['@@transducer/step'](result, this.f(input));
	  };

	  return XMap;
	}();

	var _xmap = /*#__PURE__*/_curry2(function _xmap(f, xf) {
	  return new XMap(f, xf);
	});

	function _has(prop, obj) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	var toString = Object.prototype.toString;

	var _isArguments = /*#__PURE__*/function () {
	  return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
	    return toString.call(x) === '[object Arguments]';
	  } : function _isArguments(x) {
	    return _has('callee', x);
	  };
	}();

	var hasEnumBug = ! /*#__PURE__*/{
	  toString: null
	}.propertyIsEnumerable('toString');
	var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; // Safari bug

	var hasArgsEnumBug = /*#__PURE__*/function () {

	  return arguments.propertyIsEnumerable('length');
	}();

	var contains = function contains(list, item) {
	  var idx = 0;

	  while (idx < list.length) {
	    if (list[idx] === item) {
	      return true;
	    }

	    idx += 1;
	  }

	  return false;
	};
	/**
	 * Returns a list containing the names of all the enumerable own properties of
	 * the supplied object.
	 * Note that the order of the output array is not guaranteed to be consistent
	 * across different JS platforms.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig {k: v} -> [k]
	 * @param {Object} obj The object to extract properties from
	 * @return {Array} An array of the object's own properties.
	 * @see R.keysIn, R.values
	 * @example
	 *
	 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
	 */


	var keys$1 = typeof Object.keys === 'function' && !hasArgsEnumBug ? /*#__PURE__*/_curry1(function keys(obj) {
	  return Object(obj) !== obj ? [] : Object.keys(obj);
	}) : /*#__PURE__*/_curry1(function keys(obj) {
	  if (Object(obj) !== obj) {
	    return [];
	  }

	  var prop, nIdx;
	  var ks = [];

	  var checkArgsLength = hasArgsEnumBug && _isArguments(obj);

	  for (prop in obj) {
	    if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
	      ks[ks.length] = prop;
	    }
	  }

	  if (hasEnumBug) {
	    nIdx = nonEnumerableProps.length - 1;

	    while (nIdx >= 0) {
	      prop = nonEnumerableProps[nIdx];

	      if (_has(prop, obj) && !contains(ks, prop)) {
	        ks[ks.length] = prop;
	      }

	      nIdx -= 1;
	    }
	  }

	  return ks;
	});

	/**
	 * Takes a function and
	 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
	 * applies the function to each of the functor's values, and returns
	 * a functor of the same shape.
	 *
	 * Ramda provides suitable `map` implementations for `Array` and `Object`,
	 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
	 *
	 * Dispatches to the `map` method of the second argument, if present.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * Also treats functions as functors and will compose them together.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Functor f => (a -> b) -> f a -> f b
	 * @param {Function} fn The function to be called on every element of the input `list`.
	 * @param {Array} list The list to be iterated over.
	 * @return {Array} The new list.
	 * @see R.transduce, R.addIndex
	 * @example
	 *
	 *      const double = x => x * 2;
	 *
	 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
	 *
	 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
	 * @symb R.map(f, [a, b]) = [f(a), f(b)]
	 * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
	 * @symb R.map(f, functor_o) = functor_o.map(f)
	 */

	var map = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
	  switch (Object.prototype.toString.call(functor)) {
	    case '[object Function]':
	      return curryN(functor.length, function () {
	        return fn.call(this, functor.apply(this, arguments));
	      });

	    case '[object Object]':
	      return _reduce(function (acc, key) {
	        acc[key] = fn(functor[key]);
	        return acc;
	      }, {}, keys$1(functor));

	    default:
	      return _map(fn, functor);
	  }
	}));

	var floor$1 = Math.floor;

	// `IsIntegralNumber` abstract operation
	// https://tc39.es/ecma262/#sec-isintegralnumber
	// eslint-disable-next-line es/no-number-isinteger -- safe
	var isIntegralNumber = Number.isInteger || function isInteger(it) {
	  return !isObject(it) && isFinite(it) && floor$1(it) === it;
	};

	// `Number.isInteger` method
	// https://tc39.es/ecma262/#sec-number.isinteger
	_export({ target: 'Number', stat: true }, {
	  isInteger: isIntegralNumber
	});

	/**
	 * Determine if the passed argument is an integer.
	 *
	 * @private
	 * @param {*} n
	 * @category Type
	 * @return {Boolean}
	 */
	var _isInteger = Number.isInteger || function _isInteger(n) {
	  return n << 0 === n;
	};

	/**
	 * Returns the nth element of the given list or string. If n is negative the
	 * element at index length + n is returned.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Number -> [a] -> a | Undefined
	 * @sig Number -> String -> String
	 * @param {Number} offset
	 * @param {*} list
	 * @return {*}
	 * @example
	 *
	 *      const list = ['foo', 'bar', 'baz', 'quux'];
	 *      R.nth(1, list); //=> 'bar'
	 *      R.nth(-1, list); //=> 'quux'
	 *      R.nth(-99, list); //=> undefined
	 *
	 *      R.nth(2, 'abc'); //=> 'c'
	 *      R.nth(3, 'abc'); //=> ''
	 * @symb R.nth(-1, [a, b, c]) = c
	 * @symb R.nth(0, [a, b, c]) = a
	 * @symb R.nth(1, [a, b, c]) = b
	 */

	var nth = /*#__PURE__*/_curry2(function nth(offset, list) {
	  var idx = offset < 0 ? list.length + offset : offset;
	  return _isString(list) ? list.charAt(idx) : list[idx];
	});

	/**
	 * Retrieves the values at given paths of an object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.27.1
	 * @category Object
	 * @typedefn Idx = [String | Int]
	 * @sig [Idx] -> {a} -> [a | Undefined]
	 * @param {Array} pathsArray The array of paths to be fetched.
	 * @param {Object} obj The object to retrieve the nested properties from.
	 * @return {Array} A list consisting of values at paths specified by "pathsArray".
	 * @see R.path
	 * @example
	 *
	 *      R.paths([['a', 'b'], ['p', 0, 'q']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, 3]
	 *      R.paths([['a', 'b'], ['p', 'r']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, undefined]
	 */

	var paths = /*#__PURE__*/_curry2(function paths(pathsArray, obj) {
	  return pathsArray.map(function (paths) {
	    var val = obj;
	    var idx = 0;
	    var p;

	    while (idx < paths.length) {
	      if (val == null) {
	        return;
	      }

	      p = paths[idx];
	      val = _isInteger(p) ? nth(p, val) : val[p];
	      idx += 1;
	    }

	    return val;
	  });
	});

	/**
	 * Retrieve the value at a given path.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.2.0
	 * @category Object
	 * @typedefn Idx = String | Int
	 * @sig [Idx] -> {a} -> a | Undefined
	 * @param {Array} path The path to use.
	 * @param {Object} obj The object to retrieve the nested property from.
	 * @return {*} The data at `path`.
	 * @see R.prop, R.nth
	 * @example
	 *
	 *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
	 *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
	 *      R.path(['a', 'b', 0], {a: {b: [1, 2, 3]}}); //=> 1
	 *      R.path(['a', 'b', -2], {a: {b: [1, 2, 3]}}); //=> 2
	 */

	var path = /*#__PURE__*/_curry2(function path(pathAr, obj) {
	  return paths([pathAr], obj)[0];
	});

	/**
	 * Returns a function that when supplied an object returns the indicated
	 * property of that object, if it exists.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @typedefn Idx = String | Int
	 * @sig Idx -> {s: a} -> a | Undefined
	 * @param {String|Number} p The property name or array index
	 * @param {Object} obj The object to query
	 * @return {*} The value at `obj.p`.
	 * @see R.path, R.nth
	 * @example
	 *
	 *      R.prop('x', {x: 100}); //=> 100
	 *      R.prop('x', {}); //=> undefined
	 *      R.prop(0, [100]); //=> 100
	 *      R.compose(R.inc, R.prop('x'))({ x: 3 }) //=> 4
	 */

	var prop = /*#__PURE__*/_curry2(function prop(p, obj) {
	  return path([p], obj);
	});

	/**
	 * Returns a new list by plucking the same named property off all objects in
	 * the list supplied.
	 *
	 * `pluck` will work on
	 * any [functor](https://github.com/fantasyland/fantasy-land#functor) in
	 * addition to arrays, as it is equivalent to `R.map(R.prop(k), f)`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Functor f => k -> f {k: v} -> f v
	 * @param {Number|String} key The key name to pluck off of each object.
	 * @param {Array} f The array or functor to consider.
	 * @return {Array} The list of values for the given key.
	 * @see R.props
	 * @example
	 *
	 *      var getAges = R.pluck('age');
	 *      getAges([{name: 'fred', age: 29}, {name: 'wilma', age: 27}]); //=> [29, 27]
	 *
	 *      R.pluck(0, [[1, 2], [3, 4]]);               //=> [1, 3]
	 *      R.pluck('val', {a: {val: 3}, b: {val: 5}}); //=> {a: 3, b: 5}
	 * @symb R.pluck('x', [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}]) = [1, 3, 5]
	 * @symb R.pluck(0, [[1, 2], [3, 4], [5, 6]]) = [1, 3, 5]
	 */

	var pluck = /*#__PURE__*/_curry2(function pluck(p, list) {
	  return map(prop(p), list);
	});

	/**
	 * Returns a single item by iterating through the list, successively calling
	 * the iterator function and passing it an accumulator value and the current
	 * value from the array, and then passing the result to the next call.
	 *
	 * The iterator function receives two values: *(acc, value)*. It may use
	 * [`R.reduced`](#reduced) to shortcut the iteration.
	 *
	 * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
	 * is *(value, acc)*.
	 *
	 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
	 * arrays), unlike the native `Array.prototype.reduce` method. For more details
	 * on this behavior, see:
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
	 *
	 * Dispatches to the `reduce` method of the third argument, if present. When
	 * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
	 * shortcuting, as this is not implemented by `reduce`.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig ((a, b) -> a) -> a -> [b] -> a
	 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
	 *        current element from the array.
	 * @param {*} acc The accumulator value.
	 * @param {Array} list The list to iterate over.
	 * @return {*} The final, accumulated value.
	 * @see R.reduced, R.addIndex, R.reduceRight
	 * @example
	 *
	 *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
	 *      //          -               -10
	 *      //         / \              / \
	 *      //        -   4           -6   4
	 *      //       / \              / \
	 *      //      -   3   ==>     -3   3
	 *      //     / \              / \
	 *      //    -   2           -1   2
	 *      //   / \              / \
	 *      //  0   1            0   1
	 *
	 * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
	 */

	var reduce = /*#__PURE__*/_curry3(_reduce);

	/**
	 * `_makeFlat` is a helper function that returns a one-level or fully recursive
	 * function based on the flag passed in.
	 *
	 * @private
	 */

	function _makeFlat(recursive) {
	  return function flatt(list) {
	    var value, jlen, j;
	    var result = [];
	    var idx = 0;
	    var ilen = list.length;

	    while (idx < ilen) {
	      if (_isArrayLike(list[idx])) {
	        value = recursive ? flatt(list[idx]) : list[idx];
	        j = 0;
	        jlen = value.length;

	        while (j < jlen) {
	          result[result.length] = value[j];
	          j += 1;
	        }
	      } else {
	        result[result.length] = list[idx];
	      }

	      idx += 1;
	    }

	    return result;
	  };
	}

	function _forceReduced(x) {
	  return {
	    '@@transducer/value': x,
	    '@@transducer/reduced': true
	  };
	}

	var preservingReduced = function preservingReduced(xf) {
	  return {
	    '@@transducer/init': _xfBase.init,
	    '@@transducer/result': function transducerResult(result) {
	      return xf['@@transducer/result'](result);
	    },
	    '@@transducer/step': function transducerStep(result, input) {
	      var ret = xf['@@transducer/step'](result, input);
	      return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
	    }
	  };
	};

	var _flatCat = function _xcat(xf) {
	  var rxf = preservingReduced(xf);
	  return {
	    '@@transducer/init': _xfBase.init,
	    '@@transducer/result': function transducerResult(result) {
	      return rxf['@@transducer/result'](result);
	    },
	    '@@transducer/step': function transducerStep(result, input) {
	      return !_isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
	    }
	  };
	};

	var _xchain = /*#__PURE__*/_curry2(function _xchain(f, xf) {
	  return map(f, _flatCat(xf));
	});

	/**
	 * `chain` maps a function over a list and concatenates the results. `chain`
	 * is also known as `flatMap` in some libraries.
	 *
	 * Dispatches to the `chain` method of the second argument, if present,
	 * according to the [FantasyLand Chain spec](https://github.com/fantasyland/fantasy-land#chain).
	 *
	 * If second argument is a function, `chain(f, g)(x)` is equivalent to `f(g(x), x)`.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category List
	 * @sig Chain m => (a -> m b) -> m a -> m b
	 * @param {Function} fn The function to map with
	 * @param {Array} list The list to map over
	 * @return {Array} The result of flat-mapping `list` with `fn`
	 * @example
	 *
	 *      const duplicate = n => [n, n];
	 *      R.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
	 *
	 *      R.chain(R.append, R.head)([1, 2, 3]); //=> [1, 2, 3, 1]
	 */

	var chain = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['fantasy-land/chain', 'chain'], _xchain, function chain(fn, monad) {
	  if (typeof monad === 'function') {
	    return function (x) {
	      return fn(monad(x))(x);
	    };
	  }

	  return _makeFlat(false)(map(fn, monad));
	}));

	var defineProperty$2 = objectDefineProperty.f;
	var getOwnPropertyNames = objectGetOwnPropertyNames.f;








	var enforceInternalState = internalState.enforce;





	var MATCH = wellKnownSymbol('match');
	var NativeRegExp = global$1.RegExp;
	var RegExpPrototype = NativeRegExp.prototype;
	var SyntaxError = global$1.SyntaxError;
	var getFlags = functionUncurryThis(regexpFlags);
	var exec = functionUncurryThis(RegExpPrototype.exec);
	var charAt$1 = functionUncurryThis(''.charAt);
	var replace$1 = functionUncurryThis(''.replace);
	var stringIndexOf = functionUncurryThis(''.indexOf);
	var stringSlice$1 = functionUncurryThis(''.slice);
	// TODO: Use only propper RegExpIdentifierName
	var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var MISSED_STICKY = regexpStickyHelpers.MISSED_STICKY;
	var UNSUPPORTED_Y = regexpStickyHelpers.UNSUPPORTED_Y;

	var BASE_FORCED = descriptors &&
	  (!CORRECT_NEW || MISSED_STICKY || regexpUnsupportedDotAll || regexpUnsupportedNcg || fails(function () {
	    re2[MATCH] = false;
	    // RegExp constructor can alter flags and IsRegExp works correct with @@match
	    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	  }));

	var handleDotAll = function (string) {
	  var length = string.length;
	  var index = 0;
	  var result = '';
	  var brackets = false;
	  var chr;
	  for (; index <= length; index++) {
	    chr = charAt$1(string, index);
	    if (chr === '\\') {
	      result += chr + charAt$1(string, ++index);
	      continue;
	    }
	    if (!brackets && chr === '.') {
	      result += '[\\s\\S]';
	    } else {
	      if (chr === '[') {
	        brackets = true;
	      } else if (chr === ']') {
	        brackets = false;
	      } result += chr;
	    }
	  } return result;
	};

	var handleNCG = function (string) {
	  var length = string.length;
	  var index = 0;
	  var result = '';
	  var named = [];
	  var names = {};
	  var brackets = false;
	  var ncg = false;
	  var groupid = 0;
	  var groupname = '';
	  var chr;
	  for (; index <= length; index++) {
	    chr = charAt$1(string, index);
	    if (chr === '\\') {
	      chr = chr + charAt$1(string, ++index);
	    } else if (chr === ']') {
	      brackets = false;
	    } else if (!brackets) switch (true) {
	      case chr === '[':
	        brackets = true;
	        break;
	      case chr === '(':
	        if (exec(IS_NCG, stringSlice$1(string, index + 1))) {
	          index += 2;
	          ncg = true;
	        }
	        result += chr;
	        groupid++;
	        continue;
	      case chr === '>' && ncg:
	        if (groupname === '' || hasOwnProperty_1(names, groupname)) {
	          throw new SyntaxError('Invalid capture group name');
	        }
	        names[groupname] = true;
	        named[named.length] = [groupname, groupid];
	        ncg = false;
	        groupname = '';
	        continue;
	    }
	    if (ncg) groupname += chr;
	    else result += chr;
	  } return [result, named];
	};

	// `RegExp` constructor
	// https://tc39.es/ecma262/#sec-regexp-constructor
	if (isForced_1('RegExp', BASE_FORCED)) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = objectIsPrototypeOf(RegExpPrototype, this);
	    var patternIsRegExp = isRegexp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var groups = [];
	    var rawPattern = pattern;
	    var rawFlags, dotAll, sticky, handled, result, state;

	    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
	      return pattern;
	    }

	    if (patternIsRegExp || objectIsPrototypeOf(RegExpPrototype, pattern)) {
	      pattern = pattern.source;
	      if (flagsAreUndefined) flags = 'flags' in rawPattern ? rawPattern.flags : getFlags(rawPattern);
	    }

	    pattern = pattern === undefined ? '' : toString$1(pattern);
	    flags = flags === undefined ? '' : toString$1(flags);
	    rawPattern = pattern;

	    if (regexpUnsupportedDotAll && 'dotAll' in re1) {
	      dotAll = !!flags && stringIndexOf(flags, 's') > -1;
	      if (dotAll) flags = replace$1(flags, /s/g, '');
	    }

	    rawFlags = flags;

	    if (MISSED_STICKY && 'sticky' in re1) {
	      sticky = !!flags && stringIndexOf(flags, 'y') > -1;
	      if (sticky && UNSUPPORTED_Y) flags = replace$1(flags, /y/g, '');
	    }

	    if (regexpUnsupportedNcg) {
	      handled = handleNCG(pattern);
	      pattern = handled[0];
	      groups = handled[1];
	    }

	    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);

	    if (dotAll || sticky || groups.length) {
	      state = enforceInternalState(result);
	      if (dotAll) {
	        state.dotAll = true;
	        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
	      }
	      if (sticky) state.sticky = true;
	      if (groups.length) state.groups = groups;
	    }

	    if (pattern !== rawPattern) try {
	      // fails in old engines, but we have no alternatives for unsupported regex syntax
	      createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
	    } catch (error) { /* empty */ }

	    return result;
	  };

	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$2(RegExpWrapper, key, {
	      configurable: true,
	      get: function () { return NativeRegExp[key]; },
	      set: function (it) { NativeRegExp[key] = it; }
	    });
	  };

	  for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) {
	    proxy(keys[index++]);
	  }

	  RegExpPrototype.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype;
	  redefine(global$1, 'RegExp', RegExpWrapper);
	}

	// https://tc39.es/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

	function _cloneRegExp(pattern) {
	  return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
	}

	/**
	 * Gives a single-word string description of the (native) type of a value,
	 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
	 * attempt to distinguish user Object types any further, reporting them all as
	 * 'Object'.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Type
	 * @sig (* -> {*}) -> String
	 * @param {*} val The value to test
	 * @return {String}
	 * @example
	 *
	 *      R.type({}); //=> "Object"
	 *      R.type(1); //=> "Number"
	 *      R.type(false); //=> "Boolean"
	 *      R.type('s'); //=> "String"
	 *      R.type(null); //=> "Null"
	 *      R.type([]); //=> "Array"
	 *      R.type(/[A-z]/); //=> "RegExp"
	 *      R.type(() => {}); //=> "Function"
	 *      R.type(undefined); //=> "Undefined"
	 */

	var type = /*#__PURE__*/_curry1(function type(val) {
	  return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
	});

	/**
	 * Copies an object.
	 *
	 * @private
	 * @param {*} value The value to be copied
	 * @param {Array} refFrom Array containing the source references
	 * @param {Array} refTo Array containing the copied source references
	 * @param {Boolean} deep Whether or not to perform deep cloning.
	 * @return {*} The copied value.
	 */

	function _clone(value, refFrom, refTo, deep) {
	  var copy = function copy(copiedValue) {
	    var len = refFrom.length;
	    var idx = 0;

	    while (idx < len) {
	      if (value === refFrom[idx]) {
	        return refTo[idx];
	      }

	      idx += 1;
	    }

	    refFrom[idx + 1] = value;
	    refTo[idx + 1] = copiedValue;

	    for (var key in value) {
	      copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
	    }

	    return copiedValue;
	  };

	  switch (type(value)) {
	    case 'Object':
	      return copy({});

	    case 'Array':
	      return copy([]);

	    case 'Date':
	      return new Date(value.valueOf());

	    case 'RegExp':
	      return _cloneRegExp(value);

	    default:
	      return value;
	  }
	}

	/**
	 * Creates a deep copy of the value which may contain (nested) `Array`s and
	 * `Object`s, `Number`s, `String`s, `Boolean`s and `Date`s. `Function`s are
	 * assigned by reference rather than copied
	 *
	 * Dispatches to a `clone` method if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Object
	 * @sig {*} -> {*}
	 * @param {*} value The object or array to clone
	 * @return {*} A deeply cloned copy of `val`
	 * @example
	 *
	 *      const objects = [{}, {}, {}];
	 *      const objectsClone = R.clone(objects);
	 *      objects === objectsClone; //=> false
	 *      objects[0] === objectsClone[0]; //=> false
	 */

	var clone = /*#__PURE__*/_curry1(function clone(value) {
	  return value != null && typeof value.clone === 'function' ? value.clone() : _clone(value, [], [], true);
	});

	function _pipe(f, g) {
	  return function () {
	    return g.call(this, f.apply(this, arguments));
	  };
	}

	/**
	 * This checks whether a function has a [methodname] function. If it isn't an
	 * array it will execute that function otherwise it will default to the ramda
	 * implementation.
	 *
	 * @private
	 * @param {Function} fn ramda implemtation
	 * @param {String} methodname property to check for a custom implementation
	 * @return {Object} Whatever the return value of the method is.
	 */

	function _checkForMethod(methodname, fn) {
	  return function () {
	    var length = arguments.length;

	    if (length === 0) {
	      return fn();
	    }

	    var obj = arguments[length - 1];
	    return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
	  };
	}

	/**
	 * Returns the elements of the given list or string (or object with a `slice`
	 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
	 *
	 * Dispatches to the `slice` method of the third argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.4
	 * @category List
	 * @sig Number -> Number -> [a] -> [a]
	 * @sig Number -> Number -> String -> String
	 * @param {Number} fromIndex The start index (inclusive).
	 * @param {Number} toIndex The end index (exclusive).
	 * @param {*} list
	 * @return {*}
	 * @example
	 *
	 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
	 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
	 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
	 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
	 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
	 */

	var slice = /*#__PURE__*/_curry3( /*#__PURE__*/_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
	  return Array.prototype.slice.call(list, fromIndex, toIndex);
	}));

	/**
	 * Returns all but the first element of the given list or string (or object
	 * with a `tail` method).
	 *
	 * Dispatches to the `slice` method of the first argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> [a]
	 * @sig String -> String
	 * @param {*} list
	 * @return {*}
	 * @see R.head, R.init, R.last
	 * @example
	 *
	 *      R.tail([1, 2, 3]);  //=> [2, 3]
	 *      R.tail([1, 2]);     //=> [2]
	 *      R.tail([1]);        //=> []
	 *      R.tail([]);         //=> []
	 *
	 *      R.tail('abc');  //=> 'bc'
	 *      R.tail('ab');   //=> 'b'
	 *      R.tail('a');    //=> ''
	 *      R.tail('');     //=> ''
	 */

	var tail = /*#__PURE__*/_curry1( /*#__PURE__*/_checkForMethod('tail', /*#__PURE__*/slice(1, Infinity)));

	/**
	 * Performs left-to-right function composition. The first argument may have
	 * any arity; the remaining arguments must be unary.
	 *
	 * In some libraries this function is named `sequence`.
	 *
	 * **Note:** The result of pipe is not automatically curried.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
	 * @param {...Function} functions
	 * @return {Function}
	 * @see R.compose
	 * @example
	 *
	 *      const f = R.pipe(Math.pow, R.negate, R.inc);
	 *
	 *      f(3, 4); // -(3^4) + 1
	 * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
	 */

	function pipe() {
	  if (arguments.length === 0) {
	    throw new Error('pipe requires at least one argument');
	  }

	  return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
	}

	function _identity(x) {
	  return x;
	}

	/**
	 * A function that does nothing but return the parameter supplied to it. Good
	 * as a default or placeholder function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category Function
	 * @sig a -> a
	 * @param {*} x The value to return.
	 * @return {*} The input value, `x`.
	 * @example
	 *
	 *      R.identity(1); //=> 1
	 *
	 *      const obj = {};
	 *      R.identity(obj) === obj; //=> true
	 * @symb R.identity(a) = a
	 */

	var identity = /*#__PURE__*/_curry1(_identity);

	var floor = Math.floor;

	var mergeSort = function (array, comparefn) {
	  var length = array.length;
	  var middle = floor(length / 2);
	  return length < 8 ? insertionSort(array, comparefn) : merge(
	    array,
	    mergeSort(arraySliceSimple(array, 0, middle), comparefn),
	    mergeSort(arraySliceSimple(array, middle), comparefn),
	    comparefn
	  );
	};

	var insertionSort = function (array, comparefn) {
	  var length = array.length;
	  var i = 1;
	  var element, j;

	  while (i < length) {
	    j = i;
	    element = array[i];
	    while (j && comparefn(array[j - 1], element) > 0) {
	      array[j] = array[--j];
	    }
	    if (j !== i++) array[j] = element;
	  } return array;
	};

	var merge = function (array, left, right, comparefn) {
	  var llength = left.length;
	  var rlength = right.length;
	  var lindex = 0;
	  var rindex = 0;

	  while (lindex < llength || rindex < rlength) {
	    array[lindex + rindex] = (lindex < llength && rindex < rlength)
	      ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
	      : lindex < llength ? left[lindex++] : right[rindex++];
	  } return array;
	};

	var arraySort = mergeSort;

	var firefox = engineUserAgent.match(/firefox\/(\d+)/i);

	var engineFfVersion = !!firefox && +firefox[1];

	var engineIsIeOrEdge = /MSIE|Trident/.test(engineUserAgent);

	var webkit = engineUserAgent.match(/AppleWebKit\/(\d+)\./);

	var engineWebkitVersion = !!webkit && +webkit[1];

	var test = [];
	var un$Sort = functionUncurryThis(test.sort);
	var push$2 = functionUncurryThis(test.push);

	// IE8-
	var FAILS_ON_UNDEFINED = fails(function () {
	  test.sort(undefined);
	});
	// V8 bug
	var FAILS_ON_NULL = fails(function () {
	  test.sort(null);
	});
	// Old WebKit
	var STRICT_METHOD$1 = arrayMethodIsStrict('sort');

	var STABLE_SORT = !fails(function () {
	  // feature detection can be too slow, so check engines versions
	  if (engineV8Version) return engineV8Version < 70;
	  if (engineFfVersion && engineFfVersion > 3) return;
	  if (engineIsIeOrEdge) return true;
	  if (engineWebkitVersion) return engineWebkitVersion < 603;

	  var result = '';
	  var code, chr, value, index;

	  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
	  for (code = 65; code < 76; code++) {
	    chr = String.fromCharCode(code);

	    switch (code) {
	      case 66: case 69: case 70: case 72: value = 3; break;
	      case 68: case 71: value = 4; break;
	      default: value = 2;
	    }

	    for (index = 0; index < 47; index++) {
	      test.push({ k: chr + index, v: value });
	    }
	  }

	  test.sort(function (a, b) { return b.v - a.v; });

	  for (index = 0; index < test.length; index++) {
	    chr = test[index].k.charAt(0);
	    if (result.charAt(result.length - 1) !== chr) result += chr;
	  }

	  return result !== 'DGBEFHACIJK';
	});

	var FORCED$1 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$1 || !STABLE_SORT;

	var getSortCompare = function (comparefn) {
	  return function (x, y) {
	    if (y === undefined) return -1;
	    if (x === undefined) return 1;
	    if (comparefn !== undefined) return +comparefn(x, y) || 0;
	    return toString$1(x) > toString$1(y) ? 1 : -1;
	  };
	};

	// `Array.prototype.sort` method
	// https://tc39.es/ecma262/#sec-array.prototype.sort
	_export({ target: 'Array', proto: true, forced: FORCED$1 }, {
	  sort: function sort(comparefn) {
	    if (comparefn !== undefined) aCallable(comparefn);

	    var array = toObject(this);

	    if (STABLE_SORT) return comparefn === undefined ? un$Sort(array) : un$Sort(array, comparefn);

	    var items = [];
	    var arrayLength = lengthOfArrayLike(array);
	    var itemsLength, index;

	    for (index = 0; index < arrayLength; index++) {
	      if (index in array) push$2(items, array[index]);
	    }

	    arraySort(items, getSortCompare(comparefn));

	    itemsLength = items.length;
	    index = 0;

	    while (index < itemsLength) array[index] = items[index++];
	    while (index < arrayLength) delete array[index++];

	    return array;
	  }
	});

	var FUNCTION_NAME_EXISTS = functionName.EXISTS;

	var defineProperty$1 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var functionToString = functionUncurryThis(FunctionPrototype.toString);
	var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
	var regExpExec = functionUncurryThis(nameRE.exec);
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name
	if (descriptors && !FUNCTION_NAME_EXISTS) {
	  defineProperty$1(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return regExpExec(nameRE, functionToString(this))[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	function _arrayFromIterator(iter) {
	  var list = [];
	  var next;

	  while (!(next = iter.next()).done) {
	    list.push(next.value);
	  }

	  return list;
	}

	function _includesWith(pred, x, list) {
	  var idx = 0;
	  var len = list.length;

	  while (idx < len) {
	    if (pred(x, list[idx])) {
	      return true;
	    }

	    idx += 1;
	  }

	  return false;
	}

	function _functionName(f) {
	  // String(x => x) evaluates to "x => x", so the pattern may not match.
	  var match = String(f).match(/^function (\w*)/);
	  return match == null ? '' : match[1];
	}

	// `SameValue` abstract operation
	// https://tc39.es/ecma262/#sec-samevalue
	// eslint-disable-next-line es/no-object-is -- safe
	var sameValue = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	// `Object.is` method
	// https://tc39.es/ecma262/#sec-object.is
	_export({ target: 'Object', stat: true }, {
	  is: sameValue
	});

	// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	function _objectIs(a, b) {
	  // SameValue algorithm
	  if (a === b) {
	    // Steps 1-5, 7-10
	    // Steps 6.b-6.e: +0 != -0
	    return a !== 0 || 1 / a === 1 / b;
	  } else {
	    // Step 6.a: NaN == NaN
	    return a !== a && b !== b;
	  }
	}

	var _objectIs$1 = typeof Object.is === 'function' ? Object.is : _objectIs;

	/**
	 * private _uniqContentEquals function.
	 * That function is checking equality of 2 iterator contents with 2 assumptions
	 * - iterators lengths are the same
	 * - iterators values are unique
	 *
	 * false-positive result will be returned for comparision of, e.g.
	 * - [1,2,3] and [1,2,3,4]
	 * - [1,1,1] and [1,2,3]
	 * */

	function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
	  var a = _arrayFromIterator(aIterator);

	  var b = _arrayFromIterator(bIterator);

	  function eq(_a, _b) {
	    return _equals(_a, _b, stackA.slice(), stackB.slice());
	  } // if *a* array contains any element that is not included in *b*


	  return !_includesWith(function (b, aItem) {
	    return !_includesWith(eq, aItem, b);
	  }, b, a);
	}

	function _equals(a, b, stackA, stackB) {
	  if (_objectIs$1(a, b)) {
	    return true;
	  }

	  var typeA = type(a);

	  if (typeA !== type(b)) {
	    return false;
	  }

	  if (a == null || b == null) {
	    return false;
	  }

	  if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
	    return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
	  }

	  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
	    return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
	  }

	  switch (typeA) {
	    case 'Arguments':
	    case 'Array':
	    case 'Object':
	      if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
	        return a === b;
	      }

	      break;

	    case 'Boolean':
	    case 'Number':
	    case 'String':
	      if (!(_typeof(a) === _typeof(b) && _objectIs$1(a.valueOf(), b.valueOf()))) {
	        return false;
	      }

	      break;

	    case 'Date':
	      if (!_objectIs$1(a.valueOf(), b.valueOf())) {
	        return false;
	      }

	      break;

	    case 'Error':
	      return a.name === b.name && a.message === b.message;

	    case 'RegExp':
	      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
	        return false;
	      }

	      break;
	  }

	  var idx = stackA.length - 1;

	  while (idx >= 0) {
	    if (stackA[idx] === a) {
	      return stackB[idx] === b;
	    }

	    idx -= 1;
	  }

	  switch (typeA) {
	    case 'Map':
	      if (a.size !== b.size) {
	        return false;
	      }

	      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));

	    case 'Set':
	      if (a.size !== b.size) {
	        return false;
	      }

	      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));

	    case 'Arguments':
	    case 'Array':
	    case 'Object':
	    case 'Boolean':
	    case 'Number':
	    case 'String':
	    case 'Date':
	    case 'Error':
	    case 'RegExp':
	    case 'Int8Array':
	    case 'Uint8Array':
	    case 'Uint8ClampedArray':
	    case 'Int16Array':
	    case 'Uint16Array':
	    case 'Int32Array':
	    case 'Uint32Array':
	    case 'Float32Array':
	    case 'Float64Array':
	    case 'ArrayBuffer':
	      break;

	    default:
	      // Values of other types are only equal if identical.
	      return false;
	  }

	  var keysA = keys$1(a);

	  if (keysA.length !== keys$1(b).length) {
	    return false;
	  }

	  var extendedStackA = stackA.concat([a]);
	  var extendedStackB = stackB.concat([b]);
	  idx = keysA.length - 1;

	  while (idx >= 0) {
	    var key = keysA[idx];

	    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
	      return false;
	    }

	    idx -= 1;
	  }

	  return true;
	}

	/**
	 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
	 * cyclical data structures.
	 *
	 * Dispatches symmetrically to the `equals` methods of both arguments, if
	 * present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.15.0
	 * @category Relation
	 * @sig a -> b -> Boolean
	 * @param {*} a
	 * @param {*} b
	 * @return {Boolean}
	 * @example
	 *
	 *      R.equals(1, 1); //=> true
	 *      R.equals(1, '1'); //=> false
	 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
	 *
	 *      const a = {}; a.v = a;
	 *      const b = {}; b.v = b;
	 *      R.equals(a, b); //=> true
	 */

	var equals = /*#__PURE__*/_curry2(function equals(a, b) {
	  return _equals(a, b, [], []);
	});

	function _indexOf(list, a, idx) {
	  var inf, item; // Array.prototype.indexOf doesn't exist below IE9

	  if (typeof list.indexOf === 'function') {
	    switch (_typeof(a)) {
	      case 'number':
	        if (a === 0) {
	          // manually crawl the list to distinguish between +0 and -0
	          inf = 1 / a;

	          while (idx < list.length) {
	            item = list[idx];

	            if (item === 0 && 1 / item === inf) {
	              return idx;
	            }

	            idx += 1;
	          }

	          return -1;
	        } else if (a !== a) {
	          // NaN
	          while (idx < list.length) {
	            item = list[idx];

	            if (typeof item === 'number' && item !== item) {
	              return idx;
	            }

	            idx += 1;
	          }

	          return -1;
	        } // non-zero numbers can utilise Set


	        return list.indexOf(a, idx);
	      // all these types can utilise Set

	      case 'string':
	      case 'boolean':
	      case 'function':
	      case 'undefined':
	        return list.indexOf(a, idx);

	      case 'object':
	        if (a === null) {
	          // null can utilise Set
	          return list.indexOf(a, idx);
	        }

	    }
	  } // anything else not covered above, defer to R.equals


	  while (idx < list.length) {
	    if (equals(list[idx], a)) {
	      return idx;
	    }

	    idx += 1;
	  }

	  return -1;
	}

	function _includes(a, list) {
	  return _indexOf(list, a, 0) >= 0;
	}

	function _filter(fn, list) {
	  var idx = 0;
	  var len = list.length;
	  var result = [];

	  while (idx < len) {
	    if (fn(list[idx])) {
	      result[result.length] = list[idx];
	    }

	    idx += 1;
	  }

	  return result;
	}

	function _isObject(x) {
	  return Object.prototype.toString.call(x) === '[object Object]';
	}

	var XFilter = /*#__PURE__*/function () {
	  function XFilter(f, xf) {
	    this.xf = xf;
	    this.f = f;
	  }

	  XFilter.prototype['@@transducer/init'] = _xfBase.init;
	  XFilter.prototype['@@transducer/result'] = _xfBase.result;

	  XFilter.prototype['@@transducer/step'] = function (result, input) {
	    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
	  };

	  return XFilter;
	}();

	var _xfilter = /*#__PURE__*/_curry2(function _xfilter(f, xf) {
	  return new XFilter(f, xf);
	});

	/**
	 * Takes a predicate and a `Filterable`, and returns a new filterable of the
	 * same type containing the members of the given filterable which satisfy the
	 * given predicate. Filterable objects include plain objects or any object
	 * that has a filter method such as `Array`.
	 *
	 * Dispatches to the `filter` method of the second argument, if present.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Filterable f => (a -> Boolean) -> f a -> f a
	 * @param {Function} pred
	 * @param {Array} filterable
	 * @return {Array} Filterable
	 * @see R.reject, R.transduce, R.addIndex
	 * @example
	 *
	 *      const isEven = n => n % 2 === 0;
	 *
	 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
	 *
	 *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
	 */

	var filter = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['filter'], _xfilter, function (pred, filterable) {
	  return _isObject(filterable) ? _reduce(function (acc, key) {
	    if (pred(filterable[key])) {
	      acc[key] = filterable[key];
	    }

	    return acc;
	  }, {}, keys$1(filterable)) : // else
	  _filter(pred, filterable);
	}));

	var XReduceBy = /*#__PURE__*/function () {
	  function XReduceBy(valueFn, valueAcc, keyFn, xf) {
	    this.valueFn = valueFn;
	    this.valueAcc = valueAcc;
	    this.keyFn = keyFn;
	    this.xf = xf;
	    this.inputs = {};
	  }

	  XReduceBy.prototype['@@transducer/init'] = _xfBase.init;

	  XReduceBy.prototype['@@transducer/result'] = function (result) {
	    var key;

	    for (key in this.inputs) {
	      if (_has(key, this.inputs)) {
	        result = this.xf['@@transducer/step'](result, this.inputs[key]);

	        if (result['@@transducer/reduced']) {
	          result = result['@@transducer/value'];
	          break;
	        }
	      }
	    }

	    this.inputs = null;
	    return this.xf['@@transducer/result'](result);
	  };

	  XReduceBy.prototype['@@transducer/step'] = function (result, input) {
	    var key = this.keyFn(input);
	    this.inputs[key] = this.inputs[key] || [key, this.valueAcc];
	    this.inputs[key][1] = this.valueFn(this.inputs[key][1], input);
	    return result;
	  };

	  return XReduceBy;
	}();

	var _xreduceBy = /*#__PURE__*/_curryN(4, [], function _xreduceBy(valueFn, valueAcc, keyFn, xf) {
	  return new XReduceBy(valueFn, valueAcc, keyFn, xf);
	});

	/**
	 * Groups the elements of the list according to the result of calling
	 * the String-returning function `keyFn` on each element and reduces the elements
	 * of each group to a single value via the reducer function `valueFn`.
	 *
	 * This function is basically a more general [`groupBy`](#groupBy) function.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.20.0
	 * @category List
	 * @sig ((a, b) -> a) -> a -> (b -> String) -> [b] -> {String: a}
	 * @param {Function} valueFn The function that reduces the elements of each group to a single
	 *        value. Receives two values, accumulator for a particular group and the current element.
	 * @param {*} acc The (initial) accumulator value for each group.
	 * @param {Function} keyFn The function that maps the list's element into a key.
	 * @param {Array} list The array to group.
	 * @return {Object} An object with the output of `keyFn` for keys, mapped to the output of
	 *         `valueFn` for elements which produced that key when passed to `keyFn`.
	 * @see R.groupBy, R.reduce
	 * @example
	 *
	 *      const groupNames = (acc, {name}) => acc.concat(name)
	 *      const toGrade = ({score}) =>
	 *        score < 65 ? 'F' :
	 *        score < 70 ? 'D' :
	 *        score < 80 ? 'C' :
	 *        score < 90 ? 'B' : 'A'
	 *
	 *      var students = [
	 *        {name: 'Abby', score: 83},
	 *        {name: 'Bart', score: 62},
	 *        {name: 'Curt', score: 88},
	 *        {name: 'Dora', score: 92},
	 *      ]
	 *
	 *      reduceBy(groupNames, [], toGrade, students)
	 *      //=> {"A": ["Dora"], "B": ["Abby", "Curt"], "F": ["Bart"]}
	 */

	var reduceBy = /*#__PURE__*/_curryN(4, [], /*#__PURE__*/_dispatchable([], _xreduceBy, function reduceBy(valueFn, valueAcc, keyFn, list) {
	  return _reduce(function (acc, elt) {
	    var key = keyFn(elt);
	    acc[key] = valueFn(_has(key, acc) ? acc[key] : _clone(valueAcc, [], [], false), elt);
	    return acc;
	  }, {}, list);
	}));

	var _Set = /*#__PURE__*/function () {
	  function _Set() {
	    /* globals Set */
	    this._nativeSet = typeof Set === 'function' ? new Set() : null;
	    this._items = {};
	  } // until we figure out why jsdoc chokes on this
	  // @param item The item to add to the Set
	  // @returns {boolean} true if the item did not exist prior, otherwise false
	  //


	  _Set.prototype.add = function (item) {
	    return !hasOrAdd(item, true, this);
	  }; //
	  // @param item The item to check for existence in the Set
	  // @returns {boolean} true if the item exists in the Set, otherwise false
	  //


	  _Set.prototype.has = function (item) {
	    return hasOrAdd(item, false, this);
	  }; //
	  // Combines the logic for checking whether an item is a member of the set and
	  // for adding a new item to the set.
	  //
	  // @param item       The item to check or add to the Set instance.
	  // @param shouldAdd  If true, the item will be added to the set if it doesn't
	  //                   already exist.
	  // @param set        The set instance to check or add to.
	  // @return {boolean} true if the item already existed, otherwise false.
	  //


	  return _Set;
	}();

	function hasOrAdd(item, shouldAdd, set) {
	  var type = _typeof(item);

	  var prevSize, newSize;

	  switch (type) {
	    case 'string':
	    case 'number':
	      // distinguish between +0 and -0
	      if (item === 0 && 1 / item === -Infinity) {
	        if (set._items['-0']) {
	          return true;
	        } else {
	          if (shouldAdd) {
	            set._items['-0'] = true;
	          }

	          return false;
	        }
	      } // these types can all utilise the native Set


	      if (set._nativeSet !== null) {
	        if (shouldAdd) {
	          prevSize = set._nativeSet.size;

	          set._nativeSet.add(item);

	          newSize = set._nativeSet.size;
	          return newSize === prevSize;
	        } else {
	          return set._nativeSet.has(item);
	        }
	      } else {
	        if (!(type in set._items)) {
	          if (shouldAdd) {
	            set._items[type] = {};
	            set._items[type][item] = true;
	          }

	          return false;
	        } else if (item in set._items[type]) {
	          return true;
	        } else {
	          if (shouldAdd) {
	            set._items[type][item] = true;
	          }

	          return false;
	        }
	      }

	    case 'boolean':
	      // set._items['boolean'] holds a two element array
	      // representing [ falseExists, trueExists ]
	      if (type in set._items) {
	        var bIdx = item ? 1 : 0;

	        if (set._items[type][bIdx]) {
	          return true;
	        } else {
	          if (shouldAdd) {
	            set._items[type][bIdx] = true;
	          }

	          return false;
	        }
	      } else {
	        if (shouldAdd) {
	          set._items[type] = item ? [false, true] : [true, false];
	        }

	        return false;
	      }

	    case 'function':
	      // compare functions for reference equality
	      if (set._nativeSet !== null) {
	        if (shouldAdd) {
	          prevSize = set._nativeSet.size;

	          set._nativeSet.add(item);

	          newSize = set._nativeSet.size;
	          return newSize === prevSize;
	        } else {
	          return set._nativeSet.has(item);
	        }
	      } else {
	        if (!(type in set._items)) {
	          if (shouldAdd) {
	            set._items[type] = [item];
	          }

	          return false;
	        }

	        if (!_includes(item, set._items[type])) {
	          if (shouldAdd) {
	            set._items[type].push(item);
	          }

	          return false;
	        }

	        return true;
	      }

	    case 'undefined':
	      if (set._items[type]) {
	        return true;
	      } else {
	        if (shouldAdd) {
	          set._items[type] = true;
	        }

	        return false;
	      }

	    case 'object':
	      if (item === null) {
	        if (!set._items['null']) {
	          if (shouldAdd) {
	            set._items['null'] = true;
	          }

	          return false;
	        }

	        return true;
	      }

	    /* falls through */

	    default:
	      // reduce the search size of heterogeneous sets by creating buckets
	      // for each type.
	      type = Object.prototype.toString.call(item);

	      if (!(type in set._items)) {
	        if (shouldAdd) {
	          set._items[type] = [item];
	        }

	        return false;
	      } // scan through all previously applied items


	      if (!_includes(item, set._items[type])) {
	        if (shouldAdd) {
	          set._items[type].push(item);
	        }

	        return false;
	      }

	      return true;
	  }
	} // A simple Set type that honours R.equals semantics

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

	var TypeError$2 = global$1.TypeError;
	var max = Math.max;
	var min = Math.min;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.es/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = lengthOfArrayLike(O);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
	      throw TypeError$2(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var XTake = /*#__PURE__*/function () {
	  function XTake(n, xf) {
	    this.xf = xf;
	    this.n = n;
	    this.i = 0;
	  }

	  XTake.prototype['@@transducer/init'] = _xfBase.init;
	  XTake.prototype['@@transducer/result'] = _xfBase.result;

	  XTake.prototype['@@transducer/step'] = function (result, input) {
	    this.i += 1;
	    var ret = this.n === 0 ? result : this.xf['@@transducer/step'](result, input);
	    return this.n >= 0 && this.i >= this.n ? _reduced(ret) : ret;
	  };

	  return XTake;
	}();

	var _xtake = /*#__PURE__*/_curry2(function _xtake(n, xf) {
	  return new XTake(n, xf);
	});

	/**
	 * Returns the first `n` elements of the given list, string, or
	 * transducer/transformer (or object with a `take` method).
	 *
	 * Dispatches to the `take` method of the second argument, if present.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig Number -> [a] -> [a]
	 * @sig Number -> String -> String
	 * @param {Number} n
	 * @param {*} list
	 * @return {*}
	 * @see R.drop
	 * @example
	 *
	 *      R.take(1, ['foo', 'bar', 'baz']); //=> ['foo']
	 *      R.take(2, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
	 *      R.take(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	 *      R.take(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
	 *      R.take(3, 'ramda');               //=> 'ram'
	 *
	 *      const personnel = [
	 *        'Dave Brubeck',
	 *        'Paul Desmond',
	 *        'Eugene Wright',
	 *        'Joe Morello',
	 *        'Gerry Mulligan',
	 *        'Bob Bates',
	 *        'Joe Dodge',
	 *        'Ron Crotty'
	 *      ];
	 *
	 *      const takeFive = R.take(5);
	 *      takeFive(personnel);
	 *      //=> ['Dave Brubeck', 'Paul Desmond', 'Eugene Wright', 'Joe Morello', 'Gerry Mulligan']
	 * @symb R.take(-1, [a, b]) = [a, b]
	 * @symb R.take(0, [a, b]) = []
	 * @symb R.take(1, [a, b]) = [a]
	 * @symb R.take(2, [a, b]) = [a, b]
	 */

	var take = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['take'], _xtake, function take(n, xs) {
	  return slice(0, n < 0 ? Infinity : n, xs);
	}));

	function dropLast$1(n, xs) {
	  return take(n < xs.length ? xs.length - n : 0, xs);
	}

	var XDropLast = /*#__PURE__*/function () {
	  function XDropLast(n, xf) {
	    this.xf = xf;
	    this.pos = 0;
	    this.full = false;
	    this.acc = new Array(n);
	  }

	  XDropLast.prototype['@@transducer/init'] = _xfBase.init;

	  XDropLast.prototype['@@transducer/result'] = function (result) {
	    this.acc = null;
	    return this.xf['@@transducer/result'](result);
	  };

	  XDropLast.prototype['@@transducer/step'] = function (result, input) {
	    if (this.full) {
	      result = this.xf['@@transducer/step'](result, this.acc[this.pos]);
	    }

	    this.store(input);
	    return result;
	  };

	  XDropLast.prototype.store = function (input) {
	    this.acc[this.pos] = input;
	    this.pos += 1;

	    if (this.pos === this.acc.length) {
	      this.pos = 0;
	      this.full = true;
	    }
	  };

	  return XDropLast;
	}();

	var _xdropLast = /*#__PURE__*/_curry2(function _xdropLast(n, xf) {
	  return new XDropLast(n, xf);
	});

	/**
	 * Returns a list containing all but the last `n` elements of the given `list`.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category List
	 * @sig Number -> [a] -> [a]
	 * @sig Number -> String -> String
	 * @param {Number} n The number of elements of `list` to skip.
	 * @param {Array} list The list of elements to consider.
	 * @return {Array} A copy of the list with only the first `list.length - n` elements
	 * @see R.takeLast, R.drop, R.dropWhile, R.dropLastWhile
	 * @example
	 *
	 *      R.dropLast(1, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
	 *      R.dropLast(2, ['foo', 'bar', 'baz']); //=> ['foo']
	 *      R.dropLast(3, ['foo', 'bar', 'baz']); //=> []
	 *      R.dropLast(4, ['foo', 'bar', 'baz']); //=> []
	 *      R.dropLast(3, 'ramda');               //=> 'ra'
	 */

	var dropLast = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable([], _xdropLast, dropLast$1));

	/**
	 * Returns a new list by pulling every item out of it (and all its sub-arrays)
	 * and putting them in a new array, depth-first.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> [b]
	 * @param {Array} list The array to consider.
	 * @return {Array} The flattened list.
	 * @see R.unnest
	 * @example
	 *
	 *      R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
	 *      //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	 */

	var flatten = /*#__PURE__*/_curry1( /*#__PURE__*/_makeFlat(true));

	/**
	 * Creates a new object from a list key-value pairs. If a key appears in
	 * multiple pairs, the rightmost pair is included in the object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category List
	 * @sig [[k,v]] -> {k: v}
	 * @param {Array} pairs An array of two-element arrays that will be the keys and values of the output object.
	 * @return {Object} The object made by pairing up `keys` and `values`.
	 * @see R.toPairs, R.pair
	 * @example
	 *
	 *      R.fromPairs([['a', 1], ['b', 2], ['c', 3]]); //=> {a: 1, b: 2, c: 3}
	 */

	var fromPairs = /*#__PURE__*/_curry1(function fromPairs(pairs) {
	  var result = {};
	  var idx = 0;

	  while (idx < pairs.length) {
	    result[pairs[idx][0]] = pairs[idx][1];
	    idx += 1;
	  }

	  return result;
	});

	/**
	 * Splits a list into sub-lists stored in an object, based on the result of
	 * calling a String-returning function on each element, and grouping the
	 * results according to values returned.
	 *
	 * Dispatches to the `groupBy` method of the second argument, if present.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig (a -> String) -> [a] -> {String: [a]}
	 * @param {Function} fn Function :: a -> String
	 * @param {Array} list The array to group
	 * @return {Object} An object with the output of `fn` for keys, mapped to arrays of elements
	 *         that produced that key when passed to `fn`.
	 * @see R.reduceBy, R.transduce
	 * @example
	 *
	 *      const byGrade = R.groupBy(function(student) {
	 *        const score = student.score;
	 *        return score < 65 ? 'F' :
	 *               score < 70 ? 'D' :
	 *               score < 80 ? 'C' :
	 *               score < 90 ? 'B' : 'A';
	 *      });
	 *      const students = [{name: 'Abby', score: 84},
	 *                      {name: 'Eddy', score: 58},
	 *                      // ...
	 *                      {name: 'Jack', score: 69}];
	 *      byGrade(students);
	 *      // {
	 *      //   'A': [{name: 'Dianne', score: 99}],
	 *      //   'B': [{name: 'Abby', score: 84}]
	 *      //   // ...,
	 *      //   'F': [{name: 'Eddy', score: 58}]
	 *      // }
	 */

	var groupBy = /*#__PURE__*/_curry2( /*#__PURE__*/_checkForMethod('groupBy', /*#__PURE__*/reduceBy(function (acc, item) {
	  if (acc == null) {
	    acc = [];
	  }

	  acc.push(item);
	  return acc;
	}, null)));

	/**
	 * Given a function that generates a key, turns a list of objects into an
	 * object indexing the objects by the given key. Note that if multiple
	 * objects generate the same value for the indexing key only the last value
	 * will be included in the generated object.
	 *
	 * Acts as a transducer if a transformer is given in list position.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category List
	 * @sig (a -> String) -> [{k: v}] -> {k: {k: v}}
	 * @param {Function} fn Function :: a -> String
	 * @param {Array} array The array of objects to index
	 * @return {Object} An object indexing each array element by the given property.
	 * @example
	 *
	 *      const list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
	 *      R.indexBy(R.prop('id'), list);
	 *      //=> {abc: {id: 'abc', title: 'B'}, xyz: {id: 'xyz', title: 'A'}}
	 */

	var indexBy = /*#__PURE__*/reduceBy(function (acc, elem) {
	  return elem;
	}, null);

	/**
	 * Returns a new list containing only one copy of each element in the original
	 * list, based upon the value returned by applying the supplied function to
	 * each list element. Prefers the first item if the supplied function produces
	 * the same value on two items. [`R.equals`](#equals) is used for comparison.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.16.0
	 * @category List
	 * @sig (a -> b) -> [a] -> [a]
	 * @param {Function} fn A function used to produce a value to use during comparisons.
	 * @param {Array} list The array to consider.
	 * @return {Array} The list of unique items.
	 * @example
	 *
	 *      R.uniqBy(Math.abs, [-1, -5, 2, 10, 1, 2]); //=> [-1, -5, 2, 10]
	 */

	var uniqBy = /*#__PURE__*/_curry2(function uniqBy(fn, list) {
	  var set = new _Set();
	  var result = [];
	  var idx = 0;
	  var appliedItem, item;

	  while (idx < list.length) {
	    item = list[idx];
	    appliedItem = fn(item);

	    if (set.add(appliedItem)) {
	      result.push(item);
	    }

	    idx += 1;
	  }

	  return result;
	});

	/**
	 * Returns a new list containing only one copy of each element in the original
	 * list. [`R.equals`](#equals) is used to determine equality.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.1.0
	 * @category List
	 * @sig [a] -> [a]
	 * @param {Array} list The array to consider.
	 * @return {Array} The list of unique items.
	 * @example
	 *
	 *      R.uniq([1, 1, 2, 1]); //=> [1, 2]
	 *      R.uniq([1, '1']);     //=> [1, '1']
	 *      R.uniq([[42], [42]]); //=> [[42]]
	 */

	var uniq = /*#__PURE__*/uniqBy(identity);

	// eslint-disable-next-line es/no-object-assign -- safe
	var $assign = Object.assign;
	// eslint-disable-next-line es/no-object-defineproperty -- required for testing
	var defineProperty = Object.defineProperty;
	var concat$1 = functionUncurryThis([].concat);

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	var objectAssign = !$assign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line es/no-symbol -- safe
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? concat$1(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || functionCall(propertyIsEnumerable, S, key)) T[key] = S[key];
	    }
	  } return T;
	} : $assign;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	// eslint-disable-next-line es/no-object-assign -- required for testing
	_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	function _objectAssign(target) {
	  if (target == null) {
	    throw new TypeError('Cannot convert undefined or null to object');
	  }

	  var output = Object(target);
	  var idx = 1;
	  var length = arguments.length;

	  while (idx < length) {
	    var source = arguments[idx];

	    if (source != null) {
	      for (var nextKey in source) {
	        if (_has(nextKey, source)) {
	          output[nextKey] = source[nextKey];
	        }
	      }
	    }

	    idx += 1;
	  }

	  return output;
	}

	var _objectAssign$1 = typeof Object.assign === 'function' ? Object.assign : _objectAssign;

	/**
	 * Takes a function and two values, and returns whichever value produces the
	 * larger result when passed to the provided function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Relation
	 * @sig Ord b => (a -> b) -> a -> a -> a
	 * @param {Function} f
	 * @param {*} a
	 * @param {*} b
	 * @return {*}
	 * @see R.max, R.minBy
	 * @example
	 *
	 *      //  square :: Number -> Number
	 *      const square = n => n * n;
	 *
	 *      R.maxBy(square, -3, 2); //=> -3
	 *
	 *      R.reduce(R.maxBy(square), 0, [3, -5, 4, 1, -2]); //=> -5
	 *      R.reduce(R.maxBy(square), 0, []); //=> 0
	 */

	var maxBy = /*#__PURE__*/_curry3(function maxBy(f, a, b) {
	  return f(b) > f(a) ? b : a;
	});

	/**
	 * Merges a list of objects together into one object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.10.0
	 * @category List
	 * @sig [{k: v}] -> {k: v}
	 * @param {Array} list An array of objects
	 * @return {Object} A merged object.
	 * @see R.reduce
	 * @example
	 *
	 *      R.mergeAll([{foo:1},{bar:2},{baz:3}]); //=> {foo:1,bar:2,baz:3}
	 *      R.mergeAll([{foo:1},{foo:2},{bar:2}]); //=> {foo:2,bar:2}
	 * @symb R.mergeAll([{ x: 1 }, { y: 2 }, { z: 3 }]) = { x: 1, y: 2, z: 3 }
	 */

	var mergeAll = /*#__PURE__*/_curry1(function mergeAll(list) {
	  return _objectAssign$1.apply(null, [{}].concat(list));
	});

	/**
	 * Creates a new object with the own properties of the two provided objects. If
	 * a key exists in both objects, the provided function is applied to the key
	 * and the values associated with the key in each object, with the result being
	 * used as the value associated with the key in the returned object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.19.0
	 * @category Object
	 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
	 * @param {Function} fn
	 * @param {Object} l
	 * @param {Object} r
	 * @return {Object}
	 * @see R.mergeDeepWithKey, R.merge, R.mergeWith
	 * @example
	 *
	 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
	 *      R.mergeWithKey(concatValues,
	 *                     { a: true, thing: 'foo', values: [10, 20] },
	 *                     { b: true, thing: 'bar', values: [15, 35] });
	 *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
	 * @symb R.mergeWithKey(f, { x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: f('y', 2, 5), z: 3 }
	 */

	var mergeWithKey = /*#__PURE__*/_curry3(function mergeWithKey(fn, l, r) {
	  var result = {};
	  var k;

	  for (k in l) {
	    if (_has(k, l)) {
	      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
	    }
	  }

	  for (k in r) {
	    if (_has(k, r) && !_has(k, result)) {
	      result[k] = r[k];
	    }
	  }

	  return result;
	});

	/**
	 * Creates a new object with the own properties of the two provided objects.
	 * If a key exists in both objects:
	 * - and both associated values are also objects then the values will be
	 *   recursively merged.
	 * - otherwise the provided function is applied to the key and associated values
	 *   using the resulting value as the new value associated with the key.
	 * If a key only exists in one object, the value will be associated with the key
	 * of the resulting object.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.24.0
	 * @category Object
	 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
	 * @param {Function} fn
	 * @param {Object} lObj
	 * @param {Object} rObj
	 * @return {Object}
	 * @see R.mergeWithKey, R.mergeDeepWith
	 * @example
	 *
	 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
	 *      R.mergeDeepWithKey(concatValues,
	 *                         { a: true, c: { thing: 'foo', values: [10, 20] }},
	 *                         { b: true, c: { thing: 'bar', values: [15, 35] }});
	 *      //=> { a: true, b: true, c: { thing: 'bar', values: [10, 20, 15, 35] }}
	 */

	var mergeDeepWithKey = /*#__PURE__*/_curry3(function mergeDeepWithKey(fn, lObj, rObj) {
	  return mergeWithKey(function (k, lVal, rVal) {
	    if (_isObject(lVal) && _isObject(rVal)) {
	      return mergeDeepWithKey(fn, lVal, rVal);
	    } else {
	      return fn(k, lVal, rVal);
	    }
	  }, lObj, rObj);
	});

	/**
	 * Creates a new object with the own properties of the first object merged with
	 * the own properties of the second object. If a key exists in both objects:
	 * - and both values are objects, the two values will be recursively merged
	 * - otherwise the value from the first object will be used.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.24.0
	 * @category Object
	 * @sig {a} -> {a} -> {a}
	 * @param {Object} lObj
	 * @param {Object} rObj
	 * @return {Object}
	 * @see R.merge, R.mergeDeepRight, R.mergeDeepWith, R.mergeDeepWithKey
	 * @example
	 *
	 *      R.mergeDeepLeft({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
	 *                      { age: 40, contact: { email: 'baa@example.com' }});
	 *      //=> { name: 'fred', age: 10, contact: { email: 'moo@example.com' }}
	 */

	var mergeDeepLeft = /*#__PURE__*/_curry2(function mergeDeepLeft(lObj, rObj) {
	  return mergeDeepWithKey(function (k, lVal, rVal) {
	    return lVal;
	  }, lObj, rObj);
	});

	/**
	 * Takes a function and two values, and returns whichever value produces the
	 * smaller result when passed to the provided function.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.8.0
	 * @category Relation
	 * @sig Ord b => (a -> b) -> a -> a -> a
	 * @param {Function} f
	 * @param {*} a
	 * @param {*} b
	 * @return {*}
	 * @see R.min, R.maxBy
	 * @example
	 *
	 *      //  square :: Number -> Number
	 *      const square = n => n * n;
	 *
	 *      R.minBy(square, -3, 2); //=> 2
	 *
	 *      R.reduce(R.minBy(square), Infinity, [3, -5, 4, 1, -2]); //=> 1
	 *      R.reduce(R.minBy(square), Infinity, []); //=> Infinity
	 */

	var minBy = /*#__PURE__*/_curry3(function minBy(f, a, b) {
	  return f(b) < f(a) ? b : a;
	});

	/**
	 * Converts an object into an array of key, value arrays. Only the object's
	 * own properties are used.
	 * Note that the order of the output array is not guaranteed to be consistent
	 * across different JS platforms.
	 *
	 * @func
	 * @memberOf R
	 * @since v0.4.0
	 * @category Object
	 * @sig {String: *} -> [[String,*]]
	 * @param {Object} obj The object to extract from
	 * @return {Array} An array of key, value arrays from the object's own properties.
	 * @see R.fromPairs
	 * @example
	 *
	 *      R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
	 */

	var toPairs = /*#__PURE__*/_curry1(function toPairs(obj) {
	  var pairs = [];

	  for (var prop in obj) {
	    if (_has(prop, obj)) {
	      pairs[pairs.length] = [prop, obj[prop]];
	    }
	  }

	  return pairs;
	});

	/**
	 * Shorthand for `R.chain(R.identity)`, which removes one level of nesting from
	 * any [Chain](https://github.com/fantasyland/fantasy-land#chain).
	 *
	 * @func
	 * @memberOf R
	 * @since v0.3.0
	 * @category List
	 * @sig Chain c => c (c a) -> c a
	 * @param {*} list
	 * @return {*}
	 * @see R.flatten, R.chain
	 * @example
	 *
	 *      R.unnest([1, [2], [[3]]]); //=> [1, 2, [3]]
	 *      R.unnest([[1, 2], [3, 4], [5, 6]]); //=> [1, 2, 3, 4, 5, 6]
	 */

	var unnest$1 = /*#__PURE__*/chain(_identity);

	var $every = arrayIteration.every;


	var STRICT_METHOD = arrayMethodIsStrict('every');

	// `Array.prototype.every` method
	// https://tc39.es/ecma262/#sec-array.prototype.every
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD }, {
	  every: function every(callbackfn /* , thisArg */) {
	    return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var _excluded$2 = ["query"];

	function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$3(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
	var DEFAULT_GRANULARITY = 'day';
	var GRANULARITIES = [{
	  name: undefined,
	  title: 'w/o grouping'
	}, {
	  name: 'second',
	  title: 'Second'
	}, {
	  name: 'minute',
	  title: 'Minute'
	}, {
	  name: 'hour',
	  title: 'Hour'
	}, {
	  name: 'day',
	  title: 'Day'
	}, {
	  name: 'week',
	  title: 'Week'
	}, {
	  name: 'month',
	  title: 'Month'
	}, {
	  name: 'quarter',
	  title: 'Quarter'
	}, {
	  name: 'year',
	  title: 'Year'
	}];
	function removeEmptyQueryFields(_query) {
	  var query = _query || {};
	  return fromPairs(toPairs(query).map(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2),
	        key = _ref2[0],
	        value = _ref2[1];

	    if (['measures', 'dimensions', 'segments', 'timeDimensions', 'filters'].includes(key)) {
	      if (Array.isArray(value) && value.length === 0) {
	        return null;
	      }
	    }

	    if (key === 'order' && value) {
	      if (Array.isArray(value) && !value.length) {
	        return null;
	      } else if (!Object.keys(value).length) {
	        return null;
	      }
	    }

	    return [key, value];
	  }).filter(Boolean));
	}
	function validateQuery(_query) {
	  var query = _query || {};
	  return removeEmptyQueryFields(_objectSpread$3(_objectSpread$3({}, query), {}, {
	    filters: (query.filters || []).filter(function (f) {
	      return f.operator;
	    }),
	    timeDimensions: (query.timeDimensions || []).filter(function (td) {
	      return !(!td.dateRange && !td.granularity);
	    })
	  }));
	}
	function areQueriesEqual() {
	  var query1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var query2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  return equals(Object.entries(query1 && query1.order || {}), Object.entries(query2 && query2.order || {})) && equals(query1, query2);
	}
	function defaultOrder(query) {
	  var granularity = (query.timeDimensions || []).find(function (d) {
	    return d.granularity;
	  });

	  if (granularity) {
	    return _defineProperty({}, granularity.dimension, 'asc');
	  } else if ((query.measures || []).length > 0 && (query.dimensions || []).length > 0) {
	    return _defineProperty({}, query.measures[0], 'desc');
	  } else if ((query.dimensions || []).length > 0) {
	    return _defineProperty({}, query.dimensions[0], 'asc');
	  }

	  return {};
	}
	function defaultHeuristics(newState) {
	  var oldQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var options = arguments.length > 2 ? arguments[2] : undefined;

	  var _clone = clone(newState),
	      query = _clone.query,
	      props = _objectWithoutProperties(_clone, _excluded$2);

	  var meta = options.meta,
	      sessionGranularity = options.sessionGranularity;
	  var granularity = sessionGranularity || DEFAULT_GRANULARITY;

	  var state = _objectSpread$3({
	    query: query
	  }, props);

	  var newQuery = null;

	  if (!areQueriesEqual(query, oldQuery)) {
	    newQuery = query;
	  }

	  if (Array.isArray(newQuery) || Array.isArray(oldQuery)) {
	    return newState;
	  }

	  if (newQuery) {
	    if ((oldQuery.timeDimensions || []).length === 1 && (newQuery.timeDimensions || []).length === 1 && newQuery.timeDimensions[0].granularity && oldQuery.timeDimensions[0].granularity !== newQuery.timeDimensions[0].granularity) {
	      state = _objectSpread$3(_objectSpread$3({}, state), {}, {
	        sessionGranularity: newQuery.timeDimensions[0].granularity
	      });
	    }

	    if ((oldQuery.measures || []).length === 0 && (newQuery.measures || []).length > 0 || (oldQuery.measures || []).length === 1 && (newQuery.measures || []).length === 1 && oldQuery.measures[0] !== newQuery.measures[0]) {
	      var _ref6 = newQuery.timeDimensions || [],
	          _ref7 = _slicedToArray(_ref6, 1),
	          td = _ref7[0];

	      var defaultTimeDimension = meta.defaultTimeDimensionNameFor(newQuery.measures[0]);
	      newQuery = _objectSpread$3(_objectSpread$3({}, newQuery), {}, {
	        timeDimensions: defaultTimeDimension ? [{
	          dimension: defaultTimeDimension,
	          granularity: td && td.granularity || granularity,
	          dateRange: td && td.dateRange
	        }] : []
	      });
	      return _objectSpread$3(_objectSpread$3({}, state), {}, {
	        pivotConfig: null,
	        shouldApplyHeuristicOrder: true,
	        query: newQuery,
	        chartType: defaultTimeDimension ? 'line' : 'number'
	      });
	    }

	    if ((oldQuery.dimensions || []).length === 0 && (newQuery.dimensions || []).length > 0) {
	      newQuery = _objectSpread$3(_objectSpread$3({}, newQuery), {}, {
	        timeDimensions: (newQuery.timeDimensions || []).map(function (td) {
	          return _objectSpread$3(_objectSpread$3({}, td), {}, {
	            granularity: undefined
	          });
	        })
	      });
	      return _objectSpread$3(_objectSpread$3({}, state), {}, {
	        pivotConfig: null,
	        shouldApplyHeuristicOrder: true,
	        query: newQuery,
	        chartType: 'table'
	      });
	    }

	    if ((oldQuery.dimensions || []).length > 0 && (newQuery.dimensions || []).length === 0) {
	      newQuery = _objectSpread$3(_objectSpread$3({}, newQuery), {}, {
	        timeDimensions: (newQuery.timeDimensions || []).map(function (td) {
	          return _objectSpread$3(_objectSpread$3({}, td), {}, {
	            granularity: td.granularity || granularity
	          });
	        })
	      });
	      return _objectSpread$3(_objectSpread$3({}, state), {}, {
	        pivotConfig: null,
	        shouldApplyHeuristicOrder: true,
	        query: newQuery,
	        chartType: (newQuery.timeDimensions || []).length ? 'line' : 'number'
	      });
	    }

	    if (((oldQuery.dimensions || []).length > 0 || (oldQuery.measures || []).length > 0) && (newQuery.dimensions || []).length === 0 && (newQuery.measures || []).length === 0) {
	      newQuery = _objectSpread$3(_objectSpread$3({}, newQuery), {}, {
	        timeDimensions: [],
	        filters: []
	      });
	      return _objectSpread$3(_objectSpread$3({}, state), {}, {
	        pivotConfig: null,
	        shouldApplyHeuristicOrder: true,
	        query: newQuery,
	        sessionGranularity: null
	      });
	    }

	    return state;
	  }

	  if (state.chartType) {
	    var newChartType = state.chartType;

	    if ((newChartType === 'line' || newChartType === 'area') && (oldQuery.timeDimensions || []).length === 1 && !oldQuery.timeDimensions[0].granularity) {
	      var _oldQuery$timeDimensi = _slicedToArray(oldQuery.timeDimensions, 1),
	          _td = _oldQuery$timeDimensi[0];

	      return _objectSpread$3(_objectSpread$3({}, state), {}, {
	        pivotConfig: null,
	        query: _objectSpread$3(_objectSpread$3({}, oldQuery), {}, {
	          timeDimensions: [_objectSpread$3(_objectSpread$3({}, _td), {}, {
	            granularity: granularity
	          })]
	        })
	      });
	    }

	    if ((newChartType === 'pie' || newChartType === 'table' || newChartType === 'number') && (oldQuery.timeDimensions || []).length === 1 && oldQuery.timeDimensions[0].granularity) {
	      var _oldQuery$timeDimensi2 = _slicedToArray(oldQuery.timeDimensions, 1),
	          _td2 = _oldQuery$timeDimensi2[0];

	      return _objectSpread$3(_objectSpread$3({}, state), {}, {
	        pivotConfig: null,
	        shouldApplyHeuristicOrder: true,
	        query: _objectSpread$3(_objectSpread$3({}, oldQuery), {}, {
	          timeDimensions: [_objectSpread$3(_objectSpread$3({}, _td2), {}, {
	            granularity: undefined
	          })]
	        })
	      });
	    }
	  }

	  return state;
	}
	function isQueryPresent(query) {
	  if (!query) {
	    return false;
	  }

	  return (Array.isArray(query) ? query : [query]).every(function (q) {
	    return q.measures && q.measures.length || q.dimensions && q.dimensions.length || q.timeDimensions && q.timeDimensions.length;
	  });
	}
	function movePivotItem(pivotConfig, sourceIndex, destinationIndex, sourceAxis, destinationAxis) {
	  var nextPivotConfig = _objectSpread$3(_objectSpread$3({}, pivotConfig), {}, {
	    x: _toConsumableArray(pivotConfig.x),
	    y: _toConsumableArray(pivotConfig.y)
	  });

	  var id = pivotConfig[sourceAxis][sourceIndex];
	  var lastIndex = nextPivotConfig[destinationAxis].length - 1;

	  if (id === 'measures') {
	    destinationIndex = lastIndex + 1;
	  } else if (destinationIndex >= lastIndex && nextPivotConfig[destinationAxis][lastIndex] === 'measures') {
	    destinationIndex = lastIndex - 1;
	  }

	  nextPivotConfig[sourceAxis].splice(sourceIndex, 1);
	  nextPivotConfig[destinationAxis].splice(destinationIndex, 0, id);
	  return nextPivotConfig;
	}
	function moveItemInArray(list, sourceIndex, destinationIndex) {
	  var result = _toConsumableArray(list);

	  var _result$splice = result.splice(sourceIndex, 1),
	      _result$splice2 = _slicedToArray(_result$splice, 1),
	      removed = _result$splice2[0];

	  result.splice(destinationIndex, 0, removed);
	  return result;
	}
	function flattenFilters() {
	  var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	  return filters.reduce(function (memo, filter) {
	    if (filter.or || filter.and) {
	      return [].concat(_toConsumableArray(memo), _toConsumableArray(flattenFilters(filter.or || filter.and)));
	    }

	    return [].concat(_toConsumableArray(memo), [filter]);
	  }, []);
	}
	function getQueryMembers() {
	  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var keys = ['measures', 'dimensions', 'segments'];
	  var members = new Set();
	  keys.forEach(function (key) {
	    return (query[key] || []).forEach(function (member) {
	      return members.add(member);
	    });
	  });
	  (query.timeDimensions || []).forEach(function (td) {
	    return members.add(td.dimension);
	  });
	  flattenFilters(query.filters).forEach(function (filter) {
	    return members.add(filter.dimension || filter.member);
	  });
	  return _toConsumableArray(members);
	}
	function getOrderMembersFromOrder(orderMembers, order) {
	  var ids = new Set();
	  var indexedOrderMembers = indexBy(prop('id'), orderMembers);
	  var entries = Array.isArray(order) ? order : Object.entries(order || {});
	  var nextOrderMembers = [];
	  entries.forEach(function (_ref8) {
	    var _ref9 = _slicedToArray(_ref8, 2),
	        memberId = _ref9[0],
	        currentOrder = _ref9[1];

	    if (currentOrder !== 'none' && indexedOrderMembers[memberId]) {
	      ids.add(memberId);
	      nextOrderMembers.push(_objectSpread$3(_objectSpread$3({}, indexedOrderMembers[memberId]), {}, {
	        order: currentOrder
	      }));
	    }
	  });
	  orderMembers.forEach(function (member) {
	    if (!ids.has(member.id)) {
	      nextOrderMembers.push(_objectSpread$3(_objectSpread$3({}, member), {}, {
	        order: member.order || 'none'
	      }));
	    }
	  });
	  return nextOrderMembers;
	}
	function aliasSeries(values, index, pivotConfig, duplicateMeasures) {
	  var nonNullValues = values.filter(function (value) {
	    return value != null;
	  });

	  if (pivotConfig && pivotConfig.aliasSeries && pivotConfig.aliasSeries[index]) {
	    return [pivotConfig.aliasSeries[index]].concat(_toConsumableArray(nonNullValues));
	  } else if (duplicateMeasures.has(nonNullValues[0])) {
	    return [index].concat(_toConsumableArray(nonNullValues));
	  }

	  return nonNullValues;
	}

	var _excluded$1 = ["x"],
	    _excluded2 = ["key"],
	    _excluded3 = ["title", "shortTitle"];

	function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
	dayjs_min.extend(quarterOfYear); // When granularity is week, weekStart Value must be 1. However, since the client can change it globally (https://day.js.org/docs/en/i18n/changing-locale)
	// So the function below has been added.

	var internalDayjs = function internalDayjs() {
	  return dayjs_min.apply(void 0, arguments).locale(_objectSpread$2(_objectSpread$2({}, en), {}, {
	    weekStart: 1
	  }));
	};

	var TIME_SERIES = {
	  day: function day(range) {
	    return range.by('d').map(function (d) {
	      return d.format('YYYY-MM-DDT00:00:00.000');
	    });
	  },
	  month: function month(range) {
	    return range.snapTo('month').by('M').map(function (d) {
	      return d.format('YYYY-MM-01T00:00:00.000');
	    });
	  },
	  year: function year(range) {
	    return range.snapTo('year').by('y').map(function (d) {
	      return d.format('YYYY-01-01T00:00:00.000');
	    });
	  },
	  hour: function hour(range) {
	    return range.by('h').map(function (d) {
	      return d.format('YYYY-MM-DDTHH:00:00.000');
	    });
	  },
	  minute: function minute(range) {
	    return range.by('m').map(function (d) {
	      return d.format('YYYY-MM-DDTHH:mm:00.000');
	    });
	  },
	  second: function second(range) {
	    return range.by('s').map(function (d) {
	      return d.format('YYYY-MM-DDTHH:mm:ss.000');
	    });
	  },
	  week: function week(range) {
	    return range.snapTo('week').by('w').map(function (d) {
	      return d.startOf('week').format('YYYY-MM-DDT00:00:00.000');
	    });
	  },
	  quarter: function quarter(range) {
	    return range.snapTo('quarter').by('quarter').map(function (d) {
	      return d.startOf('quarter').format('YYYY-MM-DDT00:00:00.000');
	    });
	  }
	};
	var DateRegex = /^\d\d\d\d-\d\d-\d\d$/;
	var LocalDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z?$/;

	var groupByToPairs = function groupByToPairs(keyFn) {
	  var acc = new Map();
	  return function (data) {
	    data.forEach(function (row) {
	      var key = keyFn(row);

	      if (!acc.has(key)) {
	        acc.set(key, []);
	      }

	      acc.get(key).push(row);
	    });
	    return Array.from(acc.entries());
	  };
	};

	var unnest = function unnest(arr) {
	  var res = [];
	  arr.forEach(function (subArr) {
	    subArr.forEach(function (element) {
	      return res.push(element);
	    });
	  });
	  return res;
	};

	var dayRange = function dayRange(from, to) {
	  return {
	    by: function by(value) {
	      var results = [];
	      var start = internalDayjs(from);
	      var end = internalDayjs(to);

	      while (start.isBefore(end) || start.isSame(end)) {
	        results.push(start);
	        start = start.add(1, value);
	      }

	      return results;
	    },
	    snapTo: function snapTo(value) {
	      return dayRange(internalDayjs(from).startOf(value), internalDayjs(to).endOf(value));
	    },
	    start: internalDayjs(from),
	    end: internalDayjs(to)
	  };
	};
	var QUERY_TYPE = {
	  REGULAR_QUERY: 'regularQuery',
	  COMPARE_DATE_RANGE_QUERY: 'compareDateRangeQuery',
	  BLENDING_QUERY: 'blendingQuery'
	};

	var ResultSet = /*#__PURE__*/function () {
	  function ResultSet(loadResponse) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, ResultSet);

	    this.loadResponse = loadResponse;

	    if (this.loadResponse.queryType != null) {
	      this.queryType = loadResponse.queryType;
	      this.loadResponses = loadResponse.results;
	    } else {
	      this.queryType = QUERY_TYPE.REGULAR_QUERY;
	      this.loadResponse.pivotQuery = _objectSpread$2(_objectSpread$2({}, loadResponse.query), {}, {
	        queryType: this.queryType
	      });
	      this.loadResponses = [loadResponse];
	    }

	    if (!Object.values(QUERY_TYPE).includes(this.queryType)) {
	      throw new Error('Unknown query type');
	    }

	    this.parseDateMeasures = options.parseDateMeasures;
	    this.options = options;
	    this.backwardCompatibleData = [];
	  }

	  _createClass(ResultSet, [{
	    key: "drillDown",
	    value: function drillDown(drillDownLocator, pivotConfig) {
	      if (this.queryType === QUERY_TYPE.COMPARE_DATE_RANGE_QUERY) {
	        throw new Error('compareDateRange drillDown query is not currently supported');
	      }

	      if (this.queryType === QUERY_TYPE.BLENDING_QUERY) {
	        throw new Error('Data blending drillDown query is not currently supported');
	      }

	      var query = this.loadResponses[0].query;
	      var _drillDownLocator$xVa = drillDownLocator.xValues,
	          xValues = _drillDownLocator$xVa === void 0 ? [] : _drillDownLocator$xVa,
	          _drillDownLocator$yVa = drillDownLocator.yValues,
	          yValues = _drillDownLocator$yVa === void 0 ? [] : _drillDownLocator$yVa;
	      var normalizedPivotConfig = this.normalizePivotConfig(pivotConfig);
	      var values = [];
	      normalizedPivotConfig.x.forEach(function (member, currentIndex) {
	        return values.push([member, xValues[currentIndex]]);
	      });
	      normalizedPivotConfig.y.forEach(function (member, currentIndex) {
	        return values.push([member, yValues[currentIndex]]);
	      });

	      var _this$query = this.query(),
	          _this$query$filters = _this$query.filters,
	          parentFilters = _this$query$filters === void 0 ? [] : _this$query$filters,
	          _this$query$segments = _this$query.segments,
	          segments = _this$query$segments === void 0 ? [] : _this$query$segments;

	      var measures = this.loadResponses[0].annotation.measures;

	      var _ref = values.find(function (_ref3) {
	        var _ref4 = _slicedToArray(_ref3, 1),
	            member = _ref4[0];

	        return member === 'measures';
	      }) || [],
	          _ref2 = _slicedToArray(_ref, 2),
	          measureName = _ref2[1];

	      if (measureName === undefined) {
	        var _Object$keys = Object.keys(measures);

	        var _Object$keys2 = _slicedToArray(_Object$keys, 1);

	        measureName = _Object$keys2[0];
	      }

	      if (!(measures[measureName] && measures[measureName].drillMembers || []).length) {
	        return null;
	      }

	      var filters = [{
	        member: measureName,
	        operator: 'measureFilter'
	      }].concat(_toConsumableArray(parentFilters));
	      var timeDimensions = [];
	      values.filter(function (_ref5) {
	        var _ref6 = _slicedToArray(_ref5, 1),
	            member = _ref6[0];

	        return member !== 'measures';
	      }).forEach(function (_ref7) {
	        var _ref8 = _slicedToArray(_ref7, 2),
	            member = _ref8[0],
	            value = _ref8[1];

	        var _member$split = member.split('.'),
	            _member$split2 = _slicedToArray(_member$split, 3),
	            cubeName = _member$split2[0],
	            dimension = _member$split2[1],
	            granularity = _member$split2[2];

	        if (granularity !== undefined) {
	          var range = dayRange(value, value).snapTo(granularity);
	          var originalTimeDimension = query.timeDimensions.find(function (td) {
	            return td.dimension;
	          });
	          var dateRange = [range.start, range.end];

	          if (originalTimeDimension !== null && originalTimeDimension !== void 0 && originalTimeDimension.dateRange) {
	            var _originalTimeDimensio = _slicedToArray(originalTimeDimension.dateRange, 2),
	                originalStart = _originalTimeDimensio[0],
	                originalEnd = _originalTimeDimensio[1];

	            dateRange = [dayjs_min(originalStart) > range.start ? dayjs_min(originalStart) : range.start, dayjs_min(originalEnd) < range.end ? dayjs_min(originalEnd) : range.end];
	          }

	          timeDimensions.push({
	            dimension: [cubeName, dimension].join('.'),
	            dateRange: dateRange.map(function (dt) {
	              return dt.format('YYYY-MM-DDTHH:mm:ss.SSS');
	            })
	          });
	        } else if (value == null) {
	          filters.push({
	            member: member,
	            operator: 'notSet'
	          });
	        } else {
	          filters.push({
	            member: member,
	            operator: 'equals',
	            values: [value.toString()]
	          });
	        }
	      });

	      if (timeDimensions.length === 0 && query.timeDimensions.length > 0 && query.timeDimensions[0].granularity == null) {
	        timeDimensions.push(query.timeDimensions[0]);
	      }

	      return _objectSpread$2(_objectSpread$2(_objectSpread$2({}, measures[measureName].drillMembersGrouped), {}, {
	        filters: filters
	      }, segments.length > 0 ? {
	        segments: segments
	      } : {}), {}, {
	        timeDimensions: timeDimensions,
	        segments: segments,
	        timezone: query.timezone
	      });
	    }
	  }, {
	    key: "series",
	    value: function series(pivotConfig) {
	      var _this = this;

	      return this.seriesNames(pivotConfig).map(function (_ref9) {
	        var title = _ref9.title,
	            shortTitle = _ref9.shortTitle,
	            key = _ref9.key;
	        return {
	          title: title,
	          shortTitle: shortTitle,
	          key: key,
	          series: _this.chartPivot(pivotConfig).map(function (_ref10) {
	            var x = _ref10.x,
	                obj = _objectWithoutProperties(_ref10, _excluded$1);

	            return {
	              value: obj[key],
	              x: x
	            };
	          })
	        };
	      });
	    }
	  }, {
	    key: "axisValues",
	    value: function axisValues(axis) {
	      var resultIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	      var query = this.loadResponses[resultIndex].query;
	      return function (row) {
	        var value = function value(measure) {
	          return axis.filter(function (d) {
	            return d !== 'measures';
	          }).map(function (d) {
	            return row[d] != null ? row[d] : null;
	          }).concat(measure ? [measure] : []);
	        };

	        if (axis.find(function (d) {
	          return d === 'measures';
	        }) && (query.measures || []).length) {
	          return query.measures.map(value);
	        }

	        return [value()];
	      };
	    }
	  }, {
	    key: "axisValuesString",
	    value: function axisValuesString(axisValues, delimiter) {
	      var formatValue = function formatValue(v) {
	        if (v == null) {
	          return '∅';
	        } else if (v === '') {
	          return '[Empty string]';
	        } else {
	          return v;
	        }
	      };

	      return axisValues.map(formatValue).join(delimiter || ', ');
	    }
	  }, {
	    key: "normalizePivotConfig",
	    value: function normalizePivotConfig(pivotConfig) {
	      return ResultSet.getNormalizedPivotConfig(this.loadResponse.pivotQuery, pivotConfig);
	    }
	  }, {
	    key: "timeSeries",
	    value: function timeSeries(timeDimension, resultIndex) {
	      if (!timeDimension.granularity) {
	        return null;
	      }

	      var dateRange = timeDimension.dateRange;

	      if (!dateRange) {
	        var member = ResultSet.timeDimensionMember(timeDimension);
	        var dates = pipe(map(function (row) {
	          return row[member] && internalDayjs(row[member]);
	        }), filter(Boolean))(this.timeDimensionBackwardCompatibleData(resultIndex));
	        dateRange = dates.length && [reduce(minBy(function (d) {
	          return d.toDate();
	        }), dates[0], dates), reduce(maxBy(function (d) {
	          return d.toDate();
	        }), dates[0], dates)] || null;
	      }

	      if (!dateRange) {
	        return null;
	      }

	      var padToDay = timeDimension.dateRange ? timeDimension.dateRange.find(function (d) {
	        return d.match(DateRegex);
	      }) : !['hour', 'minute', 'second'].includes(timeDimension.granularity);

	      var _dateRange = dateRange,
	          _dateRange2 = _slicedToArray(_dateRange, 2),
	          start = _dateRange2[0],
	          end = _dateRange2[1];

	      var range = dayRange(start, end);

	      if (!TIME_SERIES[timeDimension.granularity]) {
	        throw new Error("Unsupported time granularity: ".concat(timeDimension.granularity));
	      }

	      return TIME_SERIES[timeDimension.granularity](padToDay ? range.snapTo('d') : range);
	    }
	  }, {
	    key: "pivot",
	    value: function pivot(pivotConfig) {
	      var _this2 = this;

	      pivotConfig = this.normalizePivotConfig(pivotConfig);
	      var query = this.loadResponse.pivotQuery;

	      var pivotImpl = function pivotImpl() {
	        var resultIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	        var groupByXAxis = groupByToPairs(function (_ref11) {
	          var xValues = _ref11.xValues;
	          return _this2.axisValuesString(xValues);
	        });

	        var measureValue = function measureValue(row, measure) {
	          return row[measure] || 0;
	        };

	        if (pivotConfig.fillMissingDates && pivotConfig.x.length === 1 && equals(pivotConfig.x, (query.timeDimensions || []).filter(function (td) {
	          return Boolean(td.granularity);
	        }).map(function (td) {
	          return ResultSet.timeDimensionMember(td);
	        }))) {
	          var series = _this2.loadResponses.map(function (loadResponse) {
	            return _this2.timeSeries(loadResponse.query.timeDimensions[0], resultIndex);
	          });

	          if (series[0]) {
	            groupByXAxis = function groupByXAxis(rows) {
	              var byXValues = groupBy(function (_ref12) {
	                var xValues = _ref12.xValues;
	                return xValues[0];
	              }, rows);
	              return series[resultIndex].map(function (d) {
	                return [d, byXValues[d] || [{
	                  xValues: [d],
	                  row: {}
	                }]];
	              });
	            };
	          }
	        }

	        var xGrouped = pipe(map(function (row) {
	          return _this2.axisValues(pivotConfig.x, resultIndex)(row).map(function (xValues) {
	            return {
	              xValues: xValues,
	              row: row
	            };
	          });
	        }), unnest, groupByXAxis)(_this2.timeDimensionBackwardCompatibleData(resultIndex));
	        var yValuesMap = {};
	        xGrouped.forEach(function (_ref13) {
	          var _ref14 = _slicedToArray(_ref13, 2),
	              rows = _ref14[1];

	          rows.forEach(function (_ref15) {
	            var row = _ref15.row;

	            _this2.axisValues(pivotConfig.y, resultIndex)(row).forEach(function (values) {
	              if (Object.keys(row).length > 0) {
	                yValuesMap[values.join()] = values;
	              }
	            });
	          });
	        });
	        var allYValues = Object.values(yValuesMap);
	        var measureOnX = Boolean(pivotConfig.x.find(function (d) {
	          return d === 'measures';
	        }));
	        return xGrouped.map(function (_ref16) {
	          var _ref17 = _slicedToArray(_ref16, 2),
	              rows = _ref17[1];

	          var xValues = rows[0].xValues;
	          var yGrouped = {};
	          rows.forEach(function (_ref18) {
	            var row = _ref18.row;

	            var arr = _this2.axisValues(pivotConfig.y, resultIndex)(row).map(function (yValues) {
	              return {
	                yValues: yValues,
	                row: row
	              };
	            });

	            arr.forEach(function (res) {
	              yGrouped[_this2.axisValuesString(res.yValues)] = res;
	            });
	          });
	          return {
	            xValues: xValues,
	            yValuesArray: unnest(allYValues.map(function (yValues) {
	              var measure = measureOnX ? ResultSet.measureFromAxis(xValues) : ResultSet.measureFromAxis(yValues);
	              return [[yValues, measureValue((yGrouped[_this2.axisValuesString(yValues)] || {
	                row: {}
	              }).row, measure)]];
	            }))
	          };
	        });
	      };

	      var pivots = this.loadResponses.length > 1 ? this.loadResponses.map(function (_, index) {
	        return pivotImpl(index);
	      }) : [];
	      return pivots.length ? this.mergePivots(pivots, pivotConfig.joinDateRange) : pivotImpl();
	    }
	  }, {
	    key: "mergePivots",
	    value: function mergePivots(pivots, joinDateRange) {
	      var minLengthPivot = pivots.reduce(function (memo, current) {
	        return memo != null && current.length >= memo.length ? memo : current;
	      }, null);
	      return minLengthPivot.map(function (_, index) {
	        var xValues = joinDateRange ? [pivots.map(function (pivot) {
	          return pivot[index] && pivot[index].xValues || [];
	        }).join(', ')] : minLengthPivot[index].xValues;
	        return {
	          xValues: xValues,
	          yValuesArray: unnest(pivots.map(function (pivot) {
	            return pivot[index].yValuesArray;
	          }))
	        };
	      });
	    }
	  }, {
	    key: "pivotedRows",
	    value: function pivotedRows(pivotConfig) {
	      // TODO
	      return this.chartPivot(pivotConfig);
	    }
	  }, {
	    key: "chartPivot",
	    value: function chartPivot(pivotConfig) {
	      var _this3 = this;

	      var validate = function validate(value) {
	        if (_this3.parseDateMeasures && LocalDateRegex.test(value)) {
	          return new Date(value);
	        } else if (!Number.isNaN(Number.parseFloat(value))) {
	          return Number.parseFloat(value);
	        }

	        return value;
	      };

	      var duplicateMeasures = new Set();

	      if (this.queryType === QUERY_TYPE.BLENDING_QUERY) {
	        var allMeasures = flatten(this.loadResponses.map(function (_ref19) {
	          var query = _ref19.query;
	          return query.measures;
	        }));
	        allMeasures.filter(function (e, i, a) {
	          return a.indexOf(e) !== i;
	        }).forEach(function (m) {
	          return duplicateMeasures.add(m);
	        });
	      }

	      return this.pivot(pivotConfig).map(function (_ref20) {
	        var xValues = _ref20.xValues,
	            yValuesArray = _ref20.yValuesArray;
	        var yValuesMap = {};
	        yValuesArray.forEach(function (_ref21, i) {
	          var _ref22 = _slicedToArray(_ref21, 2),
	              yValues = _ref22[0],
	              m = _ref22[1];

	          yValuesMap[_this3.axisValuesString(aliasSeries(yValues, i, pivotConfig, duplicateMeasures), ',')] = m && validate(m);
	        });
	        return _objectSpread$2({
	          x: _this3.axisValuesString(xValues, ','),
	          xValues: xValues
	        }, yValuesMap);
	      });
	    }
	  }, {
	    key: "tablePivot",
	    value: function tablePivot(pivotConfig) {
	      var normalizedPivotConfig = this.normalizePivotConfig(pivotConfig || {});
	      var isMeasuresPresent = normalizedPivotConfig.x.concat(normalizedPivotConfig.y).includes('measures');
	      return this.pivot(normalizedPivotConfig).map(function (_ref23) {
	        var xValues = _ref23.xValues,
	            yValuesArray = _ref23.yValuesArray;
	        return fromPairs(normalizedPivotConfig.x.map(function (key, index) {
	          return [key, xValues[index]];
	        }).concat(isMeasuresPresent ? yValuesArray.map(function (_ref24) {
	          var _ref25 = _slicedToArray(_ref24, 2),
	              yValues = _ref25[0],
	              measure = _ref25[1];

	          return [yValues.length ? yValues.join() : 'value', measure];
	        }) : []));
	      });
	    }
	  }, {
	    key: "tableColumns",
	    value: function tableColumns(pivotConfig) {
	      var normalizedPivotConfig = this.normalizePivotConfig(pivotConfig || {});
	      var annotations = pipe(pluck('annotation'), reduce(mergeDeepLeft(), {}))(this.loadResponses);
	      var flatMeta = Object.values(annotations).reduce(function (a, b) {
	        return _objectSpread$2(_objectSpread$2({}, a), b);
	      }, {});
	      var schema = {};

	      var extractFields = function extractFields(key) {
	        var _ref26 = flatMeta[key] || {},
	            title = _ref26.title,
	            shortTitle = _ref26.shortTitle,
	            type = _ref26.type,
	            format = _ref26.format,
	            meta = _ref26.meta;

	        return {
	          key: key,
	          title: title,
	          shortTitle: shortTitle,
	          type: type,
	          format: format,
	          meta: meta
	        };
	      };

	      var pivot = this.pivot(normalizedPivotConfig);
	      (pivot[0] && pivot[0].yValuesArray || []).forEach(function (_ref27) {
	        var _ref28 = _slicedToArray(_ref27, 1),
	            yValues = _ref28[0];

	        if (yValues.length > 0) {
	          var currentItem = schema;
	          yValues.forEach(function (value, index) {
	            currentItem["_".concat(value)] = {
	              key: value,
	              memberId: normalizedPivotConfig.y[index] === 'measures' ? value : normalizedPivotConfig.y[index],
	              children: currentItem["_".concat(value)] && currentItem["_".concat(value)].children || {}
	            };
	            currentItem = currentItem["_".concat(value)].children;
	          });
	        }
	      });

	      var toColumns = function toColumns() {
	        var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	        var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	        if (Object.keys(item).length === 0) {
	          return [];
	        }

	        return Object.values(item).map(function (_ref29) {
	          var key = _ref29.key,
	              currentItem = _objectWithoutProperties(_ref29, _excluded2);

	          var children = toColumns(currentItem.children, [].concat(_toConsumableArray(path), [key]));

	          var _extractFields = extractFields(currentItem.memberId),
	              title = _extractFields.title,
	              shortTitle = _extractFields.shortTitle,
	              fields = _objectWithoutProperties(_extractFields, _excluded3);

	          var dimensionValue = key !== currentItem.memberId || title == null ? key : '';

	          if (!children.length) {
	            return _objectSpread$2(_objectSpread$2({}, fields), {}, {
	              key: key,
	              dataIndex: [].concat(_toConsumableArray(path), [key]).join(),
	              title: [title, dimensionValue].join(' ').trim(),
	              shortTitle: dimensionValue || shortTitle
	            });
	          }

	          return _objectSpread$2(_objectSpread$2({}, fields), {}, {
	            key: key,
	            title: [title, dimensionValue].join(' ').trim(),
	            shortTitle: dimensionValue || shortTitle,
	            children: children
	          });
	        });
	      };

	      var otherColumns = [];

	      if (!pivot.length && normalizedPivotConfig.y.includes('measures')) {
	        otherColumns = (this.loadResponses[0].query.measures || []).map(function (key) {
	          return _objectSpread$2(_objectSpread$2({}, extractFields(key)), {}, {
	            dataIndex: key
	          });
	        });
	      } // Syntatic column to display the measure value


	      if (!normalizedPivotConfig.y.length && normalizedPivotConfig.x.includes('measures')) {
	        otherColumns.push({
	          key: 'value',
	          dataIndex: 'value',
	          title: 'Value',
	          shortTitle: 'Value',
	          type: 'string'
	        });
	      }

	      return normalizedPivotConfig.x.map(function (key) {
	        if (key === 'measures') {
	          return {
	            key: 'measures',
	            dataIndex: 'measures',
	            title: 'Measures',
	            shortTitle: 'Measures',
	            type: 'string'
	          };
	        }

	        return _objectSpread$2(_objectSpread$2({}, extractFields(key)), {}, {
	          dataIndex: key
	        });
	      }).concat(toColumns(schema)).concat(otherColumns);
	    }
	  }, {
	    key: "totalRow",
	    value: function totalRow(pivotConfig) {
	      return this.chartPivot(pivotConfig)[0];
	    }
	  }, {
	    key: "categories",
	    value: function categories(pivotConfig) {
	      // TODO
	      return this.chartPivot(pivotConfig);
	    }
	  }, {
	    key: "seriesNames",
	    value: function seriesNames(pivotConfig) {
	      var _this4 = this;

	      pivotConfig = this.normalizePivotConfig(pivotConfig);
	      var measures = pipe(pluck('annotation'), pluck('measures'), mergeAll)(this.loadResponses);
	      var seriesNames = unnest(this.loadResponses.map(function (_, index) {
	        return pipe(map(_this4.axisValues(pivotConfig.y, index)), unnest, uniq)(_this4.timeDimensionBackwardCompatibleData(index));
	      }));
	      var duplicateMeasures = new Set();

	      if (this.queryType === QUERY_TYPE.BLENDING_QUERY) {
	        var allMeasures = flatten(this.loadResponses.map(function (_ref30) {
	          var query = _ref30.query;
	          return query.measures;
	        }));
	        allMeasures.filter(function (e, i, a) {
	          return a.indexOf(e) !== i;
	        }).forEach(function (m) {
	          return duplicateMeasures.add(m);
	        });
	      }

	      return seriesNames.map(function (axisValues, i) {
	        var aliasedAxis = aliasSeries(axisValues, i, pivotConfig, duplicateMeasures);
	        return {
	          title: _this4.axisValuesString(pivotConfig.y.find(function (d) {
	            return d === 'measures';
	          }) ? dropLast(1, aliasedAxis).concat(measures[ResultSet.measureFromAxis(axisValues)].title) : aliasedAxis, ', '),
	          shortTitle: _this4.axisValuesString(pivotConfig.y.find(function (d) {
	            return d === 'measures';
	          }) ? dropLast(1, aliasedAxis).concat(measures[ResultSet.measureFromAxis(axisValues)].shortTitle) : aliasedAxis, ', '),
	          key: _this4.axisValuesString(aliasedAxis, ','),
	          yValues: axisValues
	        };
	      });
	    }
	  }, {
	    key: "query",
	    value: function query() {
	      if (this.queryType !== QUERY_TYPE.REGULAR_QUERY) {
	        throw new Error("Method is not supported for a '".concat(this.queryType, "' query type. Please use decompose"));
	      }

	      return this.loadResponses[0].query;
	    }
	  }, {
	    key: "pivotQuery",
	    value: function pivotQuery() {
	      return this.loadResponse.pivotQuery || null;
	    }
	  }, {
	    key: "rawData",
	    value: function rawData() {
	      if (this.queryType !== QUERY_TYPE.REGULAR_QUERY) {
	        throw new Error("Method is not supported for a '".concat(this.queryType, "' query type. Please use decompose"));
	      }

	      return this.loadResponses[0].data;
	    }
	  }, {
	    key: "annotation",
	    value: function annotation() {
	      if (this.queryType !== QUERY_TYPE.REGULAR_QUERY) {
	        throw new Error("Method is not supported for a '".concat(this.queryType, "' query type. Please use decompose"));
	      }

	      return this.loadResponses[0].annotation;
	    }
	  }, {
	    key: "timeDimensionBackwardCompatibleData",
	    value: function timeDimensionBackwardCompatibleData(resultIndex) {
	      if (resultIndex === undefined) {
	        throw new Error('resultIndex is required');
	      }

	      if (!this.backwardCompatibleData[resultIndex]) {
	        var _this$loadResponses$r = this.loadResponses[resultIndex],
	            data = _this$loadResponses$r.data,
	            query = _this$loadResponses$r.query;
	        var timeDimensions = (query.timeDimensions || []).filter(function (td) {
	          return Boolean(td.granularity);
	        });
	        this.backwardCompatibleData[resultIndex] = data.map(function (row) {
	          return _objectSpread$2(_objectSpread$2({}, row), fromPairs(Object.keys(row).filter(function (field) {
	            return timeDimensions.find(function (d) {
	              return d.dimension === field;
	            }) && !row[ResultSet.timeDimensionMember(timeDimensions.find(function (d) {
	              return d.dimension === field;
	            }))];
	          }).map(function (field) {
	            return [ResultSet.timeDimensionMember(timeDimensions.find(function (d) {
	              return d.dimension === field;
	            })), row[field]];
	          })));
	        });
	      }

	      return this.backwardCompatibleData[resultIndex];
	    }
	  }, {
	    key: "decompose",
	    value: function decompose() {
	      var _this5 = this;

	      return this.loadResponses.map(function (result) {
	        return new ResultSet({
	          queryType: QUERY_TYPE.REGULAR_QUERY,
	          pivotQuery: _objectSpread$2(_objectSpread$2({}, result.query), {}, {
	            queryType: QUERY_TYPE.REGULAR_QUERY
	          }),
	          results: [result]
	        }, _this5.options);
	      });
	    }
	  }, {
	    key: "serialize",
	    value: function serialize() {
	      return {
	        loadResponse: clone(this.loadResponse)
	      };
	    }
	  }], [{
	    key: "measureFromAxis",
	    value: function measureFromAxis(axisValues) {
	      return axisValues[axisValues.length - 1];
	    }
	  }, {
	    key: "timeDimensionMember",
	    value: function timeDimensionMember(td) {
	      return "".concat(td.dimension, ".").concat(td.granularity);
	    }
	  }, {
	    key: "deserialize",
	    value: function deserialize(data) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      return new ResultSet(data.loadResponse, options);
	    }
	  }, {
	    key: "getNormalizedPivotConfig",
	    value: function getNormalizedPivotConfig() {
	      var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      var pivotConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	      var defaultPivotConfig = {
	        x: [],
	        y: [],
	        fillMissingDates: true,
	        joinDateRange: false
	      };
	      var _query$measures = query.measures,
	          measures = _query$measures === void 0 ? [] : _query$measures,
	          _query$dimensions = query.dimensions,
	          dimensions = _query$dimensions === void 0 ? [] : _query$dimensions;
	      var timeDimensions = (query.timeDimensions || []).filter(function (td) {
	        return !!td.granularity;
	      });
	      pivotConfig = pivotConfig || (timeDimensions.length ? {
	        x: timeDimensions.map(function (td) {
	          return ResultSet.timeDimensionMember(td);
	        }),
	        y: dimensions
	      } : {
	        x: dimensions,
	        y: []
	      });
	      pivotConfig = mergeDeepLeft(pivotConfig, defaultPivotConfig);

	      var substituteTimeDimensionMembers = function substituteTimeDimensionMembers(axis) {
	        return axis.map(function (subDim) {
	          return timeDimensions.find(function (td) {
	            return td.dimension === subDim;
	          }) && !dimensions.find(function (d) {
	            return d === subDim;
	          }) ? ResultSet.timeDimensionMember(query.timeDimensions.find(function (td) {
	            return td.dimension === subDim;
	          })) : subDim;
	        });
	      };

	      pivotConfig.x = substituteTimeDimensionMembers(pivotConfig.x);
	      pivotConfig.y = substituteTimeDimensionMembers(pivotConfig.y);
	      var allIncludedDimensions = pivotConfig.x.concat(pivotConfig.y);
	      var allDimensions = timeDimensions.map(function (td) {
	        return ResultSet.timeDimensionMember(td);
	      }).concat(dimensions);

	      var dimensionFilter = function dimensionFilter(key) {
	        return allDimensions.includes(key) || key === 'measures';
	      };

	      pivotConfig.x = pivotConfig.x.concat(allDimensions.filter(function (d) {
	        return !allIncludedDimensions.includes(d) && d !== 'compareDateRange';
	      })).filter(dimensionFilter);
	      pivotConfig.y = pivotConfig.y.filter(dimensionFilter);

	      if (!pivotConfig.x.concat(pivotConfig.y).find(function (d) {
	        return d === 'measures';
	      })) {
	        pivotConfig.y.push('measures');
	      }

	      if (dimensions.includes('compareDateRange') && !pivotConfig.y.concat(pivotConfig.x).includes('compareDateRange')) {
	        pivotConfig.y.unshift('compareDateRange');
	      }

	      if (!measures.length) {
	        pivotConfig.x = pivotConfig.x.filter(function (d) {
	          return d !== 'measures';
	        });
	        pivotConfig.y = pivotConfig.y.filter(function (d) {
	          return d !== 'measures';
	        });
	      }

	      return pivotConfig;
	    }
	  }]);

	  return ResultSet;
	}();

	var SqlQuery = /*#__PURE__*/function () {
	  function SqlQuery(sqlQuery) {
	    _classCallCheck(this, SqlQuery);

	    this.sqlQuery = sqlQuery;
	  }

	  _createClass(SqlQuery, [{
	    key: "rawQuery",
	    value: function rawQuery() {
	      return this.sqlQuery.sql;
	    }
	  }, {
	    key: "sql",
	    value: function sql() {
	      return this.rawQuery().sql[0];
	    }
	  }]);

	  return SqlQuery;
	}();

	var memberMap = function memberMap(memberArray) {
	  return fromPairs(memberArray.map(function (m) {
	    return [m.name, m];
	  }));
	};

	var operators = {
	  string: [{
	    name: 'contains',
	    title: 'contains'
	  }, {
	    name: 'notContains',
	    title: 'does not contain'
	  }, {
	    name: 'equals',
	    title: 'equals'
	  }, {
	    name: 'notEquals',
	    title: 'does not equal'
	  }, {
	    name: 'set',
	    title: 'is set'
	  }, {
	    name: 'notSet',
	    title: 'is not set'
	  }, {
	    name: 'startsWith',
	    title: 'starts with'
	  }, {
	    name: 'notStartsWith',
	    title: 'does not start with'
	  }, {
	    name: 'endsWith',
	    title: 'ends with'
	  }, {
	    name: 'notEndsWith',
	    title: 'does not end with'
	  }],
	  number: [{
	    name: 'equals',
	    title: 'equals'
	  }, {
	    name: 'notEquals',
	    title: 'does not equal'
	  }, {
	    name: 'set',
	    title: 'is set'
	  }, {
	    name: 'notSet',
	    title: 'is not set'
	  }, {
	    name: 'gt',
	    title: '>'
	  }, {
	    name: 'gte',
	    title: '>='
	  }, {
	    name: 'lt',
	    title: '<'
	  }, {
	    name: 'lte',
	    title: '<='
	  }],
	  time: [{
	    name: 'equals',
	    title: 'equals'
	  }, {
	    name: 'notEquals',
	    title: 'does not equal'
	  }, {
	    name: 'inDateRange',
	    title: 'in date range'
	  }, {
	    name: 'notInDateRange',
	    title: 'not in date range'
	  }, {
	    name: 'afterDate',
	    title: 'after date'
	  }, {
	    name: 'afterOrOnDate',
	    title: 'after or on date'
	  }, {
	    name: 'beforeDate',
	    title: 'before date'
	  }, {
	    name: 'beforeOrOnDate',
	    title: 'before or on date'
	  }]
	};
	/**
	 * Contains information about available cubes and it's members.
	 */

	var Meta = /*#__PURE__*/function () {
	  function Meta(metaResponse) {
	    _classCallCheck(this, Meta);

	    this.meta = metaResponse;
	    var cubes = this.meta.cubes;
	    this.cubes = cubes;
	    this.cubesMap = fromPairs(cubes.map(function (c) {
	      return [c.name, {
	        measures: memberMap(c.measures),
	        dimensions: memberMap(c.dimensions),
	        segments: memberMap(c.segments)
	      }];
	    }));
	  }

	  _createClass(Meta, [{
	    key: "membersForQuery",
	    value: function membersForQuery(query, memberType) {
	      return unnest$1(this.cubes.map(function (c) {
	        return c[memberType];
	      })).sort(function (a, b) {
	        return a.title > b.title ? 1 : -1;
	      });
	    }
	  }, {
	    key: "membersGroupedByCube",
	    value: function membersGroupedByCube() {
	      var memberKeys = ['measures', 'dimensions', 'segments', 'timeDimensions'];
	      return this.cubes.reduce(function (memo, cube) {
	        memberKeys.forEach(function (key) {
	          var members = cube[key];

	          if (key === 'timeDimensions') {
	            members = cube.dimensions.filter(function (m) {
	              return m.type === 'time';
	            });
	          }

	          memo[key] = [].concat(_toConsumableArray(memo[key]), [{
	            cubeName: cube.name,
	            cubeTitle: cube.title,
	            type: cube.type,
	            "public": cube["public"],
	            members: members
	          }]);
	        });
	        return memo;
	      }, {
	        measures: [],
	        dimensions: [],
	        segments: [],
	        timeDimensions: []
	      });
	    }
	  }, {
	    key: "resolveMember",
	    value: function resolveMember(memberName, memberType) {
	      var _this = this;

	      var _memberName$split = memberName.split('.'),
	          _memberName$split2 = _slicedToArray(_memberName$split, 1),
	          cube = _memberName$split2[0];

	      if (!this.cubesMap[cube]) {
	        return {
	          title: memberName,
	          error: "Cube not found ".concat(cube, " for path '").concat(memberName, "'")
	        };
	      }

	      var memberTypes = Array.isArray(memberType) ? memberType : [memberType];
	      var member = memberTypes.map(function (type) {
	        return _this.cubesMap[cube][type] && _this.cubesMap[cube][type][memberName];
	      }).find(function (m) {
	        return m;
	      });

	      if (!member) {
	        return {
	          title: memberName,
	          error: "Path not found '".concat(memberName, "'")
	        };
	      }

	      return member;
	    }
	  }, {
	    key: "defaultTimeDimensionNameFor",
	    value: function defaultTimeDimensionNameFor(memberName) {
	      var _this2 = this;

	      var _memberName$split3 = memberName.split('.'),
	          _memberName$split4 = _slicedToArray(_memberName$split3, 1),
	          cube = _memberName$split4[0];

	      if (!this.cubesMap[cube]) {
	        return null;
	      }

	      return Object.keys(this.cubesMap[cube].dimensions || {}).find(function (d) {
	        return _this2.cubesMap[cube].dimensions[d].type === 'time';
	      });
	    }
	  }, {
	    key: "filterOperatorsForMember",
	    value: function filterOperatorsForMember(memberName, memberType) {
	      var member = this.resolveMember(memberName, memberType);
	      return operators[member.type] || operators.string;
	    }
	  }]);

	  return Meta;
	}();

	var ProgressResult = /*#__PURE__*/function () {
	  function ProgressResult(progressResponse) {
	    _classCallCheck(this, ProgressResult);

	    this.progressResponse = progressResponse;
	  }

	  _createClass(ProgressResult, [{
	    key: "stage",
	    value: function stage() {
	      return this.progressResponse.stage;
	    }
	  }, {
	    key: "timeElapsed",
	    value: function timeElapsed() {
	      return this.progressResponse.timeElapsed;
	    }
	  }]);

	  return ProgressResult;
	}();

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var nativeUrl = !fails(function () {
	  var url = new URL('b?a=1&b=2&c=3', 'http://a');
	  var searchParams = url.searchParams;
	  var result = '';
	  url.pathname = 'c%20d';
	  searchParams.forEach(function (value, key) {
	    searchParams['delete']('b');
	    result += key + value;
	  });
	  return (isPure && !url.toJSON)
	    || !searchParams.sort
	    || url.href !== 'http://a/c%20d?a=1&c=3'
	    || searchParams.get('c') !== '3'
	    || String(new URLSearchParams('?a=1')) !== 'a=1'
	    || !searchParams[ITERATOR$1]
	    // throws in Edge
	    || new URL('https://a@b').username !== 'a'
	    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
	    // not punycoded in Edge
	    || new URL('http://тест').host !== 'xn--e1aybc'
	    // not escaped in Chrome 62-
	    || new URL('http://a#б').hash !== '#%D0%B1'
	    // fails in Chrome 66-
	    || result !== 'a1c3'
	    // throws in Safari
	    || new URL('http://x', undefined).host !== 'x';
	});

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`



























	var ITERATOR = wellKnownSymbol('iterator');
	var URL_SEARCH_PARAMS = 'URLSearchParams';
	var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
	var setInternalState = internalState.set;
	var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
	var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

	var n$Fetch = getBuiltIn('fetch');
	var N$Request = getBuiltIn('Request');
	var Headers = getBuiltIn('Headers');
	var RequestPrototype = N$Request && N$Request.prototype;
	var HeadersPrototype = Headers && Headers.prototype;
	var RegExp$1 = global$1.RegExp;
	var TypeError$1 = global$1.TypeError;
	var decodeURIComponent$1 = global$1.decodeURIComponent;
	var encodeURIComponent$1 = global$1.encodeURIComponent;
	var charAt = functionUncurryThis(''.charAt);
	var join$1 = functionUncurryThis([].join);
	var push$1 = functionUncurryThis([].push);
	var replace = functionUncurryThis(''.replace);
	var shift = functionUncurryThis([].shift);
	var splice = functionUncurryThis([].splice);
	var split = functionUncurryThis(''.split);
	var stringSlice = functionUncurryThis(''.slice);

	var plus = /\+/g;
	var sequences = Array(4);

	var percentSequence = function (bytes) {
	  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp$1('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
	};

	var percentDecode = function (sequence) {
	  try {
	    return decodeURIComponent$1(sequence);
	  } catch (error) {
	    return sequence;
	  }
	};

	var deserialize = function (it) {
	  var result = replace(it, plus, ' ');
	  var bytes = 4;
	  try {
	    return decodeURIComponent$1(result);
	  } catch (error) {
	    while (bytes) {
	      result = replace(result, percentSequence(bytes--), percentDecode);
	    }
	    return result;
	  }
	};

	var find = /[!'()~]|%20/g;

	var replacements = {
	  '!': '%21',
	  "'": '%27',
	  '(': '%28',
	  ')': '%29',
	  '~': '%7E',
	  '%20': '+'
	};

	var replacer = function (match) {
	  return replacements[match];
	};

	var serialize = function (it) {
	  return replace(encodeURIComponent$1(it), find, replacer);
	};

	var validateArgumentsLength = function (passed, required) {
	  if (passed < required) throw TypeError$1('Not enough arguments');
	};

	var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
	  setInternalState(this, {
	    type: URL_SEARCH_PARAMS_ITERATOR,
	    iterator: getIterator(getInternalParamsState(params).entries),
	    kind: kind
	  });
	}, 'Iterator', function next() {
	  var state = getInternalIteratorState(this);
	  var kind = state.kind;
	  var step = state.iterator.next();
	  var entry = step.value;
	  if (!step.done) {
	    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
	  } return step;
	}, true);

	var URLSearchParamsState = function (init) {
	  this.entries = [];
	  this.url = null;

	  if (init !== undefined) {
	    if (isObject(init)) this.parseObject(init);
	    else this.parseQuery(typeof init == 'string' ? charAt(init, 0) === '?' ? stringSlice(init, 1) : init : toString$1(init));
	  }
	};

	URLSearchParamsState.prototype = {
	  type: URL_SEARCH_PARAMS,
	  bindURL: function (url) {
	    this.url = url;
	    this.update();
	  },
	  parseObject: function (object) {
	    var iteratorMethod = getIteratorMethod(object);
	    var iterator, next, step, entryIterator, entryNext, first, second;

	    if (iteratorMethod) {
	      iterator = getIterator(object, iteratorMethod);
	      next = iterator.next;
	      while (!(step = functionCall(next, iterator)).done) {
	        entryIterator = getIterator(anObject(step.value));
	        entryNext = entryIterator.next;
	        if (
	          (first = functionCall(entryNext, entryIterator)).done ||
	          (second = functionCall(entryNext, entryIterator)).done ||
	          !functionCall(entryNext, entryIterator).done
	        ) throw TypeError$1('Expected sequence with length 2');
	        push$1(this.entries, { key: toString$1(first.value), value: toString$1(second.value) });
	      }
	    } else for (var key in object) if (hasOwnProperty_1(object, key)) {
	      push$1(this.entries, { key: key, value: toString$1(object[key]) });
	    }
	  },
	  parseQuery: function (query) {
	    if (query) {
	      var attributes = split(query, '&');
	      var index = 0;
	      var attribute, entry;
	      while (index < attributes.length) {
	        attribute = attributes[index++];
	        if (attribute.length) {
	          entry = split(attribute, '=');
	          push$1(this.entries, {
	            key: deserialize(shift(entry)),
	            value: deserialize(join$1(entry, '='))
	          });
	        }
	      }
	    }
	  },
	  serialize: function () {
	    var entries = this.entries;
	    var result = [];
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      push$1(result, serialize(entry.key) + '=' + serialize(entry.value));
	    } return join$1(result, '&');
	  },
	  update: function () {
	    this.entries.length = 0;
	    this.parseQuery(this.url.query);
	  },
	  updateURL: function () {
	    if (this.url) this.url.update();
	  }
	};

	// `URLSearchParams` constructor
	// https://url.spec.whatwg.org/#interface-urlsearchparams
	var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
	  anInstance(this, URLSearchParamsPrototype);
	  var init = arguments.length > 0 ? arguments[0] : undefined;
	  setInternalState(this, new URLSearchParamsState(init));
	};

	var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

	redefineAll(URLSearchParamsPrototype, {
	  // `URLSearchParams.prototype.append` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
	  append: function append(name, value) {
	    validateArgumentsLength(arguments.length, 2);
	    var state = getInternalParamsState(this);
	    push$1(state.entries, { key: toString$1(name), value: toString$1(value) });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.delete` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
	  'delete': function (name) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var key = toString$1(name);
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index].key === key) splice(entries, index, 1);
	      else index++;
	    }
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.get` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
	  get: function get(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = toString$1(name);
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) return entries[index].value;
	    }
	    return null;
	  },
	  // `URLSearchParams.prototype.getAll` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
	  getAll: function getAll(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = toString$1(name);
	    var result = [];
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) push$1(result, entries[index].value);
	    }
	    return result;
	  },
	  // `URLSearchParams.prototype.has` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
	  has: function has(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = toString$1(name);
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index++].key === key) return true;
	    }
	    return false;
	  },
	  // `URLSearchParams.prototype.set` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
	  set: function set(name, value) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var found = false;
	    var key = toString$1(name);
	    var val = toString$1(value);
	    var index = 0;
	    var entry;
	    for (; index < entries.length; index++) {
	      entry = entries[index];
	      if (entry.key === key) {
	        if (found) splice(entries, index--, 1);
	        else {
	          found = true;
	          entry.value = val;
	        }
	      }
	    }
	    if (!found) push$1(entries, { key: key, value: val });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.sort` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
	  sort: function sort() {
	    var state = getInternalParamsState(this);
	    arraySort(state.entries, function (a, b) {
	      return a.key > b.key ? 1 : -1;
	    });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.forEach` method
	  forEach: function forEach(callback /* , thisArg */) {
	    var entries = getInternalParamsState(this).entries;
	    var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined);
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      boundFunction(entry.value, entry.key, this);
	    }
	  },
	  // `URLSearchParams.prototype.keys` method
	  keys: function keys() {
	    return new URLSearchParamsIterator(this, 'keys');
	  },
	  // `URLSearchParams.prototype.values` method
	  values: function values() {
	    return new URLSearchParamsIterator(this, 'values');
	  },
	  // `URLSearchParams.prototype.entries` method
	  entries: function entries() {
	    return new URLSearchParamsIterator(this, 'entries');
	  }
	}, { enumerable: true });

	// `URLSearchParams.prototype[@@iterator]` method
	redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

	// `URLSearchParams.prototype.toString` method
	// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
	redefine(URLSearchParamsPrototype, 'toString', function toString() {
	  return getInternalParamsState(this).serialize();
	}, { enumerable: true });

	setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

	_export({ global: true, forced: !nativeUrl }, {
	  URLSearchParams: URLSearchParamsConstructor
	});

	// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
	if (!nativeUrl && isCallable(Headers)) {
	  var headersHas = functionUncurryThis(HeadersPrototype.has);
	  var headersSet = functionUncurryThis(HeadersPrototype.set);

	  var wrapRequestOptions = function (init) {
	    if (isObject(init)) {
	      var body = init.body;
	      var headers;
	      if (classof(body) === URL_SEARCH_PARAMS) {
	        headers = init.headers ? new Headers(init.headers) : new Headers();
	        if (!headersHas(headers, 'content-type')) {
	          headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	        return objectCreate(init, {
	          body: createPropertyDescriptor(0, toString$1(body)),
	          headers: createPropertyDescriptor(0, headers)
	        });
	      }
	    } return init;
	  };

	  if (isCallable(n$Fetch)) {
	    _export({ global: true, enumerable: true, forced: true }, {
	      fetch: function fetch(input /* , init */) {
	        return n$Fetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
	      }
	    });
	  }

	  if (isCallable(N$Request)) {
	    var RequestConstructor = function Request(input /* , init */) {
	      anInstance(this, RequestPrototype);
	      return new N$Request(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
	    };

	    RequestPrototype.constructor = RequestConstructor;
	    RequestConstructor.prototype = RequestPrototype;

	    _export({ global: true, forced: true }, {
	      Request: RequestConstructor
	    });
	  }
	}

	var browserPonyfill = createCommonjsModule(function (module, exports) {
	var global = typeof self !== 'undefined' ? self : commonjsGlobal;
	var __self__ = (function () {
	function F() {
	this.fetch = false;
	this.DOMException = global.DOMException;
	}
	F.prototype = global;
	return new F();
	})();
	(function(self) {

	((function (exports) {

	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob:
	      'FileReader' in self &&
	      'Blob' in self &&
	      (function() {
	        try {
	          new Blob();
	          return true
	        } catch (e) {
	          return false
	        }
	      })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  };

	  function isDataView(obj) {
	    return obj && DataView.prototype.isPrototypeOf(obj)
	  }

	  if (support.arrayBuffer) {
	    var viewClasses = [
	      '[object Int8Array]',
	      '[object Uint8Array]',
	      '[object Uint8ClampedArray]',
	      '[object Int16Array]',
	      '[object Uint16Array]',
	      '[object Int32Array]',
	      '[object Uint32Array]',
	      '[object Float32Array]',
	      '[object Float64Array]'
	    ];

	    var isArrayBufferView =
	      ArrayBuffer.isView ||
	      function(obj) {
	        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	      };
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name);
	    }
	    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value);
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift();
	        return {done: value === undefined, value: value}
	      }
	    };

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      };
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {};

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value);
	      }, this);
	    } else if (Array.isArray(headers)) {
	      headers.forEach(function(header) {
	        this.append(header[0], header[1]);
	      }, this);
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name]);
	      }, this);
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name);
	    value = normalizeValue(value);
	    var oldValue = this.map[name];
	    this.map[name] = oldValue ? oldValue + ', ' + value : value;
	  };

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)];
	  };

	  Headers.prototype.get = function(name) {
	    name = normalizeName(name);
	    return this.has(name) ? this.map[name] : null
	  };

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  };

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value);
	  };

	  Headers.prototype.forEach = function(callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this);
	      }
	    }
	  };

	  Headers.prototype.keys = function() {
	    var items = [];
	    this.forEach(function(value, name) {
	      items.push(name);
	    });
	    return iteratorFor(items)
	  };

	  Headers.prototype.values = function() {
	    var items = [];
	    this.forEach(function(value) {
	      items.push(value);
	    });
	    return iteratorFor(items)
	  };

	  Headers.prototype.entries = function() {
	    var items = [];
	    this.forEach(function(value, name) {
	      items.push([name, value]);
	    });
	    return iteratorFor(items)
	  };

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true;
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result);
	      };
	      reader.onerror = function() {
	        reject(reader.error);
	      };
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader();
	    var promise = fileReaderReady(reader);
	    reader.readAsArrayBuffer(blob);
	    return promise
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader();
	    var promise = fileReaderReady(reader);
	    reader.readAsText(blob);
	    return promise
	  }

	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf);
	    var chars = new Array(view.length);

	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i]);
	    }
	    return chars.join('')
	  }

	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength);
	      view.set(new Uint8Array(buf));
	      return view.buffer
	    }
	  }

	  function Body() {
	    this.bodyUsed = false;

	    this._initBody = function(body) {
	      this._bodyInit = body;
	      if (!body) {
	        this._bodyText = '';
	      } else if (typeof body === 'string') {
	        this._bodyText = body;
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body;
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body;
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString();
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer);
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer]);
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body);
	      } else {
	        this._bodyText = body = Object.prototype.toString.call(body);
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8');
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type);
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	      }
	    };

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this);
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      };

	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      };
	    }

	    this.text = function() {
	      var rejected = consumed(this);
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    };

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      };
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    };

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase();
	    return methods.indexOf(upcased) > -1 ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {};
	    var body = options.body;

	    if (input instanceof Request) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url;
	      this.credentials = input.credentials;
	      if (!options.headers) {
	        this.headers = new Headers(input.headers);
	      }
	      this.method = input.method;
	      this.mode = input.mode;
	      this.signal = input.signal;
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit;
	        input.bodyUsed = true;
	      }
	    } else {
	      this.url = String(input);
	    }

	    this.credentials = options.credentials || this.credentials || 'same-origin';
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers);
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET');
	    this.mode = options.mode || this.mode || null;
	    this.signal = options.signal || this.signal;
	    this.referrer = null;

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body);
	  }

	  Request.prototype.clone = function() {
	    return new Request(this, {body: this._bodyInit})
	  };

	  function decode(body) {
	    var form = new FormData();
	    body
	      .trim()
	      .split('&')
	      .forEach(function(bytes) {
	        if (bytes) {
	          var split = bytes.split('=');
	          var name = split.shift().replace(/\+/g, ' ');
	          var value = split.join('=').replace(/\+/g, ' ');
	          form.append(decodeURIComponent(name), decodeURIComponent(value));
	        }
	      });
	    return form
	  }

	  function parseHeaders(rawHeaders) {
	    var headers = new Headers();
	    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	    // https://tools.ietf.org/html/rfc7230#section-3.2
	    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
	    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
	      var parts = line.split(':');
	      var key = parts.shift().trim();
	      if (key) {
	        var value = parts.join(':').trim();
	        headers.append(key, value);
	      }
	    });
	    return headers
	  }

	  Body.call(Request.prototype);

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {};
	    }

	    this.type = 'default';
	    this.status = options.status === undefined ? 200 : options.status;
	    this.ok = this.status >= 200 && this.status < 300;
	    this.statusText = 'statusText' in options ? options.statusText : 'OK';
	    this.headers = new Headers(options.headers);
	    this.url = options.url || '';
	    this._initBody(bodyInit);
	  }

	  Body.call(Response.prototype);

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  };

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''});
	    response.type = 'error';
	    return response
	  };

	  var redirectStatuses = [301, 302, 303, 307, 308];

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  };

	  exports.DOMException = self.DOMException;
	  try {
	    new exports.DOMException();
	  } catch (err) {
	    exports.DOMException = function(message, name) {
	      this.message = message;
	      this.name = name;
	      var error = Error(message);
	      this.stack = error.stack;
	    };
	    exports.DOMException.prototype = Object.create(Error.prototype);
	    exports.DOMException.prototype.constructor = exports.DOMException;
	  }

	  function fetch(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init);

	      if (request.signal && request.signal.aborted) {
	        return reject(new exports.DOMException('Aborted', 'AbortError'))
	      }

	      var xhr = new XMLHttpRequest();

	      function abortXhr() {
	        xhr.abort();
	      }

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        };
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options));
	      };

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'));
	      };

	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'));
	      };

	      xhr.onabort = function() {
	        reject(new exports.DOMException('Aborted', 'AbortError'));
	      };

	      xhr.open(request.method, request.url, true);

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true;
	      } else if (request.credentials === 'omit') {
	        xhr.withCredentials = false;
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob';
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value);
	      });

	      if (request.signal) {
	        request.signal.addEventListener('abort', abortXhr);

	        xhr.onreadystatechange = function() {
	          // DONE (success or failure)
	          if (xhr.readyState === 4) {
	            request.signal.removeEventListener('abort', abortXhr);
	          }
	        };
	      }

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	    })
	  }

	  fetch.polyfill = true;

	  if (!self.fetch) {
	    self.fetch = fetch;
	    self.Headers = Headers;
	    self.Request = Request;
	    self.Response = Response;
	  }

	  exports.Headers = Headers;
	  exports.Request = Request;
	  exports.Response = Response;
	  exports.fetch = fetch;

	  Object.defineProperty(exports, '__esModule', { value: true });

	  return exports;

	}))({});
	})(__self__);
	__self__.fetch.ponyfill = true;
	// Remove "polyfill" property added by whatwg-fetch
	delete __self__.fetch.polyfill;
	// Choose between native implementation (global) or custom implementation (__self__)
	// var ctx = global.fetch ? global : __self__;
	var ctx = __self__; // this line disable service worker support temporarily
	exports = ctx.fetch; // To enable: import fetch from 'cross-fetch'
	exports.default = ctx.fetch; // For TypeScript consumers without esModuleInterop.
	exports.fetch = ctx.fetch; // To enable: import {fetch} from 'cross-fetch'
	exports.Headers = ctx.Headers;
	exports.Request = ctx.Request;
	exports.Response = ctx.Response;
	module.exports = exports;
	});

	var fetch = /*@__PURE__*/getDefaultExportFromCjs(browserPonyfill);

	/**
	 *
	 *
	 * @author Jerry Bendy <jerry@icewingcc.com>
	 * @licence MIT
	 *
	 */

	(function(self) {

	    var nativeURLSearchParams = (self.URLSearchParams && self.URLSearchParams.prototype.get) ? self.URLSearchParams : null,
	        isSupportObjectConstructor = nativeURLSearchParams && (new nativeURLSearchParams({a: 1})).toString() === 'a=1',
	        // There is a bug in safari 10.1 (and earlier) that incorrectly decodes `%2B` as an empty space and not a plus.
	        decodesPlusesCorrectly = nativeURLSearchParams && (new nativeURLSearchParams('s=%2B').get('s') === '+'),
	        __URLSearchParams__ = "__URLSearchParams__",
	        // Fix bug in Edge which cannot encode ' &' correctly
	        encodesAmpersandsCorrectly = nativeURLSearchParams ? (function() {
	            var ampersandTest = new nativeURLSearchParams();
	            ampersandTest.append('s', ' &');
	            return ampersandTest.toString() === 's=+%26';
	        })() : true,
	        prototype = URLSearchParamsPolyfill.prototype,
	        iterable = !!(self.Symbol && self.Symbol.iterator);

	    if (nativeURLSearchParams && isSupportObjectConstructor && decodesPlusesCorrectly && encodesAmpersandsCorrectly) {
	        return;
	    }


	    /**
	     * Make a URLSearchParams instance
	     *
	     * @param {object|string|URLSearchParams} search
	     * @constructor
	     */
	    function URLSearchParamsPolyfill(search) {
	        search = search || "";

	        // support construct object with another URLSearchParams instance
	        if (search instanceof URLSearchParams || search instanceof URLSearchParamsPolyfill) {
	            search = search.toString();
	        }
	        this [__URLSearchParams__] = parseToDict(search);
	    }


	    /**
	     * Appends a specified key/value pair as a new search parameter.
	     *
	     * @param {string} name
	     * @param {string} value
	     */
	    prototype.append = function(name, value) {
	        appendTo(this [__URLSearchParams__], name, value);
	    };

	    /**
	     * Deletes the given search parameter, and its associated value,
	     * from the list of all search parameters.
	     *
	     * @param {string} name
	     */
	    prototype['delete'] = function(name) {
	        delete this [__URLSearchParams__] [name];
	    };

	    /**
	     * Returns the first value associated to the given search parameter.
	     *
	     * @param {string} name
	     * @returns {string|null}
	     */
	    prototype.get = function(name) {
	        var dict = this [__URLSearchParams__];
	        return name in dict ? dict[name][0] : null;
	    };

	    /**
	     * Returns all the values association with a given search parameter.
	     *
	     * @param {string} name
	     * @returns {Array}
	     */
	    prototype.getAll = function(name) {
	        var dict = this [__URLSearchParams__];
	        return name in dict ? dict [name].slice(0) : [];
	    };

	    /**
	     * Returns a Boolean indicating if such a search parameter exists.
	     *
	     * @param {string} name
	     * @returns {boolean}
	     */
	    prototype.has = function(name) {
	        return name in this [__URLSearchParams__];
	    };

	    /**
	     * Sets the value associated to a given search parameter to
	     * the given value. If there were several values, delete the
	     * others.
	     *
	     * @param {string} name
	     * @param {string} value
	     */
	    prototype.set = function set(name, value) {
	        this [__URLSearchParams__][name] = ['' + value];
	    };

	    /**
	     * Returns a string containg a query string suitable for use in a URL.
	     *
	     * @returns {string}
	     */
	    prototype.toString = function() {
	        var dict = this[__URLSearchParams__], query = [], i, key, name, value;
	        for (key in dict) {
	            name = encode(key);
	            for (i = 0, value = dict[key]; i < value.length; i++) {
	                query.push(name + '=' + encode(value[i]));
	            }
	        }
	        return query.join('&');
	    };

	    // There is a bug in Safari 10.1 and `Proxy`ing it is not enough.
	    var forSureUsePolyfill = !decodesPlusesCorrectly;
	    var useProxy = (!forSureUsePolyfill && nativeURLSearchParams && !isSupportObjectConstructor && self.Proxy);
	    /*
	     * Apply polifill to global object and append other prototype into it
	     */
	    Object.defineProperty(self, 'URLSearchParams', {
	        value: (useProxy ?
	            // Safari 10.0 doesn't support Proxy, so it won't extend URLSearchParams on safari 10.0
	            new Proxy(nativeURLSearchParams, {
	                construct: function(target, args) {
	                    return new target((new URLSearchParamsPolyfill(args[0]).toString()));
	                }
	            }) :
	            URLSearchParamsPolyfill)
	    });

	    var USPProto = self.URLSearchParams.prototype;

	    USPProto.polyfill = true;

	    /**
	     *
	     * @param {function} callback
	     * @param {object} thisArg
	     */
	    USPProto.forEach = USPProto.forEach || function(callback, thisArg) {
	        var dict = parseToDict(this.toString());
	        Object.getOwnPropertyNames(dict).forEach(function(name) {
	            dict[name].forEach(function(value) {
	                callback.call(thisArg, value, name, this);
	            }, this);
	        }, this);
	    };

	    /**
	     * Sort all name-value pairs
	     */
	    USPProto.sort = USPProto.sort || function() {
	        var dict = parseToDict(this.toString()), keys = [], k, i, j;
	        for (k in dict) {
	            keys.push(k);
	        }
	        keys.sort();

	        for (i = 0; i < keys.length; i++) {
	            this['delete'](keys[i]);
	        }
	        for (i = 0; i < keys.length; i++) {
	            var key = keys[i], values = dict[key];
	            for (j = 0; j < values.length; j++) {
	                this.append(key, values[j]);
	            }
	        }
	    };

	    /**
	     * Returns an iterator allowing to go through all keys of
	     * the key/value pairs contained in this object.
	     *
	     * @returns {function}
	     */
	    USPProto.keys = USPProto.keys || function() {
	        var items = [];
	        this.forEach(function(item, name) {
	            items.push(name);
	        });
	        return makeIterator(items);
	    };

	    /**
	     * Returns an iterator allowing to go through all values of
	     * the key/value pairs contained in this object.
	     *
	     * @returns {function}
	     */
	    USPProto.values = USPProto.values || function() {
	        var items = [];
	        this.forEach(function(item) {
	            items.push(item);
	        });
	        return makeIterator(items);
	    };

	    /**
	     * Returns an iterator allowing to go through all key/value
	     * pairs contained in this object.
	     *
	     * @returns {function}
	     */
	    USPProto.entries = USPProto.entries || function() {
	        var items = [];
	        this.forEach(function(item, name) {
	            items.push([name, item]);
	        });
	        return makeIterator(items);
	    };


	    if (iterable) {
	        USPProto[self.Symbol.iterator] = USPProto[self.Symbol.iterator] || USPProto.entries;
	    }


	    function encode(str) {
	        var replace = {
	            '!': '%21',
	            "'": '%27',
	            '(': '%28',
	            ')': '%29',
	            '~': '%7E',
	            '%20': '+',
	            '%00': '\x00'
	        };
	        return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function(match) {
	            return replace[match];
	        });
	    }

	    function decode(str) {
	        return str
	            .replace(/[ +]/g, '%20')
	            .replace(/(%[a-f0-9]{2})+/ig, function(match) {
	                return decodeURIComponent(match);
	            });
	    }

	    function makeIterator(arr) {
	        var iterator = {
	            next: function() {
	                var value = arr.shift();
	                return {done: value === undefined, value: value};
	            }
	        };

	        if (iterable) {
	            iterator[self.Symbol.iterator] = function() {
	                return iterator;
	            };
	        }

	        return iterator;
	    }

	    function parseToDict(search) {
	        var dict = {};

	        if (typeof search === "object") {
	            // if `search` is an array, treat it as a sequence
	            if (isArray(search)) {
	                for (var i = 0; i < search.length; i++) {
	                    var item = search[i];
	                    if (isArray(item) && item.length === 2) {
	                        appendTo(dict, item[0], item[1]);
	                    } else {
	                        throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
	                    }
	                }

	            } else {
	                for (var key in search) {
	                    if (search.hasOwnProperty(key)) {
	                        appendTo(dict, key, search[key]);
	                    }
	                }
	            }

	        } else {
	            // remove first '?'
	            if (search.indexOf("?") === 0) {
	                search = search.slice(1);
	            }

	            var pairs = search.split("&");
	            for (var j = 0; j < pairs.length; j++) {
	                var value = pairs [j],
	                    index = value.indexOf('=');

	                if (-1 < index) {
	                    appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index + 1)));

	                } else {
	                    if (value) {
	                        appendTo(dict, decode(value), '');
	                    }
	                }
	            }
	        }

	        return dict;
	    }

	    function appendTo(dict, name, value) {
	        var val = typeof value === 'string' ? value : (
	            value !== null && value !== undefined && typeof value.toString === 'function' ? value.toString() : JSON.stringify(value)
	        );

	        if (name in dict) {
	            dict[name].push(val);
	        } else {
	            dict[name] = [val];
	        }
	    }

	    function isArray(val) {
	        return !!val && '[object Array]' === Object.prototype.toString.call(val);
	    }

	})(typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : (typeof window !== 'undefined' ? window : commonjsGlobal));

	var _excluded = ["baseRequestId"];

	function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

	var HttpTransport = /*#__PURE__*/function () {
	  function HttpTransport(_ref) {
	    var authorization = _ref.authorization,
	        apiUrl = _ref.apiUrl,
	        method = _ref.method,
	        _ref$headers = _ref.headers,
	        headers = _ref$headers === void 0 ? {} : _ref$headers,
	        credentials = _ref.credentials;

	    _classCallCheck(this, HttpTransport);

	    this.authorization = authorization;
	    this.apiUrl = apiUrl;
	    this.method = method;
	    this.headers = headers;
	    this.credentials = credentials;
	  }

	  _createClass(HttpTransport, [{
	    key: "request",
	    value: function request(method, _ref2) {
	      var _this = this;

	      var baseRequestId = _ref2.baseRequestId,
	          params = _objectWithoutProperties(_ref2, _excluded);

	      var spanCounter = 1;
	      var searchParams = new URLSearchParams(params && Object.keys(params).map(function (k) {
	        return _defineProperty({}, k, _typeof(params[k]) === 'object' ? JSON.stringify(params[k]) : params[k]);
	      }).reduce(function (a, b) {
	        return _objectSpread$1(_objectSpread$1({}, a), b);
	      }, {}));
	      var url = "".concat(this.apiUrl, "/").concat(method).concat(searchParams.toString().length ? "?".concat(searchParams) : '');
	      var requestMethod = this.method || (url.length < 2000 ? 'GET' : 'POST');

	      if (requestMethod === 'POST') {
	        url = "".concat(this.apiUrl, "/").concat(method);
	        this.headers['Content-Type'] = 'application/json';
	      } // Currently, all methods make GET requests. If a method makes a request with a body payload,
	      // remember to add {'Content-Type': 'application/json'} to the header.


	      var runRequest = function runRequest() {
	        return fetch(url, {
	          method: requestMethod,
	          headers: _objectSpread$1({
	            Authorization: _this.authorization,
	            'x-request-id': baseRequestId && "".concat(baseRequestId, "-span-").concat(spanCounter++)
	          }, _this.headers),
	          credentials: _this.credentials,
	          body: requestMethod === 'POST' ? JSON.stringify(params) : null
	        });
	      };

	      return {
	        /* eslint no-unsafe-finally: off */
	        subscribe: function subscribe(callback) {
	          var _this2 = this;

	          return _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
	            var result;
	            return regenerator.wrap(function _callee$(_context) {
	              while (1) {
	                switch (_context.prev = _context.next) {
	                  case 0:
	                    result = {
	                      error: 'network Error' // add default error message

	                    };
	                    _context.prev = 1;
	                    _context.next = 4;
	                    return runRequest();

	                  case 4:
	                    result = _context.sent;

	                  case 5:
	                    _context.prev = 5;
	                    return _context.abrupt("return", callback(result, function () {
	                      return _this2.subscribe(callback);
	                    }));

	                  case 8:
	                  case "end":
	                    return _context.stop();
	                }
	              }
	            }, _callee, null, [[1,, 5, 8]]);
	          }))();
	        }
	      };
	    }
	  }]);

	  return HttpTransport;
	}();

	var Function$1 = global$1.Function;
	var concat = functionUncurryThis([].concat);
	var join = functionUncurryThis([].join);
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!hasOwnProperty_1(factories, argsLength)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    factories[argsLength] = Function$1('C,a', 'return new C(' + join(list, ',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.es/ecma262/#sec-function.prototype.bind
	var functionBind = Function$1.bind || function bind(that /* , ...args */) {
	  var F = aCallable(this);
	  var Prototype = F.prototype;
	  var partArgs = arraySlice$1(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = concat(partArgs, arraySlice$1(arguments));
	    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
	  };
	  if (isObject(Prototype)) boundFunction.prototype = Prototype;
	  return boundFunction;
	};

	var nativeConstruct = getBuiltIn('Reflect', 'construct');
	var ObjectPrototype = Object.prototype;
	var push = [].push;

	// `Reflect.construct` method
	// https://tc39.es/ecma262/#sec-reflect.construct
	// MS Edge supports only 2 arguments and argumentsList argument is optional
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	var NEW_TARGET_BUG = fails(function () {
	  function F() { /* empty */ }
	  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
	});

	var ARGS_BUG = !fails(function () {
	  nativeConstruct(function () { /* empty */ });
	});

	var FORCED = NEW_TARGET_BUG || ARGS_BUG;

	_export({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
	  construct: function construct(Target, args /* , newTarget */) {
	    aConstructor(Target);
	    anObject(args);
	    var newTarget = arguments.length < 3 ? Target : aConstructor(arguments[2]);
	    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
	    if (Target == newTarget) {
	      // w/o altered newTarget, optimization for 0-4 arguments
	      switch (args.length) {
	        case 0: return new Target();
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      functionApply(push, $args, args);
	      return new (functionApply(functionBind, Target, $args))();
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto = newTarget.prototype;
	    var instance = objectCreate(isObject(proto) ? proto : ObjectPrototype);
	    var result = functionApply(Target, instance, args);
	    return isObject(result) ? result : instance;
	  }
	});

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  Object.defineProperty(subClass, "prototype", {
	    value: Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        writable: true,
	        configurable: true
	      }
	    }),
	    writable: false
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (_typeof(call) === "object" || typeof call === "function")) {
	    return call;
	  } else if (call !== void 0) {
	    throw new TypeError("Derived constructors may only return object or undefined");
	  }

	  return _assertThisInitialized(self);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _isNativeFunction(fn) {
	  return Function.toString.call(fn).indexOf("[native code]") !== -1;
	}

	function _isNativeReflectConstruct$1() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _construct(Parent, args, Class) {
	  if (_isNativeReflectConstruct$1()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	function _wrapNativeSuper(Class) {
	  var _cache = typeof Map === "function" ? new Map() : undefined;

	  _wrapNativeSuper = function _wrapNativeSuper(Class) {
	    if (Class === null || !_isNativeFunction(Class)) return Class;

	    if (typeof Class !== "function") {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    if (typeof _cache !== "undefined") {
	      if (_cache.has(Class)) return _cache.get(Class);

	      _cache.set(Class, Wrapper);
	    }

	    function Wrapper() {
	      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
	    }

	    Wrapper.prototype = Object.create(Class.prototype, {
	      constructor: {
	        value: Wrapper,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    return _setPrototypeOf(Wrapper, Class);
	  };

	  return _wrapNativeSuper(Class);
	}

	function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

	var RequestError = /*#__PURE__*/function (_Error) {
	  _inherits(RequestError, _Error);

	  var _super = _createSuper(RequestError);

	  function RequestError(message, response, status) {
	    var _this;

	    _classCallCheck(this, RequestError);

	    _this = _super.call(this, message);
	    _this.response = response;
	    _this.status = status;
	    return _this;
	  }

	  return _createClass(RequestError);
	}( /*#__PURE__*/_wrapNativeSuper(Error));

	function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
	var mutexCounter = 0;
	var MUTEX_ERROR = 'Mutex has been changed';
	/**
	 * Query result dataset formats enum.
	 */

	var ResultType = {
	  DEFAULT: 'default',
	  COMPACT: 'compact'
	};

	function mutexPromise(promise) {
	  return new Promise( /*#__PURE__*/function () {
	    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(resolve, reject) {
	      return regenerator.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.t0 = resolve;
	              _context.next = 4;
	              return promise;

	            case 4:
	              _context.t1 = _context.sent;
	              (0, _context.t0)(_context.t1);
	              _context.next = 11;
	              break;

	            case 8:
	              _context.prev = 8;
	              _context.t2 = _context["catch"](0);

	              if (_context.t2 !== MUTEX_ERROR) {
	                reject(_context.t2);
	              }

	            case 11:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, null, [[0, 8]]);
	    }));

	    return function (_x, _x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	}

	var CubejsApi = /*#__PURE__*/function () {
	  function CubejsApi(apiToken, options) {
	    _classCallCheck(this, CubejsApi);

	    if (apiToken !== null && !Array.isArray(apiToken) && _typeof(apiToken) === 'object') {
	      options = apiToken;
	      apiToken = undefined;
	    }

	    options = options || {};

	    if (!options.transport && !options.apiUrl) {
	      throw new Error('The `apiUrl` option is required');
	    }

	    this.apiToken = apiToken;
	    this.apiUrl = options.apiUrl;
	    this.method = options.method;
	    this.headers = options.headers || {};
	    this.credentials = options.credentials;
	    this.transport = options.transport || new HttpTransport({
	      authorization: typeof apiToken === 'function' ? undefined : apiToken,
	      apiUrl: this.apiUrl,
	      method: this.method,
	      headers: this.headers,
	      credentials: this.credentials
	    });
	    this.pollInterval = options.pollInterval || 5;
	    this.parseDateMeasures = options.parseDateMeasures;
	    this.updateAuthorizationPromise = null;
	  }

	  _createClass(CubejsApi, [{
	    key: "request",
	    value: function request(method, params) {
	      return this.transport.request(method, _objectSpread({
	        baseRequestId: v4()
	      }, params));
	    }
	  }, {
	    key: "loadMethod",
	    value: function loadMethod(request, toResult, options, callback) {
	      var _this = this;

	      var mutexValue = ++mutexCounter;

	      if (typeof options === 'function' && !callback) {
	        callback = options;
	        options = undefined;
	      }

	      options = options || {};
	      var mutexKey = options.mutexKey || 'default';

	      if (options.mutexObj) {
	        options.mutexObj[mutexKey] = mutexValue;
	      }

	      var requestPromise = this.updateTransportAuthorization().then(function () {
	        return request();
	      });
	      var skipAuthorizationUpdate = true;
	      var unsubscribed = false;

	      var checkMutex = /*#__PURE__*/function () {
	        var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
	          var requestInstance;
	          return regenerator.wrap(function _callee2$(_context2) {
	            while (1) {
	              switch (_context2.prev = _context2.next) {
	                case 0:
	                  _context2.next = 2;
	                  return requestPromise;

	                case 2:
	                  requestInstance = _context2.sent;

	                  if (!(options.mutexObj && options.mutexObj[mutexKey] !== mutexValue)) {
	                    _context2.next = 9;
	                    break;
	                  }

	                  unsubscribed = true;

	                  if (!requestInstance.unsubscribe) {
	                    _context2.next = 8;
	                    break;
	                  }

	                  _context2.next = 8;
	                  return requestInstance.unsubscribe();

	                case 8:
	                  throw MUTEX_ERROR;

	                case 9:
	                case "end":
	                  return _context2.stop();
	              }
	            }
	          }, _callee2);
	        }));

	        return function checkMutex() {
	          return _ref2.apply(this, arguments);
	        };
	      }();

	      var loadImpl = /*#__PURE__*/function () {
	        var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(response, next) {
	          var requestInstance, subscribeNext, continueWait, body, text, error, result;
	          return regenerator.wrap(function _callee5$(_context5) {
	            while (1) {
	              switch (_context5.prev = _context5.next) {
	                case 0:
	                  _context5.next = 2;
	                  return requestPromise;

	                case 2:
	                  requestInstance = _context5.sent;

	                  subscribeNext = /*#__PURE__*/function () {
	                    var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
	                      return regenerator.wrap(function _callee3$(_context3) {
	                        while (1) {
	                          switch (_context3.prev = _context3.next) {
	                            case 0:
	                              if (!(options.subscribe && !unsubscribed)) {
	                                _context3.next = 8;
	                                break;
	                              }

	                              if (!requestInstance.unsubscribe) {
	                                _context3.next = 5;
	                                break;
	                              }

	                              return _context3.abrupt("return", next());

	                            case 5:
	                              _context3.next = 7;
	                              return new Promise(function (resolve) {
	                                return setTimeout(function () {
	                                  return resolve();
	                                }, _this.pollInterval * 1000);
	                              });

	                            case 7:
	                              return _context3.abrupt("return", next());

	                            case 8:
	                              return _context3.abrupt("return", null);

	                            case 9:
	                            case "end":
	                              return _context3.stop();
	                          }
	                        }
	                      }, _callee3);
	                    }));

	                    return function subscribeNext() {
	                      return _ref4.apply(this, arguments);
	                    };
	                  }();

	                  continueWait = /*#__PURE__*/function () {
	                    var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(wait) {
	                      return regenerator.wrap(function _callee4$(_context4) {
	                        while (1) {
	                          switch (_context4.prev = _context4.next) {
	                            case 0:
	                              if (unsubscribed) {
	                                _context4.next = 5;
	                                break;
	                              }

	                              if (!wait) {
	                                _context4.next = 4;
	                                break;
	                              }

	                              _context4.next = 4;
	                              return new Promise(function (resolve) {
	                                return setTimeout(function () {
	                                  return resolve();
	                                }, _this.pollInterval * 1000);
	                              });

	                            case 4:
	                              return _context4.abrupt("return", next());

	                            case 5:
	                              return _context4.abrupt("return", null);

	                            case 6:
	                            case "end":
	                              return _context4.stop();
	                          }
	                        }
	                      }, _callee4);
	                    }));

	                    return function continueWait(_x5) {
	                      return _ref5.apply(this, arguments);
	                    };
	                  }();

	                  if (!(options.subscribe && !skipAuthorizationUpdate)) {
	                    _context5.next = 8;
	                    break;
	                  }

	                  _context5.next = 8;
	                  return _this.updateTransportAuthorization();

	                case 8:
	                  skipAuthorizationUpdate = false;

	                  if (!(response.status === 502)) {
	                    _context5.next = 13;
	                    break;
	                  }

	                  _context5.next = 12;
	                  return checkMutex();

	                case 12:
	                  return _context5.abrupt("return", continueWait(true));

	                case 13:
	                  body = {};
	                  text = '';
	                  _context5.prev = 15;
	                  _context5.next = 18;
	                  return response.text();

	                case 18:
	                  text = _context5.sent;
	                  body = JSON.parse(text);
	                  _context5.next = 25;
	                  break;

	                case 22:
	                  _context5.prev = 22;
	                  _context5.t0 = _context5["catch"](15);
	                  body.error = text;

	                case 25:
	                  if (!(body.error === 'Continue wait')) {
	                    _context5.next = 30;
	                    break;
	                  }

	                  _context5.next = 28;
	                  return checkMutex();

	                case 28:
	                  if (options.progressCallback) {
	                    options.progressCallback(new ProgressResult(body));
	                  }

	                  return _context5.abrupt("return", continueWait());

	                case 30:
	                  if (!(response.status !== 200)) {
	                    _context5.next = 43;
	                    break;
	                  }

	                  _context5.next = 33;
	                  return checkMutex();

	                case 33:
	                  if (!(!options.subscribe && requestInstance.unsubscribe)) {
	                    _context5.next = 36;
	                    break;
	                  }

	                  _context5.next = 36;
	                  return requestInstance.unsubscribe();

	                case 36:
	                  error = new RequestError(body.error, body, response.status); // TODO error class

	                  if (!callback) {
	                    _context5.next = 41;
	                    break;
	                  }

	                  callback(error);
	                  _context5.next = 42;
	                  break;

	                case 41:
	                  throw error;

	                case 42:
	                  return _context5.abrupt("return", subscribeNext());

	                case 43:
	                  _context5.next = 45;
	                  return checkMutex();

	                case 45:
	                  if (!(!options.subscribe && requestInstance.unsubscribe)) {
	                    _context5.next = 48;
	                    break;
	                  }

	                  _context5.next = 48;
	                  return requestInstance.unsubscribe();

	                case 48:
	                  result = toResult(body);

	                  if (!callback) {
	                    _context5.next = 53;
	                    break;
	                  }

	                  callback(null, result);
	                  _context5.next = 54;
	                  break;

	                case 53:
	                  return _context5.abrupt("return", result);

	                case 54:
	                  return _context5.abrupt("return", subscribeNext());

	                case 55:
	                case "end":
	                  return _context5.stop();
	              }
	            }
	          }, _callee5, null, [[15, 22]]);
	        }));

	        return function loadImpl(_x3, _x4) {
	          return _ref3.apply(this, arguments);
	        };
	      }();

	      var promise = requestPromise.then(function (requestInstance) {
	        return mutexPromise(requestInstance.subscribe(loadImpl));
	      });

	      if (callback) {
	        return {
	          unsubscribe: function () {
	            var _unsubscribe = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6() {
	              var requestInstance;
	              return regenerator.wrap(function _callee6$(_context6) {
	                while (1) {
	                  switch (_context6.prev = _context6.next) {
	                    case 0:
	                      _context6.next = 2;
	                      return requestPromise;

	                    case 2:
	                      requestInstance = _context6.sent;
	                      unsubscribed = true;

	                      if (!requestInstance.unsubscribe) {
	                        _context6.next = 6;
	                        break;
	                      }

	                      return _context6.abrupt("return", requestInstance.unsubscribe());

	                    case 6:
	                      return _context6.abrupt("return", null);

	                    case 7:
	                    case "end":
	                      return _context6.stop();
	                  }
	                }
	              }, _callee6);
	            }));

	            function unsubscribe() {
	              return _unsubscribe.apply(this, arguments);
	            }

	            return unsubscribe;
	          }()
	        };
	      } else {
	        return promise;
	      }
	    }
	  }, {
	    key: "updateTransportAuthorization",
	    value: function () {
	      var _updateTransportAuthorization = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8() {
	        var _this2 = this;

	        return regenerator.wrap(function _callee8$(_context8) {
	          while (1) {
	            switch (_context8.prev = _context8.next) {
	              case 0:
	                if (!this.updateAuthorizationPromise) {
	                  _context8.next = 4;
	                  break;
	                }

	                _context8.next = 3;
	                return this.updateAuthorizationPromise;

	              case 3:
	                return _context8.abrupt("return");

	              case 4:
	                if (!(typeof this.apiToken === 'function')) {
	                  _context8.next = 8;
	                  break;
	                }

	                this.updateAuthorizationPromise = new Promise( /*#__PURE__*/function () {
	                  var _ref6 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7(resolve, reject) {
	                    var token;
	                    return regenerator.wrap(function _callee7$(_context7) {
	                      while (1) {
	                        switch (_context7.prev = _context7.next) {
	                          case 0:
	                            _context7.prev = 0;
	                            _context7.next = 3;
	                            return _this2.apiToken();

	                          case 3:
	                            token = _context7.sent;

	                            if (_this2.transport.authorization !== token) {
	                              _this2.transport.authorization = token;
	                            }

	                            resolve();
	                            _context7.next = 11;
	                            break;

	                          case 8:
	                            _context7.prev = 8;
	                            _context7.t0 = _context7["catch"](0);
	                            reject(_context7.t0);

	                          case 11:
	                            _context7.prev = 11;
	                            _this2.updateAuthorizationPromise = null;
	                            return _context7.finish(11);

	                          case 14:
	                          case "end":
	                            return _context7.stop();
	                        }
	                      }
	                    }, _callee7, null, [[0, 8, 11, 14]]);
	                  }));

	                  return function (_x6, _x7) {
	                    return _ref6.apply(this, arguments);
	                  };
	                }());
	                _context8.next = 8;
	                return this.updateAuthorizationPromise;

	              case 8:
	              case "end":
	                return _context8.stop();
	            }
	          }
	        }, _callee8, this);
	      }));

	      function updateTransportAuthorization() {
	        return _updateTransportAuthorization.apply(this, arguments);
	      }

	      return updateTransportAuthorization;
	    }()
	    /**
	     * Add system properties to a query object.
	     * @param {Query} query
	     * @param {string} responseFormat
	     * @returns {void}
	     * @private
	     */

	  }, {
	    key: "patchQueryInternal",
	    value: function patchQueryInternal(query, responseFormat) {
	      if (responseFormat === ResultType.COMPACT && query.responseFormat !== ResultType.COMPACT) {
	        return _objectSpread(_objectSpread({}, query), {}, {
	          responseFormat: ResultType.COMPACT
	        });
	      } else {
	        return query;
	      }
	    }
	    /**
	     * Process result fetched from the gateway#load method according
	     * to the network protocol.
	     * @param {*} response
	     * @returns ResultSet
	     * @private
	     */

	  }, {
	    key: "loadResponseInternal",
	    value: function loadResponseInternal(response) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      if (response.results.length) {
	        if (options.castNumerics) {
	          response.results.forEach(function (result) {
	            var numericMembers = Object.entries(_objectSpread(_objectSpread({}, result.annotation.measures), result.annotation.dimensions)).map(function (_ref7) {
	              var _ref8 = _slicedToArray(_ref7, 2),
	                  k = _ref8[0],
	                  v = _ref8[1];

	              if (v.type === 'number') {
	                return k;
	              }

	              return undefined;
	            }).filter(Boolean);
	            result.data = result.data.map(function (row) {
	              numericMembers.forEach(function (key) {
	                if (row[key] != null) {
	                  row[key] = Number(row[key]);
	                }
	              });
	              return row;
	            });
	          });
	        }

	        if (response.results[0].query.responseFormat && response.results[0].query.responseFormat === ResultType.COMPACT) {
	          response.results.forEach(function (result, j) {
	            var data = [];
	            result.data.dataset.forEach(function (r) {
	              var row = {};
	              result.data.members.forEach(function (m, i) {
	                row[m] = r[i];
	              });
	              data.push(row);
	            });
	            response.results[j].data = data;
	          });
	        }
	      }

	      return new ResultSet(response, {
	        parseDateMeasures: this.parseDateMeasures
	      });
	    }
	  }, {
	    key: "load",
	    value: function load(query, options, callback) {
	      var _this3 = this;

	      var responseFormat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ResultType.DEFAULT;

	      if (responseFormat === ResultType.COMPACT) {
	        if (Array.isArray(query)) {
	          query = query.map(function (q) {
	            return _this3.patchQueryInternal(q, ResultType.COMPACT);
	          });
	        } else {
	          query = this.patchQueryInternal(query, ResultType.COMPACT);
	        }
	      }

	      return this.loadMethod(function () {
	        return _this3.request('load', {
	          query: query,
	          queryType: 'multi'
	        });
	      }, function (response) {
	        return _this3.loadResponseInternal(response, options);
	      }, options, callback);
	    }
	  }, {
	    key: "subscribe",
	    value: function subscribe(query, options, callback) {
	      var _this4 = this;

	      var responseFormat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ResultType.DEFAULT;

	      if (responseFormat === ResultType.COMPACT) {
	        if (Array.isArray(query)) {
	          query = query.map(function (q) {
	            return _this4.patchQueryInternal(q, ResultType.COMPACT);
	          });
	        } else {
	          query = this.patchQueryInternal(query, ResultType.COMPACT);
	        }
	      }

	      return this.loadMethod(function () {
	        return _this4.request('subscribe', {
	          query: query,
	          queryType: 'multi'
	        });
	      }, function (response) {
	        return _this4.loadResponseInternal(response, options);
	      }, _objectSpread(_objectSpread({}, options), {}, {
	        subscribe: true
	      }), callback);
	    }
	  }, {
	    key: "sql",
	    value: function sql(query, options, callback) {
	      var _this5 = this;

	      return this.loadMethod(function () {
	        return _this5.request('sql', {
	          query: query
	        });
	      }, function (response) {
	        return Array.isArray(response) ? response.map(function (body) {
	          return new SqlQuery(body);
	        }) : new SqlQuery(response);
	      }, options, callback);
	    }
	  }, {
	    key: "meta",
	    value: function meta(options, callback) {
	      var _this6 = this;

	      return this.loadMethod(function () {
	        return _this6.request('meta');
	      }, function (body) {
	        return new Meta(body);
	      }, options, callback);
	    }
	  }, {
	    key: "dryRun",
	    value: function dryRun(query, options, callback) {
	      var _this7 = this;

	      return this.loadMethod(function () {
	        return _this7.request('dry-run', {
	          query: query
	        });
	      }, function (response) {
	        return response;
	      }, options, callback);
	    }
	  }]);

	  return CubejsApi;
	}();

	var cubejs = (function (apiToken, options) {
	  return new CubejsApi(apiToken, options);
	});

	var clientCoreExports = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': cubejs,
		CubejsApi: CubejsApi,
		CubeApi: CubejsApi,
		HttpTransport: HttpTransport,
		ResultSet: ResultSet,
		RequestError: RequestError,
		Meta: Meta,
		DEFAULT_GRANULARITY: DEFAULT_GRANULARITY,
		GRANULARITIES: GRANULARITIES,
		removeEmptyQueryFields: removeEmptyQueryFields,
		validateQuery: validateQuery,
		areQueriesEqual: areQueriesEqual,
		defaultOrder: defaultOrder,
		defaultHeuristics: defaultHeuristics,
		isQueryPresent: isQueryPresent,
		movePivotItem: movePivotItem,
		moveItemInArray: moveItemInArray,
		flattenFilters: flattenFilters,
		getQueryMembers: getQueryMembers,
		getOrderMembersFromOrder: getOrderMembersFromOrder,
		aliasSeries: aliasSeries
	});

	Object.keys(clientCoreExports).forEach(function (key) {
	  cubejs[key] = clientCoreExports[key];
	});

	return cubejs;

})));
//# sourceMappingURL=cubejs-client-core.umd.js.map