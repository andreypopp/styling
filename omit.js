var loaderPath = require.resolve('./loader');

module.exports = function(content) {
  this.cacheable();
  return content;
}

module.exports.pitch = function(request) {
  if (this[__dirname] === false) {
    request = request.split('!');
    while (request.length > 1) {
      var req = request.shift();
      if (req === loaderPath) {
        break;
      }
    }
    request = request.join('!');
    return 'module.exports = require(' + JSON.stringify('!!' + request) + ');';
  }
}
