var styling = require('styling');

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
        loader: styling(['style', 'css'], ['babel'])
      },
      {
        include: /\.js$/,
        loader: 'babel'
      }
    ]
  }
};
