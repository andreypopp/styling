/**
 * @copyright 2015, Andrey Popp
 */

var deepmerge     = require('deepmerge');
var addStyles     = require('style-loader/addStyles');
var renderStyling = require('./renderStyling');

var KEY = '@@styling';
var counter = 0;
var environmentHasDOM = typeof document !== 'undefined';

function Styling(spec, key) {
  if (!key) {
    counter += 1;
    key = 'styling' + counter;
  }
  this._injected = false;
  this.key = key;
  this[KEY] = spec;
}

Styling.is = function Styling_is(obj) {
  return this[KEY] !== undefined;
}

Styling.prototype.valueOf = function Styling_valueOf() {
  if (environmentHasDOM) {
    this._inject();
  }
  return this.key;
}

Styling.prototype._inject = function Styling__inject() {
  if (!this._injected) {
    this._injected = true;
    addStyles(renderStyling(key, this)
      .map(function(item) { return [key, item]; }));
  }
}

function styling(spec, key) {
  return new Styling(spec, key);
}

module.exports = styling;

