/*!
 * Immybox.js Version 1.0.0-beta2
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = function _isPlaceholder(a) {
  return a != null &&
         typeof a === 'object' &&
         a['@@functional/placeholder'] === true;
};


/***/ },
/* 1 */
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImmyBox = undefined;

var _forEach = __webpack_require__(3);

var _forEach2 = _interopRequireDefault(_forEach);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utils = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var event_listeners = new Map();

var defaults = {
  choices: [],
  maxResults: 50,
  showArrow: true,
  openOnClick: true,
  defaultSelectedValue: undef,
  scroll_behavior: 'smooth',
  filterFn: function filterFn(query) {
    var lower_query = query.toLowerCase();
    return function (choice) {
      return choice.text.toLowerCase().indexOf(lower_query) >= 0;
    };
  },
  formatChoice: function formatChoice(query) {
    if (query) {
      var _ret = function () {
        var reg = new RegExp(query.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'gi');
        return {
          v: function v(choice) {
            return choice.text.replace(reg, '<span class="highlight">$&</span>');
          }
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    } else return function (choice) {
      return choice.text;
    };
  }
};

var all_objects = new Map();

var plugin_name = 'immybox';

var undef = void 0;

var _noOp = function _noOp() {};

var _dispatchEvent = typeof Event !== 'undefined' ? function (el, name) {
  el.dispatchEvent(new Event(name));
} : _noOp;

function assignEvent(event_name, event_handler, node, listeners) {
  listeners.has(node) || listeners.set(node, new Map());
  listeners.get(node).set(event_name, event_handler);
  node.addEventListener(event_name, event_handler);
}

function getEventListenerMap(plugin) {
  var map = new Map();
  event_listeners.set(plugin, map);
  return map;
}

var ImmyBox = exports.ImmyBox = function () {
  function ImmyBox(element, options) {
    var _this = this;

    _classCallCheck(this, ImmyBox);

    (0, _utils.addClass)(element, plugin_name);
    element.setAttribute('autocomplete', 'off');

    var listeners = getEventListenerMap(this);

    this.element = element;
    this.options = Object.assign({}, ImmyBox.defaults, options);
    this.choices = this.options.choices;
    if (this.options.defaultSelectedValue != null) this.choices = [this.choices.find(function (_ref) {
      var value = _ref.value;

      return value === _this.options.defaultSelectedValue;
    })].concat(_toConsumableArray(this.choices.filter(function (_ref2) {
      var value = _ref2.value;

      return value !== _this.options.defaultSelectedValue;
    }))).filter(function (choice) {
      return choice;
    });
    this.indexed_choices = this.choices.map(function (choice, index) {
      return { index: index, choice: choice };
    });
    this.selectedChoice = null;

    if (this.options.showArrow) (0, _utils.addClass)(this.element, plugin_name + '_witharrow');

    this.selectChoiceByValue(this.element.value);

    this.queryResultArea = document.createElement('div');
    (0, _utils.addClass)(this.queryResultArea, plugin_name + '_results');
    this.queryResultAreaVisible = false;

    this._val = this.element.value;
    this.oldQuery = this.element.value;

    if (this.options.openOnClick) assignEvent('click', this.openResults.bind(this), this.element, listeners);

    assignEvent('click', function (event) {
      var node = (0, _utils.nodeOrParentMatchingSelector)(event.target, 'li.' + plugin_name + '_choice');
      if (node) {
        var value = _this.valueFromElement(node);
        _this.selectChoiceByValue(value);
        _this.hideResults();
        _this._val = _this.element.value;
        _this.element.focus();
      }
    }, this.queryResultArea, listeners);

    assignEvent('mouseenter', function (event) {
      var node = (0, _utils.nodeOrParentMatchingSelector)(event.target, 'li.' + plugin_name + '_choice');
      if (node) {
        (0, _utils.addClass)(node, 'active');
        (0, _forEach2.default)(function (li) {
          return li !== node && (0, _utils.removeClass)(li, 'active');
        }, _this.queryResultArea.querySelectorAll('li.' + plugin_name + '_choice.active'));
      }
    }, this.queryResultArea, listeners);

    assignEvent('keyup', this.doQuery.bind(this), this.element, listeners);
    assignEvent('change', this.doQuery.bind(this), this.element, listeners);
    assignEvent('search', this.doQuery.bind(this), this.element, listeners);
    assignEvent('keydown', this.doSelection.bind(this), this.element, listeners);

    all_objects.set(this.element, this);
  }

  _createClass(ImmyBox, [{
    key: 'doQuery',


    // on 'keyup', 'change', 'search'
    // perform a query on the choices
    value: function doQuery() {
      var query = this.element.value;
      if (this._val !== query) {
        this._val = query;
        this.oldQuery = query;
        if (query) {
          this.insertFilteredChoiceElements(query);
        } else {
          this.hideResults();
          this.selectChoiceByValue(null);
        }
      }
    }

    // on 'keydown'
    // select the highlighted choice

  }, {
    key: 'doSelection',
    value: function doSelection(event) {
      if (event.which === 27) {
        // escape key
        this.display();
        this.hideResults();
      }
      if (this.queryResultAreaVisible) {
        switch (event.which) {
          case 9:
            // tab
            this.selectHighlightedChoice();
            break;
          case 13:
            // enter
            event.preventDefault();
            this.selectHighlightedChoice();
            break;
          case 38:
            // up
            event.preventDefault();
            this.highlightPreviousChoice();
            this.scroll();
            break;
          case 40:
            // down
            event.preventDefault();
            this.highlightNextChoice();
            this.scroll();
            break;
        }
      } else {
        switch (event.which) {
          case 40:
            // down
            event.preventDefault();
            if (this.selectedChoice) this.insertFilteredChoiceElements(this.oldQuery);else this.insertFilteredChoiceElements('');
            break;
          case 9:
            // tab
            this.revert();
            break;
        }
      }
    }

    // on 'click'
    // show the results box

  }, {
    key: 'openResults',
    value: function openResults(event) {
      event.cancelBubble = true;
      event.stopPropogation && event.stopPropogation();
      this.revertOtherInstances();
      if (this.selectedChoice) {
        this.insertFilteredChoiceElements(this.oldQuery);
      } else {
        this.insertFilteredChoiceElements('');
      }
    }

    // revert or set to null after losing focus

  }, {
    key: 'revert',
    value: function revert() {
      if (this.queryResultAreaVisible) {
        this.display();
        this.hideResults();
      } else if (this.element.value === '') this.selectChoiceByValue(null);
    }

    // if visible, reposition the results area on window resize

  }, {
    key: 'reposition',
    value: function reposition() {
      this.queryResultAreaVisible && this.positionResultsArea();
    }
  }, {
    key: 'insertFilteredChoiceElements',
    value: function insertFilteredChoiceElements(query) {
      var _this2 = this;

      var filteredChoices = void 0;
      if (query === '') filteredChoices = this.indexed_choices;else {
        (function () {
          var filter = _this2.options.filterFn(query);
          filteredChoices = _this2.indexed_choices.filter(function (_ref3, index) {
            var choice = _ref3.choice;
            return filter(choice, index);
          });
        })();
      }
      var truncatedChoices = filteredChoices.slice(0, this.options.maxResults);
      if (this.defaultSelectedChoice) {
        if (filteredChoices.indexOf(this.defaultSelectedChoice) >= 0) {
          if (truncatedChoices.indexOf(this.defaultSelectedChoice) === -1) {
            truncatedChoices.unshift(this.defaultSelectedChoice);
            truncatedChoices.pop();
          } else {
            truncatedChoices = truncatedChoices.filter(function (c) {
              return c.choice.value !== _this2.defaultSelectedChoice.value;
            });
            truncatedChoices.unshift(this.defaultSelectedChoice);
          }
        }
      }
      var formatter = this.options.formatChoice(query);
      var selected_one = false;
      var list = document.createElement('ul');
      var results = truncatedChoices.map(function (_ref4) {
        var choice = _ref4.choice;
        var index = _ref4.index;

        var li = document.createElement('li');
        li.setAttribute('class', plugin_name + '_choice');
        li.setAttribute('data-immybox-value-index', index);
        li.innerHTML = formatter(choice);
        if (_this2.selectedChoice && index === _this2.selectedChoice.index) {
          selected_one = true;
          (0, _utils.addClass)(li, 'active');
        }
        list.appendChild(li);
        return li;
      });
      if (results.length) {
        !selected_one && (0, _utils.addClass)(results[0], 'active');
      } else {
        list = document.createElement('p');
        list.setAttribute('class', plugin_name + '_noresults');
        list.textContent = 'no matches';
      }

      while (this.queryResultArea.lastChild) {
        this.queryResultArea.removeChild(this.queryResultArea.lastChild);
      }
      this.queryResultArea.appendChild(list);
      this.showResults();
    }
  }, {
    key: 'scroll',
    value: function scroll() {
      this.highlightedChoice && this.highlightedChoice.scrollIntoView({
        behavior: this.options.scroll_behavior
      });
    }
  }, {
    key: 'positionResultsArea',
    value: function positionResultsArea() {
      var input_offset = this.element.getBoundingClientRect();
      var input_height = this.element.clientHeight;
      var input_width = this.element.clientWidth;
      var results_height = this.queryResultArea.clientHeight;
      var results_bottom = input_offset.top + input_height + results_height;
      var window_bottom = window.clientHeight + window.scrollTop;

      // set the dimmensions and position
      this.queryResultArea.style.width = input_width + 'px';
      this.queryResultArea.style.left = input_offset.left + 'px';

      if (results_bottom > window_bottom) {
        this.queryResultArea.style.top = input_offset.top - results_height + 'px';
      } else {
        this.queryResultArea.style.top = input_offset.top + input_height + 'px';
      }
    }
  }, {
    key: 'highlightNextChoice',
    value: function highlightNextChoice() {
      var highlighted_choice = this.highlightedChoice;
      if (highlighted_choice) {
        var next_choice = highlighted_choice.nextSibling;
        if (next_choice) {
          (0, _utils.removeClass)(highlighted_choice, 'active');
          (0, _utils.addClass)(next_choice, 'active');
        }
      } else {
        var choice = this.queryResultArea.querySelector('li.' + plugin_name + '_choice');
        if (choice) (0, _utils.addClass)(choice, 'active');
      }
    }
  }, {
    key: 'highlightPreviousChoice',
    value: function highlightPreviousChoice() {
      var highlighted_choice = this.highlightedChoice;
      if (highlighted_choice) {
        var prev_choice = highlighted_choice.previousSibling;
        if (prev_choice) {
          (0, _utils.removeClass)(highlighted_choice, 'active');
          (0, _utils.addClass)(prev_choice, 'active');
        }
      } else {
        var choice = this.queryResultArea.querySelector('li.' + plugin_name + '_choice:last-child');
        if (choice) (0, _utils.addClass)(choice, 'active');
      }
    }
  }, {
    key: 'selectHighlightedChoice',
    value: function selectHighlightedChoice() {
      var highlighted_choice = this.highlightedChoice;
      if (highlighted_choice) {
        this.selectChoiceByValue(this.valueFromElement(highlighted_choice));
        this.hideResults();
      } else this.revert();
    }

    // display the selected choice in the input box

  }, {
    key: 'display',
    value: function display() {
      this.element.value = this.selectedChoice && this.selectedChoice.choice.text || '';
      _dispatchEvent(this.element, 'input');
      this._val = this.element.value;
    }

    // select the first choice with matching value (matching is done via the threequals comparison)
    // Note: values should be unique

  }, {
    key: 'selectChoiceByValue',
    value: function selectChoiceByValue(val) {
      var old_val = this.value;
      if (typeof val === 'undefined') {
        this.selectedChoice = undef;
      } else {
        this.selectedChoice = this.indexed_choices.find(function (_ref5) {
          var choice = _ref5.choice;
          return choice.value === val;
        });
      }
      var new_val = this.value;
      new_val !== old_val && this.element.dispatchEvent(new CustomEvent('update', {
        detail: new_val
      }));
      this.display();
    }
  }, {
    key: 'revertOtherInstances',
    value: function revertOtherInstances() {
      var _this3 = this;

      all_objects.forEach(function (plugin) {
        return plugin !== _this3 && plugin.revert();
      });
    }
  }, {
    key: 'valueFromElement',
    value: function valueFromElement(element) {
      var index = parseInt(element.getAttribute('data-immybox-value-index'));
      return !Number.isNaN(index) ? this.values[index] : undef;
    }

    // public methods

  }, {
    key: 'showResults',
    value: function showResults() {
      !this.queryResultAreaVisible && document.body.appendChild(this.queryResultArea);
      this.queryResultAreaVisible = true;
      this.scroll();
      this.positionResultsArea();
    }
  }, {
    key: 'open',
    value: function open() {
      return this.showResults();
    }
  }, {
    key: 'hideResults',
    value: function hideResults() {
      this.queryResultAreaVisible && document.body.removeChild(this.queryResultArea);
      this.queryResultAreaVisible = false;
    }
  }, {
    key: 'close',
    value: function close() {
      return this.hideResults();
    }

    // return array of choices

  }, {
    key: 'getChoices',
    value: function getChoices() {
      return this.choices;
    }
  }, {
    key: 'setChoices',
    value: function setChoices(newChoices) {
      this.choices = newChoices;
      var default_selected_value = this.options.defaultSelectedValue;
      if (default_selected_value != null) {
        this.choices = [this.choices.find(function (_ref6) {
          var value = _ref6.value;
          return value === default_selected_value;
        })].concat(_toConsumableArray(this.choices.filter(function (_ref7) {
          var value = _ref7.value;
          return value !== default_selected_value;
        }))).filter(function (choice) {
          return choice;
        });
      }
      this.indexed_choices = this.choices.map(function (choice, index) {
        return { choice: choice, index: index };
      });
      this.selectedChoice && this.selectChoiceByValue(this.selectedChoice.choice.value);
      this.oldQuery = '';
      return this.choices;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.value;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.value = value;
    }
  }, {
    key: 'unsetValue',
    value: function unsetValue() {
      if (typeof this.value !== 'undefined') {
        this.value = undef;
      }
    }

    // get the value of the currently-selected choice

  }, {
    key: 'destroy',


    // destroy this instance of the plugin
    value: function destroy() {
      // remove event listeners
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = event_listeners.get(this)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var node = _step$value[0];
          var events = _step$value[1];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _step2$value = _slicedToArray(_step2.value, 2);

              var event_name = _step2$value[0];
              var handler = _step2$value[1];

              node.removeEventListener(event_name, handler);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      (0, _utils.removeClass)(this.element, plugin_name);
      this.queryResultAreaVisible && document.body.removeChild(this.queryResultArea);
      all_objects.delete(this.element);
    }
  }, {
    key: 'values',
    get: function get() {
      return this.choices.map(function (choice) {
        return choice.value;
      });
    }
  }, {
    key: 'highlightedChoice',
    set: function set(choice) {
      var highlightedChoice = this.highlightedChoice;
      if (highlightedChoice) {
        (0, _utils.removeClass)(highlightedChoice, 'active');
        (0, _utils.addClass)(choice, 'active');
      }
    },
    get: function get() {
      var choice = this.queryResultArea.querySelector('li.' + plugin_name + '_choice.active');
      return choice || null;
    }
  }, {
    key: 'value',
    get: function get() {
      return this.selectedChoice && this.selectedChoice.choice.value;
    }

    // set the value of the currently-selected choice
    ,
    set: function set(new_value) {
      if (this.value !== new_value) {
        this.selectChoiceByValue(new_value);
        this.oldQuery = '';
      }
      return this.value;
    }
  }], [{
    key: 'pluginForElement',
    value: function pluginForElement(element) {
      return all_objects.get(element);
    }
  }, {
    key: 'repositionAll',
    value: function repositionAll() {
      window.requestAnimationFrame(function () {
        all_objects.forEach(function (plugin) {
          plugin.queryResultAreaVisible && plugin.reposition();
        });
      });
    }
  }, {
    key: 'revertAll',
    value: function revertAll() {
      all_objects.forEach(function (plugin) {
        return plugin.revert();
      });
    }
  }, {
    key: 'repositionWhenScrolling',
    value: function repositionWhenScrolling(container) {
      // use one global scoll listener to reposition any result areas that are open
      container.addEventListener('scroll', ImmyBox.repositionAll);
    }
  }, {
    key: 'defaults',
    set: function set(new_defaults) {
      Object.assign(defaults, new_defaults);
    },
    get: function get() {
      return defaults;
    }
  }, {
    key: 'pluginMethods',
    get: function get() {
      return ['showResults', 'open', 'hideResults', 'close', 'getChoices', 'setChoices', 'getValue', 'setValue', 'destroy'];
    }
  }, {
    key: 'all_objects',
    get: function get() {
      return all_objects;
    }
  }, {
    key: 'plugin_name',
    get: function get() {
      return plugin_name;
    }
  }]);

  return ImmyBox;
}();

// use one global click event listener to close/revert ones that are open


document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('click', ImmyBox.revertAll);
  // use one global resize listener to reposition any result areas that are open
  window.addEventListener('resize', ImmyBox.repositionAll);
});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var _checkForMethod = __webpack_require__(4);
var _curry2 = __webpack_require__(6);


