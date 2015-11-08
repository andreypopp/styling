var styling = require('styling');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var postcssNested = require('postcss-nested');

module.exports = {

  entry: './Button',

  output: {
    path: './build',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        include: /\.style\.js$/,
        loader: styling(ExtractTextWebpackPlugin.extract('style', 'css?modules!postcss'), 'babel')
      },
      {
        include: /\.js$/,
        loader: 'babel'
      }
    ]
  },

  postcss: function() {
    return [postcssNested];
  },

  plugins: [
    new ExtractTextWebpackPlugin('bundle.css')
  ]
};
