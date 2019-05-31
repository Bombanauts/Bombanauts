'use strict';

const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isProductionBuild = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './browser/react/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  context: __dirname,
  devtool: isProductionBuild ? '' : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new CompressionPlugin()
  ].concat(isProductionBuild ? new BundleAnalyzerPlugin() : []),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        }
      },
      {
        test: /\.scss?$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
        loader: 'file'
      }
    ]
  }
};