/**
 * Iterate over an input `list`, calling a provided function `fn` for each
 * element in the list.
 *
 * `fn` receives one argument: *(value)*.
 *
 * Note: `R.forEach` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.forEach` method. For more
 * details on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
 *
 * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns
 * the original array. In some libraries this function is named `each`.
 *
 * Dispatches to the `forEach` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> *) -> [a] -> [a]
 * @param {Function} fn The function to invoke. Receives one argument, `value`.
 * @param {Array} list The list to iterate over.
 * @return {Array} The original list.
 * @see R.addIndex
 * @example
 *
 *      var printXPlusFive = x => console.log(x + 5);
 *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
 *      //-> 6
 *      //-> 7
 *      //-> 8
 */
module.exports = _curry2(_checkForMethod('forEach', function forEach(fn, list) {
  var len = list.length;
  var idx = 0;
  while (idx < len) {
    fn(list[idx]);
    idx += 1;
  }
  return list;
}));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var _isArray = __webpack_require__(7);
var _slice = __webpack_require__(8);


/**
 * Similar to hasMethod, this checks whether a function has a [methodname]
 * function. If it isn't an array it will execute that function otherwise it
 * will default to the ramda implementation.
 *
 * @private
 * @param {Function} fn ramda implemtation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */
module.exports = function _checkForMethod(methodname, fn) {
  return function() {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return (_isArray(obj) || typeof obj[methodname] !== 'function') ?
      fn.apply(this, arguments) :
      obj[methodname].apply(obj, _slice(arguments, 0, length - 1));
  };
};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

