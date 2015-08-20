/**
 * @copyright 2013-2015, Facebook, Inc.
 * @copyright 2015, Andrey Popp
 */

function renderStyling(key, styling) {
  var stylesheet = [];
  var spec = styling.getSpec();
  if (typeof spec === 'string') {
    stylesheet.push(spec);
  } else {
    var self = {};
    for (var prop in spec) {
      if (spec.hasOwnProperty(prop)) {
        var value = spec[prop];
        value = valueOf(value);
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          stylesheet.push(renderStyle(key, prop, value));
        } else {
          self[prop] = value;
        }
      }
    }
    stylesheet.unshift(renderStyle(key, null, self));
  }
  return stylesheet;
}

function renderStyle(name, state, style) {
  var css = '';
  css += renderSelector(name, state) + ' {\n';
  for (var prop in style) {
    if (style.hasOwnProperty(prop)) {
      var value = valueOf(style[prop]);
      if (Array.isArray(value)) {
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
  value = valueOf(value);

  var isNonNumeric = isNaN(value);
  if (isNonNumeric || value === 0 ||
      IS_UNITLESS_NUMBER.hasOwnProperty(key) && IS_UNITLESS_NUMBER[key]) {
    value = '' + value;
  } else {
    value = value + 'px';
  }
  key = key.replace(CAMEL_CASE_TO_DASH_CASE, '$1-$2').toLowerCase();
  return key + ': ' + value + ';';
}

function renderSelector(name, state) {
  return ':local(.' + name + (state ? ':' + state : '') + ')';
}

function valueOf(value) {
  if (value != null) {
    return value.valueOf();
  } else {
    return value;
  }
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
