const path = require('path');
const webpack = require('webpack');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const package = require('./package.json');

module.exports = [{
    entry: {
      'jquery.immybox': './src/jquery.immybox.js',
      immybox: ['./src/immybox.js']
    },
    output: {
      filename: "[name].min.js",
      path: `${__dirname}/build`,
      libraryTarget: 'umd'
    },
    module: {
      loaders: [
        {
          test: path.join(__dirname, 'src'),
          loader: 'babel'
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin(`Immybox.js Version ${package.version}\n`),
      new webpack.optimize.UglifyJsPlugin(),
      new UnminifiedWebpackPlugin()
    ],
    externals: {
      immybox: "ImmyBox"
    }
  }, {
    entry: './demo.js',
    output: {
      filename: "demo-build.js"
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel'
        }
      ]
    }
  }
];
