/**
 * @copyright 2015, Andrey Popp
 */

var deepmerge = require('deepmerge');

var KEY = '@@styling';

function Styling(spec) {
  this[KEY] = spec;
}

Styling.prototype.getSpec = function Styling_getStyle() {
  return this[KEY];
}

Styling.is = function Styling_is(obj) {
  return obj && obj[KEY] !== undefined;
}

module.exports = Styling;
