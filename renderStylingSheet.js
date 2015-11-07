/**
 * @copyright 2015, Andrey Popp
 */

var Styling       = require('./Styling');

function renderStylingSheet(sheet) {
  var stylesheet = {};
  for (var key in sheet) {
    if (sheet.hasOwnProperty(key)) {
      var styling = sheet[key];
      if (Styling.is(styling)) {
        stylesheet['.' + key] = styling.getSpec();
      }
    }
  }
  return stylesheet;
}

module.exports = renderStylingSheet;
