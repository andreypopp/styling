var styling = require('styling');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

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
        loader: styling(ExtractTextWebpackPlugin.extract('style', 'css?modules'), 'babel')
      },
      {
        include: /\.js$/,
        loader: 'babel'
      }
    ]
  },

  plugins: [
    new ExtractTextWebpackPlugin('bundle.css')
  ]
};
