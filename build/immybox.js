/******/ (function(modules) { // webpackBootstrap
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*eslint no-console:0*/
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _utils = __webpack_require__(2);
	
	var event_listeners = new Map();
	
	var defaults = {
	  choices: [],
	  maxResults: 50,
	  showArrow: true,
	  openOnClick: true,
	  defaultSelectedValue: undefined,
	  scroll_behavior: 'smooth',
	  filterFn: function filterFn(query) {
	    var lower_query = query.toLowerCase();
	    return function (choice) {
	      return choice.text.toLowerCase().indexOf(lower_query) >= 0;
	    };
	  },
	  formatChoice: function formatChoice(query) {
	    if (query) {
	      var _ret = (function () {
	        var reg = new RegExp(query.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'gi');
	        return {
	          v: function (choice) {
	            return choice.text.replace(reg, '<span class="highlight">$&</span>');
	          }
	        };
	      })();
	
	      if (typeof _ret === 'object') return _ret.v;
	    } else return function (choice) {
	      return choice.text;
	    };
	  }
	};
	
	var all_objects = new Map();
	
	exports.all_objects = all_objects;
	var plugin_name = 'immybox';
	
	exports.plugin_name = plugin_name;
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
	
	var ImmyBox = (function () {
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
	    this.values = this.choices.map(function (choice) {
	      return choice.value;
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
	      if ((0, _utils.matchesSelector)(event.target, 'li.' + plugin_name + '_choice')) {
	        var value = _this.valueFromElement(event.target);
	        _this.selectChoiceByValue(value);
	        _this.hideResults();
	        _this._val = _this.element.value;
	        _this.element.focus();
	      }
	    }, this.queryResultArea, listeners);
	
	    assignEvent('mouseenter', function (event) {
	      if ((0, _utils.matchesSelector)(event.target, 'li.' + plugin_name + '_choice')) {
	        (0, _utils.addClass)(event.target, 'active');
	        [].concat(_toConsumableArray(_this.queryResultArea.querySelectorAll('li.' + plugin_name + '_choice.active'))).forEach(function (li) {
	          if (li !== event.target) (0, _utils.removeClass)(li, 'active');
	        });
	      }
	    }, this.queryResultArea, listeners);
	
	    assignEvent('keyup', this.doQuery.bind(this), this.element, listeners);
	    assignEvent('change', this.doQuery.bind(this), this.element, listeners);
	    assignEvent('search', this.doQuery.bind(this), this.element, listeners);
	    assignEvent('keydown', this.doSelection.bind(this), this.element, listeners);
	
	    all_objects.set(this.element, this);
	  }
	
	  // on 'keyup', 'change', 'search'
	  // perform a query on the choices
	
	  _createClass(ImmyBox, [{
	    key: 'doQuery',
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
	      if (this.selectedChoice) this.insertFilteredChoiceElements(this.oldQuery);else this.insertFilteredChoiceElements('');
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
	      if (this.queryResultAreaVisible) this.positionResultsArea();
	    }
	  }, {
	    key: 'insertFilteredChoiceElements',
	    value: function insertFilteredChoiceElements(query) {
	      var _this2 = this;
	
	      var filteredChoices = undefined;
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
	        if (this.valueFromElement(results[0]) === this.options.defaultSelectedValue) !selected_one && (0, _utils.addClass)(results[0], 'active');
	      } else {
	        list = document.createElement('p');
	        list.setAttribute('class', plugin_name + '_noresults');
	        list.textContent = 'no matches';
	      }
	      while (this.queryResultArea.lastChild) this.queryResultArea.removeChild(this.queryResultArea.lastChild);
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
	
	      if (results_bottom > window_bottom) this.queryResultArea.style.top = input_offset.top - results_height + 'px';else this.queryResultArea.style.top = input_offset.top + input_height + 'px';
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
	      typeof Event !== 'undefined' && this.element.dispatchEvent(new Event('input'));
	      this._val = this.element.value;
	    }
	
	    // select the first choice with matching value
	    // Note: values should be unique
	  }, {
	    key: 'selectChoiceByValue',
	    value: function selectChoiceByValue(val) {
	      var old_val = this.value;
	      this.selectedChoice = val && this.indexed_choices.find(function (_ref5) {
	        var choice = _ref5.choice;
	
	        return choice.value == val;
	      }) || null;
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
	      return !Number.isNaN(index) ? this.values[index] : undefined;
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
	    key: 'hideResults',
	    value: function hideResults() {
	      this.queryResultAreaVisible && document.body.removeChild(this.queryResultArea);
	      this.queryResultAreaVisible = false;
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
	      var _this4 = this;
	
	      this.choices = newChoices;
	      if (this.options.defaultSelectedValue != null) this.choices = [this.choices.find(function (_ref6) {
	        var value = _ref6.value;
	
	        return value === _this4.options.defaultSelectedValue;
	      })].concat(_toConsumableArray(this.choices.filter(function (_ref7) {
	        var value = _ref7.value;
	
	        return value !== _this4.options.defaultSelectedValue;
	      }))).filter(function (choice) {
	        return choice;
	      });
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
	              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                _iterator2['return']();
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
	          if (!_iteratorNormalCompletion && _iterator['return']) {
	            _iterator['return']();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      (0, _utils.removeClass)(this.element, plugin_name);
	      this.queryResultAreaVisible && this.document.body.removeChild(this.queryResultArea);
	      all_objects['delete'](this.element);
	    }
	  }, {
	    key: 'highlightedChoice',
	    get: function get() {
	      var choice = this.queryResultArea.querySelector('li.' + plugin_name + '_choice.active');
	      return choice || null;
	    }
	  }, {
	    key: 'value',
	    get: function get() {
	      return this.selectedChoice && this.selectedChoice.choice.value || null;
	    },
	
	    // set the value of the currently-selected choice
	    set: function set(new_value) {
	      if (this.value !== new_value) {
	        this.selectChoiceByValue(new_value);
	        this.oldQuery = '';
	      }
	      return this.value;
	    }
	  }], [{
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
	      return ['showResults', 'hideResults', 'getChoices', 'setChoices', 'getValue', 'setValue', 'destroy'];
	    }
	  }]);
	
	  return ImmyBox;
	})();

	exports.ImmyBox = ImmyBox;

/***/ },
/* 2 */
/***/ function(module, exports) {

	// Polyfills
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.assert = assert;
	exports.hasClass = hasClass;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.matchesSelector = matchesSelector;
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
	
	function matchesSelector(element, selector) {
	  if (element.matches) {
	    return element.matches(selector);
	  } else {
	    var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
	    var i = 0;
	    while (matches[i] && matches[i] !== element) i++;
	    return matches[i] ? true : false;
	  }
	}

/***/ }
/******/ ]);
//# sourceMappingURL=immybox.js.map