import extend from 'extend'
import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import AssetsPlugin from 'assets-webpack-plugin'

let binaryDependencies = {}
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => { binaryDependencies[mod] = `commonjs ${mod}` })

const config = {
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'build/public/assets'),
    publicPath: '/assets/',
    sourcePrefix: '  ',
    pathinfo: true,
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        sourceMap: true,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        query: {
          presets: ['latest', 'stage-0', 'react'],
          plugins: ['transform-runtime'],
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.css/,
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: true,
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:3]',
            minimize: false,
          })}`],
      },
    ]
  },

  resolve: {
    root: path.resolve(__dirname, 'src'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
  },
}

const serverConfig = extend(true, {}, config, {
  entry: {
    server: 'server.jsx',
  },

  target: 'node',

  output: {
    filename: '../../server.js',
    libraryTarget: 'commonjs2',
  },
  externals: [binaryDependencies,
    /^\.\/assets$/,
  ],

  devtool: 'source-map'
})

const clientConfig = extend(true, {}, config, {
  entry: {
    client: 'client.jsx',
  },

  target: 'web',

  output: {
    filename: '[name].js?[chunkhash]',
    chunkFilename: '[name].[id].js?[chunkhash]'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
    }),
    new AssetsPlugin({
      path: path.resolve(__dirname, 'build'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x)};`,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
  ],

  devtool: 'source-map',
})

module.exports = [serverConfig, clientConfig]
