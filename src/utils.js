/*eslint no-console:0*/
// Polyfills
Number.isNaN = Number.isNaN || function(value) {
  return typeof value === 'number' && isNaN(value);
};
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
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
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
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
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

// Exported utility methods
export function assert(bool, message) {
  if (!bool) throw new Error(message);
}

export function hasClass(element, class_name) {
  return !!element.className.match(new RegExp(`(\\s|^)${class_name}(\\s|$)`));
}
export function addClass(element, class_name) {
  if (!hasClass(element, class_name)) element.className += ` ${class_name}`;
}
export function removeClass(element, class_name) {
  if (hasClass(element, class_name)) {
    var reg = new RegExp(`(\\s|^)${class_name}(\\s|$)`);
    element.className = element.className.replace(reg, ' ');
  }
}

function parentNodeMatchingSelector(element, selector) {
  if (!element.parentNode || !element.parentNode.matches) return null;
  if (element.parentNode.matches(selector)) return element.parentNode;
  return parentNodeMatchingSelector(element.parentNode, selector);
}

export function nodeOrParentMatchingSelector(element, selector) {
  if (element.matches && element.matches(selector)) return element;
  return parentNodeMatchingSelector(element, selector);
}
