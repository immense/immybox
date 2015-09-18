/*eslint-env node */
var path    = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'jquery.immybox': path.join(__dirname, 'src', 'jquery.immybox.js'),
    immybox: [path.join(__dirname, 'src', 'immybox.js')]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {test: path.join(__dirname, 'src'), loader: 'babel-loader'}
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
