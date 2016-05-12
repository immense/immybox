const path = require('path');
const webpack = require('webpack');
const package = require('./package.json');

module.exports = {
    entry: {
      'jquery.immybox': './src/jquery.immybox.js',
      immybox: ['./src/immybox.js']
    },
    output: {
      filename: "[name].js",
      path: `${__dirname}/build`,
      libraryTarget: 'umd'
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: path.join(__dirname, 'src'),
          loader: 'babel'
        }
      ]
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      new webpack.BannerPlugin(`Immybox.js Version ${package.version}\n`)
    ]
};
