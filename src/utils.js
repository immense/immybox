// Polyfills
Number.isNaN = Number.isNaN || function(value) {
  return typeof value === "number" && isNaN(value);
}
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

// Exported utility methods
export function assert(bool, message) {
  if (!bool) throw new Error(message);
}

export function hasClass(element, class_name) {
  return !!element.className.match(new RegExp(`(\\s|^)${class_name}(\\s|$)`));
},
export function addClass(element, class_name) {
  if (!hasClass(element, class_name)) element.className += ` ${class_name}`;
},
export function removeClass(element, class_name) {
  if (hasClass(element, class_name)) {
    var reg = new RegExp(`(\\s|^)${class_name}(\\s|$)`);
    element.className = element.className.replace(reg, ' ');
  }
},
export function matchesSelector(element, selector) {
  if (element.matches) {
    return element.matches(selector);
  } else {
    let matches = (element.document || element.ownerDocument).querySelectorAll(selector),
        i = 0;
    while (matches[i] && matches[i] !== element) i++;
    return matches[i] ? true : false;
  }
}
