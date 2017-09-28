const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isProduction = /prod/i.test(process.NODE_ENV || 'dev')

const devServerConfig = {
  overlay: true
}

console.log('isProduction', isProduction)

const config = {
  entry: './app/scripts/index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css', '.html'],
    alias: {
      'morris.js': path.resolve(__dirname, 'node_modules/morris.js/morris.min.js'),
      '~': path.resolve(__dirname, 'app')
    }
  },
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
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.html$/,
        include: [
          path.resolve(__dirname, 'app')
        ],
        use: [{
          loader: 'html-loader',
          options: {
            minimize: isProduction
          }
        }]
      },
      {
        test: /.jsx?$/,
        include: [
          path.resolve(__dirname, 'app')
        ],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: isProduction,
              sourceMap: true
            }
          }]
        })
      }
    ]
  },
  devtool: isProduction ? 'nosources-source-map' : 'source-map',
  target: 'web',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HtmlWebpackPlugin({
      template: 'template.ejs'
    }),
    new ExtractTextPlugin('styles.css'),
    new CleanWebpackPlugin(['dist'])
  ]
}

if (isProduction) {
  config.plugins.push(new UglifyJSPlugin({
    extractComments: true,
    uglifyOptions: {
      ie8: false,
      ecma: 5,
      mangle: true,
      output: {
        comments: false
      }
    }
  }), new BundleAnalyzerPlugin())
} else {
  config.devServer = devServerConfig
}

module.exports = config
