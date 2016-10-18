/*!
 * Storer v0.0.8
 * Extended storage functionality for LocalStorage and SessionStorage
 * 
 * Licensed GPLv3 for open source use
 * 
 * http://seresinertes.com
 * Copyright 2016 Benja Osuna
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("eventemitter2"));
	else if(typeof define === 'function' && define.amd)
		define("storer", ["eventemitter2"], factory);
	else if(typeof exports === 'object')
		exports["storer"] = factory(require("eventemitter2"));
	else
		root["storer"] = factory(root["EventEmitter2"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_119__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { throw err; };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 120);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var store      = __webpack_require__(32)('wks')
	  , uid        = __webpack_require__(21)
	  , Symbol     = __webpack_require__(2).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var isObject = __webpack_require__(11);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(10)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var global    = __webpack_require__(2)
	  , core      = __webpack_require__(0)
	  , ctx       = __webpack_require__(14)
	  , hide      = __webpack_require__(9)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var anObject       = __webpack_require__(3)
	  , IE8_DOM_DEFINE = __webpack_require__(48)
	  , toPrimitive    = __webpack_require__(34)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(4) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(49)
	  , defined = __webpack_require__(24);
	module.exports = function(it){
	  return IObject(defined(it));
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var dP         = __webpack_require__(6)
	  , createDesc = __webpack_require__(18);
	module.exports = __webpack_require__(4) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(53)
	  , enumBugKeys = __webpack_require__(26);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// optional / simple context binding
	var aFunction = __webpack_require__(23);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};


/***/ },
/* 15 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = {};


/***/ },
/* 16 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = true;


/***/ },
/* 17 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	exports.f = {}.propertyIsEnumerable;


/***/ },
/* 18 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var def = __webpack_require__(6).f
	  , has = __webpack_require__(8)
	  , TAG = __webpack_require__(1)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(24);
	module.exports = function(it){
	  return Object(defined(it));
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = { "default": __webpack_require__(71), __esModule: true };


/***/ },
/* 23 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};


/***/ },
/* 24 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var isObject = __webpack_require__(11)
	  , document = __webpack_require__(2).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};


/***/ },
/* 26 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(3)
	  , dPs         = __webpack_require__(98)
	  , enumBugKeys = __webpack_require__(26)
	  , IE_PROTO    = __webpack_require__(31)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(25)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(47).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};
	


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var pIE            = __webpack_require__(17)
	  , createDesc     = __webpack_require__(18)
	  , toIObject      = __webpack_require__(7)
	  , toPrimitive    = __webpack_require__(34)
	  , has            = __webpack_require__(8)
	  , IE8_DOM_DEFINE = __webpack_require__(48)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(4) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	exports.f = Object.getOwnPropertySymbols;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(5)
	  , core    = __webpack_require__(0)
	  , fails   = __webpack_require__(10);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var shared = __webpack_require__(32)('keys')
	  , uid    = __webpack_require__(21);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var global = __webpack_require__(2)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};


/***/ },
/* 33 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(11);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var global         = __webpack_require__(2)
	  , core           = __webpack_require__(0)
	  , LIBRARY        = __webpack_require__(16)
	  , wksExt         = __webpack_require__(36)
	  , defineProperty = __webpack_require__(6).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	exports.f = __webpack_require__(1);


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _stringify = __webpack_require__(22);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _defineProperty2 = __webpack_require__(44);
	
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	
	var _assign = __webpack_require__(38);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _keys = __webpack_require__(41);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	exports.size = size;
	exports.is = is;
	exports.isString = isString;
	exports.isObject = isObject;
	exports.isArray = isArray;
	exports.isUndefined = isUndefined;
	exports.isEmpty = isEmpty;
	exports.isNumeric = isNumeric;
	exports.isCollection = isCollection;
	exports.each = each;
	exports.merge = merge;
	exports.contains = contains;
	exports.flatten = flatten;
	exports.compact = compact;
	exports.uniq = uniq;
	exports.keys = keys;
	exports.values = values;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function size(obj) {
		if (!is('object', obj)) return obj;
		return (0, _keys2.default)(obj).length;
	}
	
	function is(type, obj) {
		if (type.toLowerCase() === 'string') {
			return Object.prototype.toString.call(obj) === '[object String]';
		} else if (type.toLowerCase() === 'object') {
			return obj.toString() === "[object Object]";
		} else if (type.toLowerCase() === 'array') {
			return Object.prototype.toString.call(obj) === '[object Array]';
		} else if (type.toLowerCase() === 'undefined') {
			return typeof obj === 'undefined';
		} else if (type.toLowerCase() === 'empty') {
			return size(obj) === 0;
		}
	}
	
	function isString(obj) {
		return is('string', obj);
	}
	function isObject(obj) {
		return is('object', obj);
	}
	function isArray(obj) {
		return is('array', obj);
	}
	function isUndefined(obj) {
		return is('undefined', obj);
	}
	function isEmpty(obj) {
		return is('empty', obj);
	}
	function isNumeric(obj) {
		return !isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
	}
	
	function isCollection(obj) {
		return isArray(obj) && obj.length > 0 && obj.every(function (v) {
			return isObject(v);
		});
	}
	
	function each(collection, iterator) {
		if (isArray(collection)) {
			for (var key = 0; key < collection.length; key++) {
				iterator(collection[key], key, collection);
			}
		} else {
			for (var objKey in collection) {
				iterator(collection[objKey], objKey, collection);
			}
		}
	}
	/**
	 * Merge multipe objects
	 * @param  {Object} target
	 * @param  {Object} source
	 * @return {Object}
	 *
	 * From http://stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
	 */
	function merge(target, source) {
	
		if (!isObject(source)) {
			return source;
		}
	
		if (isObject(target) && isObject(source)) {
			for (var key in source) {
				if (isObject(source[key])) {
					if (!target[key]) (0, _assign2.default)(target, (0, _defineProperty3.default)({}, key, {}));
					merge(target[key], source[key]);
				} else {
					(0, _assign2.default)(target, (0, _defineProperty3.default)({}, key, source[key]));
				}
			}
		}
	
		return target;
	}
	
	/*export function contains( obj, value ) {
		let result = false
		value = isArray(value) ? value : [value]
	
		return value.some(val => {
			return JSON.stringify(obj).indexOf(JSON.stringify(val)) !== -1
		})
	}*/
	
	function contains(obj, value) {
		return !!~(0, _stringify2.default)(obj).indexOf((0, _stringify2.default)(value));
	}
	
	function flatten(array) {
		return [].concat.apply([], array);
	}
	
	function compact(array) {
		if (!isArray(array)) return array;
		return array.filter(function (value) {
			if (value === undefined) return false;
			if (isObject(value) && isEmpty(value)) return false;
	
			return true;
		});
	}
	
	function uniq(array) {
		if (!isArray(array)) return array;
		var temp = [];
		return array.filter(function (value) {
			var test = temp.toString().indexOf(value) === -1;
			temp.push(value);
			return test;
		});
	}
	
	function keys(obj) {
		if (!is('object', obj)) return obj;
		return (0, _keys2.default)(obj);
	}
	
	function values(obj) {
		if (!is('object', obj)) return obj;
		return keys(obj).map(function (key) {
			return obj[key];
		});
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = { "default": __webpack_require__(72), __esModule: true };


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = { "default": __webpack_require__(74), __esModule: true };


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = { "default": __webpack_require__(76), __esModule: true };


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = { "default": __webpack_require__(77), __esModule: true };


/***/ },
/* 42 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(39);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(39);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }
	
	  return obj;
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(67);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(66);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(13)
	  , TAG = __webpack_require__(1)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = __webpack_require__(2).document && document.documentElement;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = !__webpack_require__(4) && !__webpack_require__(10)(function(){
	  return Object.defineProperty(__webpack_require__(25)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(13);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	'use strict';
	var LIBRARY        = __webpack_require__(16)
	  , $export        = __webpack_require__(5)
	  , redefine       = __webpack_require__(54)
	  , hide           = __webpack_require__(9)
	  , has            = __webpack_require__(8)
	  , Iterators      = __webpack_require__(15)
	  , $iterCreate    = __webpack_require__(91)
	  , setToStringTag = __webpack_require__(19)
	  , getPrototypeOf = __webpack_require__(52)
	  , ITERATOR       = __webpack_require__(1)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(53)
	  , hiddenKeys = __webpack_require__(26).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(8)
	  , toObject    = __webpack_require__(20)
	  , IE_PROTO    = __webpack_require__(31)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var has          = __webpack_require__(8)
	  , toIObject    = __webpack_require__(7)
	  , arrayIndexOf = __webpack_require__(84)(false)
	  , IE_PROTO     = __webpack_require__(31)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = __webpack_require__(9);


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var ctx                = __webpack_require__(14)
	  , invoke             = __webpack_require__(87)
	  , html               = __webpack_require__(47)
	  , cel                = __webpack_require__(25)
	  , global             = __webpack_require__(2)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(13)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 7.1.15 ToLength
	var toInteger = __webpack_require__(33)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};


/***/ },
/* 57 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	'use strict';
	var $at  = __webpack_require__(104)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(50)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(107);
	var global        = __webpack_require__(2)
	  , hide          = __webpack_require__(9)
	  , Iterators     = __webpack_require__(15)
	  , TO_STRING_TAG = __webpack_require__(1)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _promise = __webpack_require__(65);
	
	var _promise2 = _interopRequireDefault(_promise);
	
	var _keys = __webpack_require__(41);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _defineProperty2 = __webpack_require__(44);
	
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	
	var _stringify = __webpack_require__(22);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _assign = __webpack_require__(38);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _getPrototypeOf = __webpack_require__(40);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(70);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _get4 = __webpack_require__(68);
	
	var _get5 = _interopRequireDefault(_get4);
	
	var _inherits2 = __webpack_require__(69);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _utils = __webpack_require__(37);
	
	var utils = _interopRequireWildcard(_utils);
	
	var _storerBase = __webpack_require__(61);
	
	var _storerBase2 = _interopRequireDefault(_storerBase);
	
	var _eventemitter = __webpack_require__(119);
	
	var _eventemitter2 = _interopRequireDefault(_eventemitter);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	if (!_storerBase2.default.browserSupportsStorage()) throw new Error('It seems that your browser doesn\'t support both LocalStorage & SessionStorage. Try to use a modern browser!');
	
	var storageCache = storageCache || {};
	
	var ClassToExtend = function ClassToExtend() {
		(0, _classCallCheck3.default)(this, ClassToExtend);
	};
	
	;
	var _EventEmitter = typeof _eventemitter2.default !== 'undefined' ? _eventemitter2.default : ClassToExtend;
	
	var REGEX = {
		isPath: /[(\[\d+\])(\.)]+/,
		arrayIndex: /(?:\[(\d+)?\])/,
		arrayPush: /\[\]$/,
		firstDot: /^\./
	};
	
	var Storer = function (_EventEmitter2) {
		(0, _inherits3.default)(Storer, _EventEmitter2);
	
		/**
	  * Storer constructor
	  * @param  {String|Object} args Namespace or Options
	  * @return {this}
	  */
		function Storer() {
			var _ref;
	
			var _ret;
	
			(0, _classCallCheck3.default)(this, Storer);
	
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}
	
			var _this = (0, _possibleConstructorReturn3.default)(this, (_ref = Storer.__proto__ || (0, _getPrototypeOf2.default)(Storer)).call.apply(_ref, [this].concat(args)));
	
			_this._create.apply(_this, args);
			return _ret = _this, (0, _possibleConstructorReturn3.default)(_this, _ret);
		}
	
		/**
	  * Create Storage's mirror cache to manage all storage
	  * @param  {String|Object} args Namespace or Options
	  * @return {this}
	  */
	
	
		(0, _createClass3.default)(Storer, [{
			key: '_create',
			value: function _create() {
	
				this.options = {
					namespace: 'storage',
					type: 'local' // local || session
				};
	
				if (utils.isString(arguments.length <= 0 ? undefined : arguments[0])) {
					this.options.namespace = arguments.length <= 0 ? undefined : arguments[0];
					this.namespace = this.options.namespace;
				} else if (utils.isObject(arguments.length <= 0 ? undefined : arguments[0])) {
					(0, _assign2.default)(this.options, arguments.length <= 0 ? undefined : arguments[0]);
					this.namespace = this.options.namespace;
				} else {
					this.options.namespace = null;
					this.namespace = null;
				}
	
				this.type = (arguments.length <= 1 ? undefined : arguments[1]) || this.options.type;
				this.options.type = this.type;
	
				this.store = new _storerBase2.default(this.options);
	
				if (utils.isUndefined(storageCache[this.namespace])) {
					storageCache[this.namespace] = {};
				}
	
				this.cache = this._getCache();
	
				this.store.set(this.cache);
	
				return this;
			}
	
			/**
	   * Override EventEmitter's on method
	   * @param  {...args} args
	   * @return {void}
	   */
	
		}, {
			key: 'on',
			value: function on() {
				if (typeof _eventemitter2.default !== 'undefined') {
					var _get2;
	
					for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
						args[_key2] = arguments[_key2];
					}
	
					(_get2 = (0, _get5.default)(Storer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Storer.prototype), 'on', this)).call.apply(_get2, [this].concat(args));
				} else {
					console.warn('[Storer::on()] To use this method, you need to import EventEmitter');
				}
			}
	
			/**
	   * Override EventEmitter's emit method
	   * @param  {...args} args
	   * @return {void}
	   */
	
		}, {
			key: 'emit',
			value: function emit() {
				var _get3;
	
				for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
					args[_key3] = arguments[_key3];
				}
	
				if (typeof _eventemitter2.default !== 'undefined') (_get3 = (0, _get5.default)(Storer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Storer.prototype), 'emit', this)).call.apply(_get3, [this].concat(args));
			}
	
			/**
	   * Set new entry into namespaced storage object
	   * @param {object|string pair} args
	   *
	   * storage.set('foo')
	   * storage.set({ foo:bar })
	   * storage.set('foo.hello[0].bye', 'bar')
	   * storage.set('foo.hello[]', 'bar') // This way you can push a value into an array
	   */
	
		}, {
			key: 'set',
			value: function set() {
				var _this2 = this;
	
				var path = arguments.length <= 0 ? undefined : arguments[0],
				    value = arguments.length <= 1 ? undefined : arguments[1],
				    callback = null;
	
				callback = this._parseCallback.apply(this, arguments);
	
				if (!value) {
					try {
						if (utils.isObject(path)) {
							utils.merge(this.cache, path);
						} else {
							this.cache = path;
						}
	
						this.store.set(this.cache);
	
						this.emit('set', path);
	
						return this._resolve({ value: path }, callback);
					} catch (e) {
						var error = '[Storer::set()] There were a problem setting the value: ' + (0, _stringify2.default)(path);
						return this._resolve({ error: error }, callback);
					}
				} else {
	
					var found = false;
	
					if (this._isPath(path)) {
						(function () {
							var _path = _this2._splitPath(path);
							_path.reduce(function (prev, curr) {
								if (!prev) return undefined;
								if (_path[_path.length - 1] === curr) {
	
									if (utils.isArray(prev)) {
	
										// When curr === '' --> We have to push the value
										if (utils.isNumeric(curr)) {
											curr > prev.length - 1 ? prev.push(value) : prev[Math.min(curr, _path.length - 1)] = value;
										} else {
											prev.push(value);
										}
									} else {
										prev[curr] = value;
									}
	
									found = true;
								} else {
									return prev[curr];
								}
							}, _this2.cache);
						})();
					} else {
						(function () {
							var deepSet = function deepSet(obj, key) {
								if (utils.isObject(obj) || utils.isArray(obj)) {
	
									utils.each(obj, function (v, k) {
	
										if (k === key) {
											found = true;
											obj[k] = value;
										} else {
											deepSet(obj[k], key);
										}
									});
								}
							};
	
							deepSet(_this2.cache, path);
	
							if (!found) {
								utils.merge(_this2.cache, (0, _defineProperty3.default)({}, path, value));
								found = true;
							}
						})();
					}
	
					this._sanitizeArrays(this.cache);
	
					found && this.store.set(this.cache);
	
					var result = { value: this.all() };
	
					if (!found) {
						var _error = '[Storer::set()] There were a problem setting the value: ' + (0, _stringify2.default)(value);
						result = utils.merge(result, { error: _error });
					} else {
						this.emit('set', value);
					}
	
					return this._resolve(result, callback);
				}
			}
	
			/**
	   * Get values only by keys (if a path is given, find it by path)
	   * @param  {string|rest params|array} args could be multiple params ('foo', 'bar', 'xxx')
	   * @return {string|array}
	   */
	
		}, {
			key: 'get',
			value: function get() {
				var _this3 = this;
	
				for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
					args[_key4] = arguments[_key4];
				}
	
				args = utils.flatten(args);
	
				if (!args[0].length) return this.all();
	
				var result = [];
				var collection = this._toCollection();
	
				args.forEach(function (arg, i) {
	
					var found = _this3._isPath(arg) ? _this3._findByPath(arg) : _this3._findInCollection(arg);
	
					if (found) {
						if (utils.isArray(found)) {
							result.push(found.map(function (f) {
								return f[(0, _keys2.default)(f)[0]];
							}));
						} else {
							var key = (0, _keys2.default)(found)[0];
							var value = found[key];
							result.push(utils.isArray(value) ? [value] : value);
						}
					} else {
						result.push(undefined);
					}
				});
	
				return this._prepareResult(result);
			}
	
			/**
	   * Get key/value pair only by keys
	   * @param  {string|rest params|array} args could be multiple params ('foo', 'bar', 'xxx')
	   * @return {string|array}
	   */
	
		}, {
			key: 'pick',
			value: function pick() {
				var _this4 = this;
	
				for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
					args[_key5] = arguments[_key5];
				}
	
				args = utils.flatten(args);
	
				if (!args[0]) return this.all();
	
				var result = [];
	
				var collection = this._toCollection();
	
				args.forEach(function (arg, argKey) {
					var found = _this4._isPath(arg) ? _this4._findByPath(arg) : _this4._findInCollection(arg);
					found ? result.push(found) : result.push(undefined);
				});
	
				return this._prepareResult(result);
			}
	
			/**
	   * Check if the values exists in storage
	   * @param  {string|rest params|array} args could be multiple params ('foo', 'bar', 'xxx')
	   * @return {boolean}
	   */
	
		}, {
			key: 'has',
			value: function has() {
				var _this5 = this;
	
				for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
					args[_key6] = arguments[_key6];
				}
	
				args = utils.flatten(args);
				return args.every(function (arg) {
					var found = _this5._isPath(arg) ? _this5._findByPath(arg) : _this5._findInCollection(arg);
					return !!found;
				});
			}
	
			/**
	   * Get the keys in storage
	   * @return {Object}
	   */
	
		}, {
			key: 'keys',
			value: function keys() {
	
				var result = [];
	
				var collection = this._toCollection();
	
				if (collection.length) {
					result = collection.map(function (obj) {
						return utils.keys(obj)[0];
					});
	
					result = utils.uniq(result);
	
					return this._prepareResult(result);
				} else {
					throw new Error('[Storer::keys()] Keys not found');
				}
			}
	
			/**
	   * Iterate through storage
	   * @param  {Function} iteratorCallback Each iteration function
	   * @param  {Function} successCallback  To be executed if everything went right
	   * @return {Function|Promise}
	   */
	
		}, {
			key: 'loop',
			value: function loop(iteratorCallback, successCallback) {
				var count = 0;
	
				function iterate() {
					var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.cache;
	
					utils.each(obj, function (value, key) {
						if (!utils.isUndefined(value)) {
							iteratorCallback.call(null, value, key, count);
							count++;
	
							if (utils.isObject(value) || utils.isArray(value)) iterate(value);
						} else {
							return _promise2.default.reject('[Storer::loop()] There were a problem looping');
						}
					});
				}
	
				iterate(this.cache);
	
				if (count > 0) {
					!!successCallback && utils.isFunction(successCallback) && successCallback.call(null, this.cache);
	
					return _promise2.default.resolve(this.cache);
				} else {
					return _promise2.default.reject('[Storer::loop()] There were a problem looping');
				}
			}
	
			/**
	   * Remove any entry (by key) into namespaced storage object (could be a path)
	   * @param  {string}
	   * @return {boolean}
	   *
	   * storage.remove('foo')
	   * storage.remove('foo.bar[0].xxx')
	   */
	
		}, {
			key: 'remove',
			value: function remove(arg) {
				var _this6 = this;
	
				var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	
	
				var error = void 0,
				    found = false;
	
				if (this._isPath(arg)) {
					(function () {
						var path = _this6._splitPath(arg);
						path.reduce(function (prev, curr) {
							if (!prev) return undefined;
	
							curr = utils.isArray(prev) ? Math.min(parseInt(curr, 10), prev.length - 1) : curr;
	
							if (parseInt(path[path.length - 1], 10) === curr) {
	
								if (!!prev[curr]) {
	
									found = true;
	
									if (utils.isArray(prev)) {
										prev.splice(curr, 1);
									} else {
										delete prev[curr];
									}
								}
							} else {
								return prev[curr];
							}
						}, _this6.cache);
					})();
				} else {
					(function () {
						var deepDelete = function deepDelete(obj, key) {
							if (utils.isObject(obj) || utils.isArray(obj)) {
	
								utils.each(obj, function (value, k) {
	
									if (k === key) {
										found = true;
										delete obj[k];
									} else {
										deepDelete(obj[k], key);
									}
								});
							}
						};
	
						deepDelete(_this6.cache, arg);
					})();
				}
	
				this._sanitizeArrays(this.cache);
	
				found && this.store.set(this.cache);
	
				var result = { value: this.all() };
	
				if (!found) {
					var _error = '[Storer::remove()] There were a problem removing the path: "' + arg + '"';
					result = utils.merge(result, { error: _error });
				} else {
					this.emit('remove', arg, this.all());
				}
	
				return this._resolve(result, callback);
			}
	
			/**
	   * Reset namespaced entry of storage, choosing between "local" & "session"
	   * @param  {String} type "local" | "session" | undefined=both
	   * @return {void}
	   */
	
		}, {
			key: 'reset',
			value: function reset() {
				var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
				var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	
				if (!this.store.has(this.namespace)) {
					throw new Error(this.namespace + ' not found in Storage');
				}
	
				this.cache = args;
				this.store.set(this.cache, type);
	
				this.emit('reset', this.all());
	
				return this;
			}
	
			/**
	   * Remove namespaced entry of storage, choosing between "local" & "session"
	   * @param  {String} type "local" | "session" | undefined=both
	   * @return {void}
	   */
	
		}, {
			key: 'clear',
			value: function clear() {
				var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
	
				if (!this.store.has(this.namespace)) {
					throw new Error(this.namespace + ' not found in Storage');
				}
	
				this.cache = {};
				this.store.remove(this.namespace, type);
	
				this.emit('clear', this.all());
	
				return this;
			}
	
			/**
	   * Switch store type
	   * @param  {String} type
	   * @return {void}
	   */
	
		}, {
			key: 'switchStore',
			value: function switchStore() {
				var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'local';
	
	
				if (this.type === type) type = type === 'local' ? 'session' : 'local';
	
				this.type = type;
				this.options.type = this.type;
				this.store.switchStore(this.type);
	
				this.cache = this._getCache();
	
				this.emit('switch', this.type, this.all());
	
				return this;
			}
	
			/**
	   * Switch store to session
	   * @return {void}
	   */
	
		}, {
			key: 'toSession',
			value: function toSession() {
				return this.switchStore('session');
			}
	
			/**
	   * Switch store to local
	   * @return {void}
	   */
	
		}, {
			key: 'toLocal',
			value: function toLocal() {
				return this.switchStore('local');
			}
	
			/**
	   * Get all entries in storage
	   * @return {Object|String}
	   */
	
		}, {
			key: 'all',
			value: function all() {
				return this.store.getContent();
			}
	
			/**
	   * Destroy namespaced storage from Storage and clear all vars
	   * @return {void}
	   */
	
		}, {
			key: 'destroy',
			value: function destroy() {
	
				this.emit('before.destroy', this.all());
	
				this.clear('local');
				this.clear('session');
	
				delete this.store;
				delete this.options;
				delete this.namespace;
				delete this.type;
				delete this.cache;
			}
	
			/**
	   * Get actual cache depending on storage type
	   * @return {Object}
	   */
	
		}, {
			key: '_getCache',
			value: function _getCache() {
				return this.store.has(this.namespace) ? utils.isObject(this.store.getContent(this.namespace)) ? this.store.getContent(this.namespace) : {} : storageCache[this.namespace];
			}
	
			/**
	   * 	Sanitize empty array entries
	   * @return {Array} 
	   */
	
		}, {
			key: '_sanitizeArrays',
			value: function _sanitizeArrays() {
				function deepSanitizeArray(obj) {
	
					utils.each(obj, function (value, k) {
	
						if (utils.isArray(value)) {
							obj[k] = utils.compact(value);
						}
	
						if (utils.isObject(value) || utils.isArray(value)) {
							deepSanitizeArray(value);
						}
					});
				}
	
				deepSanitizeArray(this.cache);
			}
	
			/**
	   * Returns valid callback or thor an error
	   * @param  {Array} args
	   * @return {Function|Error}
	   */
	
		}, {
			key: '_parseCallback',
			value: function _parseCallback() {
				if (arguments.length <= 2 && typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'function') return arguments.length <= 1 ? undefined : arguments[1];
				if (arguments.length <= 3 && typeof (arguments.length <= 2 ? undefined : arguments[2]) === 'function') return arguments.length <= 2 ? undefined : arguments[2];
	
				if (arguments.length > 2) {
					if (typeof (arguments.length <= 2 ? undefined : arguments[2]) !== 'function') throw new Error('[Storer::set()] Only 2 params are allowed at the most');
				}
			}
	
			/**
	   * Test if passed string is a path
	   * @param  {String}  str
	   * @return {Boolean}
	   */
	
		}, {
			key: '_isPath',
			value: function _isPath(str) {
				return utils.isString(str) && REGEX.isPath.test(str);
			}
	
			/**
	   * Find a value searching by a path and pick its key/value pair
	   * @param  {String}
	   * @return {Object} key/value object
	   */
	
		}, {
			key: '_findByPath',
			value: function _findByPath(arg) {
				var path = this._splitPath(arg);
				var result = path.reduce(function (prev, curr) {
					if (!prev) return undefined;
					if (path[path.length - 1] === curr) {
						if (!!prev[curr]) {
							return utils.isArray(prev) ? prev[curr] : (0, _defineProperty3.default)({}, curr, prev[curr]);
						} else {
							return undefined;
						}
					} else {
						return prev[curr];
					}
				}, this.cache);
	
				return this._prepareResult(result);
			}
	
			/**
	   * Find a value searching in the collection and pick its key/value pair
	   * @param  {String}
	   * @return {Object} key/value object
	   */
	
		}, {
			key: '_findInCollection',
			value: function _findInCollection(arg) {
				var result = [];
				var collection = this._toCollection();
	
				if (!collection.length) throw new Error('[Storer] Store is empty');
	
				result = collection.reduce(function (prev, curr) {
					var key = (0, _keys2.default)(curr)[0];
	
					if (utils.contains(key, arg)) {
						return prev.concat(utils.isArray(curr[key]) ? (0, _defineProperty3.default)({}, key, [curr[key]]) : (0, _defineProperty3.default)({}, key, curr[key]));
					} else {
						return prev;
					}
				}, result);
	
				return this._prepareResult(result);
			}
	
			/**
	   * Handle resolving method to return a callback or promise
	   * @param  {Object}   ({      value,        error })
	   * @param  {Function} callback
	   * @return {Function|Promise}
	   */
	
		}, {
			key: '_resolve',
			value: function _resolve(_ref5, callback) {
				var value = _ref5.value;
				var error = _ref5.error;
	
				if (callback && typeof callback === 'function') {
					return callback.call(null, error, value);
				} else {
					if (!utils.isUndefined(error)) return _promise2.default.reject(error);
					if (utils.isUndefined(value)) return _promise2.default.reject('The value is undefined');
	
					return _promise2.default.resolve(value);
				}
			}
	
			/**
	   * Create an array of a path splitted
	   * @param  {String} path
	   * @return {Array}
	   */
	
		}, {
			key: '_splitPath',
			value: function _splitPath(path) {
				path = path.replace(REGEX.arrayIndex, '.$1');
				path = path.replace(REGEX.firstDot, '');
				return path.split('.');
			}
	
			/**
	   * Prepare the result to be returned
	   * @param  {Object|String|Array} result
	   * @return {Object|String|Array}
	   */
	
		}, {
			key: '_prepareResult',
			value: function _prepareResult(result) {
				if (!result) return undefined;
				if (utils.isArray(result) && result.length === 1 && utils.isUndefined(result[0])) return undefined;
	
				if (utils.isArray(result) && result.length) {
					result = utils.flatten(utils.compact(result));
					return result.length === 1 ? result[0] : result;
				} else {
					return utils.isObject(result) ? result : undefined;
				}
			}
	
			/**
	   * Prepare all nested entries into a collection
	   * @param  {Object} objects
	   * @return {Object}
	   */
	
		}, {
			key: '_toCollection',
			value: function _toCollection() {
				var objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.cache;
	
	
				if (utils.isEmpty(objects)) return;
	
				var collection = [];
	
				function recursive(objects) {
					utils.each(objects, function (value, key) {
						var obj = {};
						obj[key] = value;
						collection.push(obj);
	
						if (utils.isArray(value)) {
							value.forEach(function (arrayValue) {
								return recursive(arrayValue);
							});
						}
	
						if (utils.isObject(value)) {
							recursive(value);
						}
					});
				}
	
				recursive(objects);
	
				return collection;
			}
	
			/*==================================*/
			/* STATIC METHODS */
			/**
	   * This methods can be invoked without creating a new instance of Storer
	   *
	   * Storer.set(...args)
	   * Storer.remove(...args)
	   */
			/*==================================*/
	
		}], [{
			key: 'set',
			value: function set() {
				for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
					args[_key7] = arguments[_key7];
				}
	
				var key = args[0];
				var value = args[1];
	
				var storage = new Storer(key);
				storage.set(value);
			}
		}, {
			key: 'remove',
			value: function remove() {
				for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
					args[_key8] = arguments[_key8];
				}
	
				var storage = new Storer(args[0]);
				args.shift();
				storage.remove(args);
			}
		}, {
			key: 'create',
			value: function create() {
				for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
					args[_key9] = arguments[_key9];
				}
	
				return new (Function.prototype.bind.apply(Storer, [null].concat(args)))();
			}
		}]);
		return Storer;
	}(_EventEmitter);
	
	exports.default = Storer;
	
	
	window.Storer = window.Storer || Storer;
	module.exports = exports['default'];


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _stringify = __webpack_require__(22);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _classCallCheck2 = __webpack_require__(42);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(43);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _utils = __webpack_require__(37);
	
	var utils = _interopRequireWildcard(_utils);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var StorerBase = function () {
		function StorerBase() {
			var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
			var _ref$type = _ref.type;
			var type = _ref$type === undefined ? 'local' : _ref$type;
			var _ref$namespace = _ref.namespace;
			var namespace = _ref$namespace === undefined ? 'storage' : _ref$namespace;
			(0, _classCallCheck3.default)(this, StorerBase);
	
			this.type = type;
			this.namespace = namespace;
			this.storage = this.getStore();
		}
	
		(0, _createClass3.default)(StorerBase, [{
			key: 'switchStore',
			value: function switchStore() {
				var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'local';
	
				this.type = type;
				this.storage = this.getStore();
			}
		}, {
			key: 'getStore',
			value: function getStore() {
				var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.type;
	
				return window[type + 'Storage'];
			}
		}, {
			key: 'toggleStore',
			value: function toggleStore() {
				return this.getStore(this.type === 'local' ? 'session' : 'local');
			}
		}, {
			key: 'set',
			value: function set() {
				var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
				this.storage.setItem(this.namespace, (0, _stringify2.default)(data));
	
				/*if(utils.size(data) === 0) {
	   	const toggleStore = this.toggleStore();
	   			console.log(toggleStore)
	   			if(toggleStore.getItem(this.namespace)) {
	   		toggleStore.setItem(this.namespace, '');
	   		return this.getContent()
	   	} else {
	   		throw new Error(`[Storage::set()] Not found ${this.namespace} in ${toggleStore}`)
	   	}
	   }*/
	
				return this.getContent();
			}
		}, {
			key: 'get',
			value: function get() {
				var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.namespace;
	
				return this.storage.getItem(namespace);
			}
		}, {
			key: 'getContent',
			value: function getContent() {
				var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.namespace;
	
				var data = this.get(namespace);
				return data ? JSON.parse(data) : undefined;
			}
		}, {
			key: 'has',
			value: function has() {
				var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.namespace;
	
				return !!this.get(namespace);
			}
		}, {
			key: 'remove',
			value: function remove() {
				var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.namespace;
				var type = arguments[1];
	
				this.storage.removeItem(namespace);
			}
		}, {
			key: 'removeBoth',
			value: function removeBoth() {
				var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.namespace;
				var type = arguments[1];
	
				this.storage.removeItem(namespace);
	
				var toggleStore = this.toggleStore();
	
				if (toggleStore.getItem(namespace)) toggleStore.removeItem(namespace);
			}
		}], [{
			key: 'browserSupportsStorage',
			value: function browserSupportsStorage() {
				try {
					window.localStorage.setItem('foo', 'foo');
					window.localStorage.removeItem('foo');
					return true;
				} catch (e) {
					return false;
				}
			}
		}]);
		return StorerBase;
	}();
	
	exports.default = StorerBase;
	module.exports = exports['default'];


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = { "default": __webpack_require__(73), __esModule: true };


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = { "default": __webpack_require__(75), __esModule: true };


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = { "default": __webpack_require__(78), __esModule: true };


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = { "default": __webpack_require__(79), __esModule: true };


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = { "default": __webpack_require__(80), __esModule: true };


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = { "default": __webpack_require__(81), __esModule: true };


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	"use strict";
	
	exports.__esModule = true;
	
	var _getPrototypeOf = __webpack_require__(40);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _getOwnPropertyDescriptor = __webpack_require__(63);
	
	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);
	
	  if (desc === undefined) {
	    var parent = (0, _getPrototypeOf2.default)(object);
	
	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;
	
	    if (getter === undefined) {
	      return undefined;
	    }
	
	    return getter.call(receiver);
	  }
	};


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(64);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(62);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(45);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }
	
	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(45);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var core  = __webpack_require__(0)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(108);
	module.exports = __webpack_require__(0).Object.assign;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(109);
	var $Object = __webpack_require__(0).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(110);
	var $Object = __webpack_require__(0).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(111);
	var $Object = __webpack_require__(0).Object;
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $Object.getOwnPropertyDescriptor(it, key);
	};


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(112);
	module.exports = __webpack_require__(0).Object.getPrototypeOf;


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(113);
	module.exports = __webpack_require__(0).Object.keys;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(114);
	module.exports = __webpack_require__(0).Object.setPrototypeOf;


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(57);
	__webpack_require__(58);
	__webpack_require__(59);
	__webpack_require__(115);
	module.exports = __webpack_require__(0).Promise;


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(116);
	__webpack_require__(57);
	__webpack_require__(117);
	__webpack_require__(118);
	module.exports = __webpack_require__(0).Symbol;


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(58);
	__webpack_require__(59);
	module.exports = __webpack_require__(36).f('iterator');


