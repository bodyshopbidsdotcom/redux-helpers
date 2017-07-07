const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: '#inline-source-map',
  entry: [
    './index.js'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  plugins: [
     new webpack.LoaderOptionsPlugin({
       debug: true
     })
  ],
  resolve: {
    alias: {
      'snapsheet-redux-helpers': path.join(__dirname, '..', 'src/index.js')
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: [
        __dirname,
        path.join(__dirname, '..', 'src')
      ]
    }]
  }
};
