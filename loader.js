/**
 * @copyright 2015, Andrey Popp
 */

var vm            = require('vm');
var Styling       = require('./Styling');
var renderStyling = require('./renderStyling');

function styling(content) {
	if(this.cacheable) {
	  this.cacheable();
	}

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
      var keyStylesheet = [];
      var styling = sandbox.module.exports[key];
      if (Styling.is(styling)) {
        stylesheet = stylesheet.concat(renderStyling(key, styling, {local: true}));
      }
    }
  }

  return stylesheet.join('\n\n');
}

module.exports = styling;
