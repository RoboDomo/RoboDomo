const webpack = require('webpack')
const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry:   {
    bundle: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?quiet=true',
      './client/webapp/index'
    ],
    setup: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?quiet=true',
      './client/setup/index'
    ]
  },
  output: {
    path:     path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /(\.css|\.scss)$/,
        use:  [ 'style-loader', 'css-loader' ]
        // loader: 'style-loader!css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader?sourceMap'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: true,
        // HOST: process.env.HOST,
        PORT:    process.env.PORT
      }
    })
  ],
  devServer: {
    port:         process.env.PORT,
    watchOptions: {
      poll: 1000
    }
  }
}
