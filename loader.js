/**
 * @copyright 2015, Andrey Popp
 */

var vm = require('vm');

function styling(content) {
  var exports = {};
  var sandbox = {
    module: {exports: exports},
    exports: exports,
    require: require
  };
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox);

  var stylesheet = [];

  for (var key in sandbox.module.exports) {
    if (sandbox.module.exports.hasOwnProperty(key)) {
      var style = sandbox.module.exports[key];
      if (style && style['@@styling']) {
        var self = {};
        for (var prop in style['@@styling']) {
          if (style['@@styling'].hasOwnProperty(prop)) {
            var value = style['@@styling'][prop];
            value = valueOf(value);
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              stylesheet.push(styleFromObject(key, prop, value));
            } else {
              self[prop] = value;
            }
          }
        }
        stylesheet.push(styleFromObject(key, null, self));
      }
    }
  }

  return stylesheet.join('\n\n');
}

function styleFromObject(name, state, style) {
  var css = '';
  css += ':local(.' + name + (state ? ':' + state : '') + ') {\n';
  for (var prop in style) {
    if (style.hasOwnProperty(prop)) {
      var value = valueOf(style[prop]);
      if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
          css += '  ' + propValueOf(prop) + ': ' + value[i] + ';\n';
        }
      } else {
        css += '  ' + propValueOf(prop) + ': ' + value + ';\n';
      }
    }
  }
  css += '}';
  return css;
}

function valueOf(value) {
  if (value != null) {
    return value.valueOf();
  } else {
    return value;
  }
}

var CAMEL_CASE_TO_DASH_CASE = /([a-z])([A-Z])/g;

function propValueOf(prop) {
  return prop.replace(CAMEL_CASE_TO_DASH_CASE, '$1-$2').toLowerCase();
}

module.exports = styling;
