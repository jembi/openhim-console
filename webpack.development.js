'use strict'

const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

console.log('Creating development bundle')

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.html$/,
        include: [path.resolve(__dirname, 'app')],
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: [path.join(__dirname, 'app')],
    compress: true,
    port: 9000,
    watchContentBase: true
  }
})
