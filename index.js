/**
 * @copyright 2015, Andrey Popp
 */

var deepmerge = require('deepmerge');

var KEY = '@@styling';

function Styling(spec) {
  this[KEY] = spec;
}

Styling.prototype.merge = function(other) {
  var nextSpec = deepmerge(this[KEY], other[KEY]);
  return new Styling(nextSpec);
}

function styling(spec) {
  return new Styling(spec);
}

module.exports = styling;
