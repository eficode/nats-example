const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const MinifyPlugin = require('babel-minify-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = require('./webpack.config.base');

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  'process.env.ENDPOINT': JSON.stringify(process.env.ENDPOINT || 'http://0.0.0.0:9000/api'),
};

module.exports = merge(config, {
  mode: 'production',
  entry: {
    main: ['@babel/polyfill', path.join(__dirname, '../src/client.jsx')],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '../src/public/images'), to: 'images' }]),
    new MinifyPlugin({}, { sourceMap: null }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
  ],
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        chunkFilter: (chunk) => (chunk.name !== 'vendor'),
        uglifyOptions: {
          compress: { drop_console: true },
        },
      }),
    ],
  },
});
