'use strict'

const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')

console.log('Creating production bundle')

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.html$/,
        include: [path.resolve(__dirname, 'app')],
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MinifyPlugin(
      {
      consecutiveAdds: false,
      guards: false,
      mangle: false,
      simplify: false
    },
    {
      comments: false
    }
  )]
})
