'use strict'
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const config = require('./yus.config')

function resolve (dir) {
  console.log(path.join(__dirname, '..', 'src/app.js'))
  return path.join(__dirname, '..', dir)
}

module.exports = {
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.json', '.yus']
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: {
            loader: 'style-loader'
          },
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('autoprefixer')({
                    browsers: ['last 2 versions']
                  })
                ]
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.yus$/,
        loader: 'miniprogram-loader',
        options: {
          htmlExt: config.build.htmlExt,
          cssExt: config.build.cssExt,
          jsExt: config.build.jsExt,
          assets: config.build.assetsRoot
        }
      }
    ]
  },
  plugins: [
    new ExtractTextWebpackPlugin({
      filename: `[name].${config.build.cssExt}`
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/pages/**/*.json',
        to: 'pages/[name]/[name].json'
      },
      {
        from: 'src/utils/*.*',
        to: 'utils/[name].[ext]'
      },
      {{#if_eq miniapp "wechat"}}
      {
        from: 'src/project.config.json',
        to: 'project.config.json'
      }
      {{/if_eq}}
      {{#if_eq miniapp "alipay"}}
      {
        from: 'src/.eslintrc',
        to: '.eslintrc'
      }
      {{/if_eq}}
    ]),
    new ProgressBarPlugin()
  ]
}
