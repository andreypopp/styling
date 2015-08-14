/**
 * @copyright 2015, Andrey Popp
 */

var Styling       = require('./Styling');
var renderStyling = require('./renderStyling');

function renderStylingSheet(sheet) {
  var stylesheet = [];
  for (var key in sheet) {
    if (sheet.hasOwnProperty(key)) {
      var styling = sheet[key];
      if (Styling.is(styling)) {
        stylesheet = stylesheet.concat(renderStyling(key, styling));
      }
    }
  }
  return stylesheet.join('\n\n');
}

module.exports = renderStylingSheet;
