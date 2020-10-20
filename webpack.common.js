'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './app/scripts/index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css', '.html'],
    alias: {
      'morris.js': path.resolve(__dirname, 'node_modules/morris.js/morris.js'),
      '~': path.resolve(__dirname, 'app')
    }
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        include: [path.resolve(__dirname, 'app')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
  }),
  new HtmlWebpackPlugin({
    template: 'app/template.html'
  }),
  new MiniCssExtractPlugin({
    filename: 'styles.css'
  }),
  new CopyWebpackPlugin({patterns: [
    { from: 'app/404.html' },
    { from: 'app/favicon.ico' },
    { from: 'app/robots.txt' },
    {
      context: 'app/config',
      from: '*',
      to: 'config/'
    }
  ]})]
}
