var path    = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: {
      immybox: path.join(__dirname, 'src', 'immybox.js'),
      'jquery.immybox': path.join(__dirname, 'src', 'jquery.immybox.js')
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
      new webpack.NoErrorsPlugin(),
      new webpack.ProvidePlugin({
        $: 'jQuery'
      })
    ],
    stats: {
      colors: true
    },
    devtool: 'source-map'
};
