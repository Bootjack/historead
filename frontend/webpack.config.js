const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/historead.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'historead.bundle.js'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }]
    }, {
      test: /\.styl$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'stylus-loader'
      }]
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.styl'],
    modules: ['src', 'node_modules']
  },
  watch: true
};