var _isPlaceholder = __webpack_require__(0);


/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(5);
var _isPlaceholder = __webpack_require__(0);


/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2
             : _curry1(function(_b) { return fn(a, _b); });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2
             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b); })
             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b); })
             : fn(a, b);
    }
  };
};


/***/ },
/* 7 */
/***/ function(module, exports) {

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
module.exports = Array.isArray || function _isArray(val) {
  return (val != null &&
          val.length >= 0 &&
          Object.prototype.toString.call(val) === '[object Array]');
};


/***/ },
/* 8 */
/***/ function(module, exports) {

/**
 * An optimized, private array `slice` implementation.
 *
 * @private
 * @param {Arguments|Array} args The array or arguments object to consider.
 * @param {Number} [from=0] The array index to slice from, inclusive.
 * @param {Number} [to=args.length] The array index to slice to, exclusive.
 * @return {Array} A new, sliced array.
 * @example
 *
 *      _slice([1, 2, 3, 4, 5], 1, 3); //=> [2, 3]
 *
 *      var firstThreeArgs = function(a, b, c, d) {
 *        return _slice(arguments, 0, 3);
 *      };
 *      firstThreeArgs(1, 2, 3, 4); //=> [1, 2, 3]
 */
module.exports = function _slice(args, from, to) {
  switch (arguments.length) {
    case 1: return _slice(args, 0, args.length);
    case 2: return _slice(args, from, args.length);
    default:
      var list = [];
      var idx = 0;
      var len = Math.max(0, Math.min(args.length, to) - from);
      while (idx < len) {
        list[idx] = args[from + idx];
        idx += 1;
      }
      return list;
  }
};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _immybox = __webpack_require__(2);

var _utils = __webpack_require__(1);

/*eslint no-console:0*/
(function ($) {
  $.fn.immybox = function (options) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var outputs = [];
    this.each(function (i, element) {
      var plugin = _immybox.ImmyBox.all_objects.get(element);
      if (plugin) {
        // calling a method on a pre-immyboxed element
        (0, _utils.assert)(typeof options === 'string', _immybox.ImmyBox.plugin_name + ' already intitialized for this element');
        (0, _utils.assert)(_immybox.ImmyBox.pluginMethods.includes(options), _immybox.ImmyBox.plugin_name + ' has no method \'' + options + '\'');
        outputs.push(plugin[options].apply(plugin, args));
      } else {
        new _immybox.ImmyBox(element, options);
      }
    });
    return outputs.length ? outputs.length === 1 ? outputs[0] : outputs : this;
  };
})(jQuery);

/***/ }
/******/ ])
});
;
//# sourceMappingURL=jquery.immybox.js.map