const path = require('path');

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
    }
};
