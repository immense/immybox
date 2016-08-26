(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("ImmyBox"));
	else if(typeof define === 'function' && define.amd)
		define(["ImmyBox"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("ImmyBox")) : factory(root["ImmyBox"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assert = assert;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.nodeOrParentMatchingSelector = nodeOrParentMatchingSelector;
/*eslint no-console:0*/
// Polyfills
Number.isNaN = Number.isNaN || function (value) {
  return typeof value === 'number' && isNaN(value);
};
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement /*, fromIndex*/) {
    'use strict';

    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {
        k = 0;
      }
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
        return true;
      }
      k++;
    }
    return false;
  };
}

// Exported utility methods
function assert(bool, message) {
  if (!bool) throw new Error(message);
}

function hasClass(element, class_name) {
  return !!element.className.match(new RegExp('(\\s|^)' + class_name + '(\\s|$)'));
}
function addClass(element, class_name) {
  if (!hasClass(element, class_name)) element.className += ' ' + class_name;
}
function removeClass(element, class_name) {
  if (hasClass(element, class_name)) {
    var reg = new RegExp('(\\s|^)' + class_name + '(\\s|$)');
    element.className = element.className.replace(reg, ' ');
  }
}

function parentNodeMatchingSelector(element, selector) {
  if (!element.parentNode || !element.parentNode.matches) return null;
  if (element.parentNode.matches(selector)) return element.parentNode;
  return parentNodeMatchingSelector(element.parentNode, selector);
}

function nodeOrParentMatchingSelector(element, selector) {
  if (element.matches && element.matches(selector)) return element;
  return parentNodeMatchingSelector(element, selector);
}

/***/ },

/***/ 10:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _immybox = __webpack_require__(3);

var _immybox2 = _interopRequireDefault(_immybox);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint no-console:0*/
(function ($) {
  $.fn.immybox = function (options) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var outputs = [];
    this.each(function (i, element) {
      var plugin = _immybox2.default.all_objects.get(element);
      if (plugin) {
        // calling a method on a pre-immyboxed element
        (0, _utils.assert)(typeof options === 'string', _immybox2.default.plugin_name + ' already intitialized for this element');
        (0, _utils.assert)(_immybox2.default.pluginMethods.includes(options), _immybox2.default.plugin_name + ' has no method \'' + options + '\'');
        outputs.push(plugin[options].apply(plugin, args));
      } else {
        new _immybox2.default(element, Object.assign({}, $.fn.immybox.defaults, options));
      }
    });
    return outputs.length ? outputs.length === 1 ? outputs[0] : outputs : this;
  };
  $.fn.immybox.defaults = {};
})(jQuery);

/***/ },

/***/ 3:
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }

/******/ })
});
;