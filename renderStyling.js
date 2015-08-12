/**
 * @copyright 2013-2015, Facebook, Inc.
 * @copyright 2015, Andrey Popp
 */

var DEFAULT_OPTIONS = {
  local: false
};

function renderStyling(key, styling, options) {
  options = options || DEFAULT_OPTIONS;
  var stylesheet = [];
  var style = styling['@@styling'];
  if (typeof style === 'string') {
    stylesheet.push(style);
  } else {
    var self = {};
    for (var prop in style) {
      if (style.hasOwnProperty(prop)) {
        var value = style[prop];
        value = valueOf(value);
        if (isObject(value)) {
          stylesheet.push(renderStyle(key, prop, value, options));
        } else {
          self[prop] = value;
        }
      }
    }
    stylesheet.unshift(renderStyle(key, null, self, options));
  }
  return stylesheet;
}

function renderStyle(name, state, style, options) {
  var css = '';
  css += renderSelector(name, state, options) + ' {\n';
  for (var prop in style) {
    if (style.hasOwnProperty(prop)) {
      var value = valueOf(style[prop]);
      if (isArray(value)) {
        for (var i = 0; i < value.length; i++) {
          css += '  ' + renderProp(prop, value[i]) + '\n';
        }
      } else {
        css += '  ' + renderProp(prop, value) + '\n';
      }
    }
  }
  css += '}';
  return css;
}

function renderProp(key, value) {
  key = key.replace(CAMEL_CASE_TO_DASH_CASE, '$1-$2').toLowerCase();
  value = valueOf(value);

  var isNonNumeric = isNaN(value);
  if (isNonNumeric || value === 0 ||
      IS_UNITLESS_NUMBER.hasOwnProperty(key) && IS_UNITLESS_NUMBER[key]) {
    value = '' + value;
  } else {
    value = value + 'px';
  }
  return key + ': ' + value + ';';
}

function renderSelector(name, state, options) {
  if (options.local) {
    return ':local(.' + name + (state ? ':' + state : '') + ')';
  } else {
    return '.' + name + (state ? ':' + state : '');
  }
}

function valueOf(value) {
  if (value != null) {
    return value.valueOf();
  } else {
    return value;
  }
}

var toString = Object.prototype.toString;

function isArray(obj) {
  return toString.call(obj) === '[object Array]';
}

function isObject(obj) {
  return obj && typeof obj === 'object' && !isArray(obj);
}

var CAMEL_CASE_TO_DASH_CASE = /([a-z]|^)([A-Z])/g;

var IS_UNITLESS_NUMBER = {
  boxFlex: true,
  boxFlexGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true,
};

module.exports = renderStyling;
