const { merge } = require('webpack-merge')
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')

const common = require('./webpack.common.js')
const config = require('./src/config')
const { graphConfig, uiConfig } = require('./src/graphing/config')

const featureToggles = config().production.featureToggles
const main = ['./src/site.js']
const scssVariables = []

Object.entries(graphConfig).forEach(function ([key, value]) {
  scssVariables.push(`$${key}: ${value}px;`)
})

Object.entries(uiConfig).forEach(function ([key, value]) {
  scssVariables.push(`$${key}: ${value}px;`)
})

Object.entries(featureToggles).forEach(function ([key, value]) {
  scssVariables.push(`$${key}: ${value};`)
})

module.exports = merge(common, {
  mode: 'production',
  entry: { main },
  performance: {
    hints: false,
  },
  output: {
    publicPath: '.',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1, modules: 'global', url: false },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  postcssPresetEnv({ browsers: 'last 2 versions' }),
                  cssnano({
                    preset: ['default', { discardComments: { removeAll: true } }],
                  }),
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: scssVariables.join('\n'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.ENVIRONMENT': JSON.stringify('production'),
    }),
    {
      // Custom plugin to copy CNAME file
      apply: (compiler) => {
        compiler.hooks.afterEmit.tapAsync('CopyCnamePlugin', (compilation, callback) => {
          const source = path.resolve(__dirname, 'CNAME')
          const destination = path.resolve(compiler.options.output.path, 'CNAME')

          fs.access(source, fs.constants.F_OK, (accessErr) => {
            if (accessErr) {
              compilation.warnings.push(new Error(`CNAME file not found at ${source}.`))
              return callback()
            }

            fs.copyFile(source, destination, (copyErr) => {
              if (copyErr) {
                compilation.errors.push(copyErr)
              }
              callback()
            })
          })
        })
      },
    },
  ],
})
