// production config
const merge = require('webpack-merge');
const {resolve} = require('path');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.tsx',
  output: {
    filename: 'bundle.[hash].min.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: '',
  },
  // 是否输出 source-map
  // devtool: 'source-map',
  plugins: [],
});