/***/ },
/* 82 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = function(){ /* empty */ };


/***/ },
/* 83 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(7)
	  , toLength  = __webpack_require__(56)
	  , toIndex   = __webpack_require__(105);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(12)
	  , gOPS    = __webpack_require__(29)
	  , pIE     = __webpack_require__(17);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var ctx         = __webpack_require__(14)
	  , call        = __webpack_require__(90)
	  , isArrayIter = __webpack_require__(88)
	  , anObject    = __webpack_require__(3)
	  , toLength    = __webpack_require__(56)
	  , getIterFn   = __webpack_require__(106)
	  , BREAK       = {}
	  , RETURN      = {};
	var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator, result;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if(result === BREAK || result === RETURN)return result;
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    result = call(iterator, f, step.value, entries);
	    if(result === BREAK || result === RETURN)return result;
	  }
	};
	exports.BREAK  = BREAK;
	exports.RETURN = RETURN;


/***/ },
/* 87 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// check on default Array iterator
	var Iterators  = __webpack_require__(15)
	  , ITERATOR   = __webpack_require__(1)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(13);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(3);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	'use strict';
	var create         = __webpack_require__(27)
	  , descriptor     = __webpack_require__(18)
	  , setToStringTag = __webpack_require__(19)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(9)(IteratorPrototype, __webpack_require__(1)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var ITERATOR     = __webpack_require__(1)('iterator')
	  , SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	
	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};


/***/ },
/* 93 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var getKeys   = __webpack_require__(12)
	  , toIObject = __webpack_require__(7);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var META     = __webpack_require__(21)('meta')
	  , isObject = __webpack_require__(11)
	  , has      = __webpack_require__(8)
	  , setDesc  = __webpack_require__(6).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(10)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var global    = __webpack_require__(2)
	  , macrotask = __webpack_require__(55).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(13)(process) == 'process';
	
	module.exports = function(){
	  var head, last, notify;
	
	  var flush = function(){
	    var parent, fn;
	    if(isNode && (parent = process.domain))parent.exit();
	    while(head){
	      fn   = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch(e){
	        if(head)notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if(parent)parent.enter();
	  };
	
	  // Node.js
	  if(isNode){
	    notify = function(){
	      process.nextTick(flush);
	    };
	  // browsers with MutationObserver
	  } else if(Observer){
	    var toggle = true
	      , node   = document.createTextNode('');
	    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	    notify = function(){
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if(Promise && Promise.resolve){
	    var promise = Promise.resolve();
	    notify = function(){
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function(){
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }
	
	  return function(fn){
	    var task = {fn: fn, next: undefined};
	    if(last)last.next = task;
	    if(!head){
	      head = task;
	      notify();
	    } last = task;
	  };
	};


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(12)
	  , gOPS     = __webpack_require__(29)
	  , pIE      = __webpack_require__(17)
	  , toObject = __webpack_require__(20)
	  , IObject  = __webpack_require__(49)
	  , $assign  = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(10)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var dP       = __webpack_require__(6)
	  , anObject = __webpack_require__(3)
	  , getKeys  = __webpack_require__(12);
	
	module.exports = __webpack_require__(4) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(7)
	  , gOPN      = __webpack_require__(51).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};
	


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var hide = __webpack_require__(9);
	module.exports = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(11)
	  , anObject = __webpack_require__(3);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(14)(Function.call, __webpack_require__(28).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	'use strict';
	var global      = __webpack_require__(2)
	  , core        = __webpack_require__(0)
	  , dP          = __webpack_require__(6)
	  , DESCRIPTORS = __webpack_require__(4)
	  , SPECIES     = __webpack_require__(1)('species');
	
	module.exports = function(KEY){
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(3)
	  , aFunction = __webpack_require__(23)
	  , SPECIES   = __webpack_require__(1)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var toInteger = __webpack_require__(33)
	  , defined   = __webpack_require__(24);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var toInteger = __webpack_require__(33)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var classof   = __webpack_require__(46)
	  , ITERATOR  = __webpack_require__(1)('iterator')
	  , Iterators = __webpack_require__(15);
	module.exports = __webpack_require__(0).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	'use strict';
	var addToUnscopables = __webpack_require__(82)
	  , step             = __webpack_require__(93)
	  , Iterators        = __webpack_require__(15)
	  , toIObject        = __webpack_require__(7);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(50)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(5);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(97)});


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var $export = __webpack_require__(5)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(27)});


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	var $export = __webpack_require__(5);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(4), 'Object', {defineProperty: __webpack_require__(6).f});


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject                 = __webpack_require__(7)
	  , $getOwnPropertyDescriptor = __webpack_require__(28).f;
	
	__webpack_require__(30)('getOwnPropertyDescriptor', function(){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(20)
	  , $getPrototypeOf = __webpack_require__(52);
	
	__webpack_require__(30)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(20)
	  , $keys    = __webpack_require__(12);
	
	__webpack_require__(30)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(5);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(101).set});


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	'use strict';
	var LIBRARY            = __webpack_require__(16)
	  , global             = __webpack_require__(2)
	  , ctx                = __webpack_require__(14)
	  , classof            = __webpack_require__(46)
	  , $export            = __webpack_require__(5)
	  , isObject           = __webpack_require__(11)
	  , aFunction          = __webpack_require__(23)
	  , anInstance         = __webpack_require__(83)
	  , forOf              = __webpack_require__(86)
	  , speciesConstructor = __webpack_require__(103)
	  , task               = __webpack_require__(55).set
	  , microtask          = __webpack_require__(96)()
	  , PROMISE            = 'Promise'
	  , TypeError          = global.TypeError
	  , process            = global.process
	  , $Promise           = global[PROMISE]
	  , process            = global.process
	  , isNode             = classof(process) == 'process'
	  , empty              = function(){ /* empty */ }
	  , Internal, GenericPromiseCapability, Wrapper;
	
	var USE_NATIVE = !!function(){
	  try {
	    // correct subclassing with @@species support
	    var promise     = $Promise.resolve(1)
	      , FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function(exec){ exec(empty, empty); };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch(e){ /* empty */ }
	}();
	
	// helpers
	var sameConstructor = function(a, b){
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function(C){
	  return sameConstructor($Promise, C)
	    ? new PromiseCapability(C)
	    : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject  = aFunction(reject);
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(promise, isReject){
	  if(promise._n)return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function(){
	    var value = promise._v
	      , ok    = promise._s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , domain  = reaction.domain
	        , result, then;
	      try {
	        if(handler){
	          if(!ok){
	            if(promise._h == 2)onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if(handler === true)result = value;
	          else {
	            if(domain)domain.enter();
	            result = handler(value);
	            if(domain)domain.exit();
	          }
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if(isReject && !promise._h)onUnhandled(promise);
	  });
	};
	var onUnhandled = function(promise){
	  task.call(global, function(){
	    var value = promise._v
	      , abrupt, handler, console;
	    if(isUnhandled(promise)){
	      abrupt = perform(function(){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if(abrupt)throw abrupt.error;
	  });
	};
	var isUnhandled = function(promise){
	  if(promise._h == 1)return false;
	  var chain = promise._a || promise._c
	    , i     = 0
	    , reaction;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
	  } return true;
	};
	var onHandleUnhandled = function(promise){
	  task.call(global, function(){
	    var handler;
	    if(isNode){
	      process.emit('rejectionHandled', promise);
	    } else if(handler = global.onrejectionhandled){
	      handler({promise: promise, reason: promise._v});
	    }
	  });
	};
	var $reject = function(value){
	  var promise = this;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if(!promise._a)promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function(value){
	  var promise = this
	    , then;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if(promise === value)throw TypeError("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      microtask(function(){
	        var wrapper = {_w: promise, _d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch(e){
	    $reject.call({_w: promise, _d: false}, e); // wrap
	  }
	};
	
	// constructor polyfill
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor){
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch(err){
	      $reject.call(this, err);
	    }
	  };
	  Internal = function Promise(executor){
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__(100)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail   = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if(this._a)this._a.push(reaction);
	      if(this._s)notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	  PromiseCapability = function(){
	    var promise  = new Internal;
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject  = ctx($reject, promise, 1);
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
	__webpack_require__(19)($Promise, PROMISE);
	__webpack_require__(102)(PROMISE);
	Wrapper = __webpack_require__(0)[PROMISE];
	
	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = newPromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
	    var capability = newPromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(92)(function(iter){
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      var values    = []
	        , index     = 0
	        , remaining = 1;
	      forOf(iterable, false, function(promise){
	        var $index        = index++
	          , alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled  = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(2)
	  , has            = __webpack_require__(8)
	  , DESCRIPTORS    = __webpack_require__(4)
	  , $export        = __webpack_require__(5)
	  , redefine       = __webpack_require__(54)
	  , META           = __webpack_require__(95).KEY
	  , $fails         = __webpack_require__(10)
	  , shared         = __webpack_require__(32)
	  , setToStringTag = __webpack_require__(19)
	  , uid            = __webpack_require__(21)
	  , wks            = __webpack_require__(1)
	  , wksExt         = __webpack_require__(36)
	  , wksDefine      = __webpack_require__(35)
	  , keyOf          = __webpack_require__(94)
	  , enumKeys       = __webpack_require__(85)
	  , isArray        = __webpack_require__(89)
	  , anObject       = __webpack_require__(3)
	  , toIObject      = __webpack_require__(7)
	  , toPrimitive    = __webpack_require__(34)
	  , createDesc     = __webpack_require__(18)
	  , _create        = __webpack_require__(27)
	  , gOPNExt        = __webpack_require__(99)
	  , $GOPD          = __webpack_require__(28)
	  , $DP            = __webpack_require__(6)
	  , $keys          = __webpack_require__(12)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(51).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(17).f  = $propertyIsEnumerable;
	  __webpack_require__(29).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(16)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(9)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(35)('asyncIterator');


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	__webpack_require__(35)('observable');


/***/ },
/* 119 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_119__;

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(60);


/***/ }
/******/ ])
});
;
//# sourceMappingURL=storer.js.map