/**
 * @copyright 2015, Andrey Popp
 */

var omitRequest = require.resolve('./omit');
var loaderRequest = require.resolve('./loader');

module.exports = function styling(post, pre) {
  if (Array.isArray(post)) {
    post = post.join('!');
  }
  if (Array.isArray(pre)) {
    pre = pre.join('!');
  }
  return [omitRequest, post, loaderRequest, pre || ''].join('!');
}
