'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const requireDir = require('require-dir');
const path = require('path');
const webpack = require('webpack');
const getLoaders = require('./getLoaders');

const allLoaders = Object.assign(requireDir('../loaders'), requireDir('../loaders/dev'));

const env = 'development';

const defaultDefine = {
  'process.env': {
    'NODE_ENV': JSON.stringify(env)
  }
};

// https://gist.github.com/sokra/27b24881210b56bbaff7
// http://www.2ality.com/2015/12/webpack-tree-shaking.html
module.exports = function devConfig (context) {
  const loaders = getLoaders(allLoaders, context);
  const definitions = Object.assign({}, defaultDefine, context.userConfig.define);

  return {
    devtool: 'inline-source-map',
    entry: [
      require.resolve('webpack-hot-middleware/client'),
      path.join(context.projectDir, 'src/index')
    ],
    output: {
      path: path.join(context.projectDir, 'dist'),
      filename: '[name]-[hash].js',
      publicPath: '/'
    },
    plugins: [
      new webpack.DefinePlugin(definitions),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin({
        title: context.pkg.name,
        template: context.indexPath
      })
    ],
    resolve: {
      modules: [path.join(context.projectDir, 'src'), 'node_modules'],
      extensions: ['', '.js', '.json']
    },
    resolveLoader: {
      modules: [path.join(context.rootDir, 'node_modules'), path.join(context.projectDir, 'node_modules')]
    },
    module: {
      loaders: loaders
    }
  }
};
