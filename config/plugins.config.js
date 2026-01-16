const { DefinePlugin } = require('webpack');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const { codeInspectorPlugin } = require('code-inspector-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 *
 * @param {Object} options
 * @param {boolean} options.isProduction - 是否为生产环境
 * @param {boolean} options.isAnalyze - 是否开启打包分析
 * @param {boolean} options.isGzip - 是否开启gzip压缩
 * @returns {Array} plugins 数组
 */
module.exports = options => {
  const { isProduction, isAnalyze, isGzip } = options;
  const gitRevisionPlugin = new GitRevisionPlugin({
    lightweightTags: true,
    branch: true,
  });
  const plugins = [
    new DefinePlugin({
      __GIT_VERSION__: JSON.stringify(gitRevisionPlugin.version()),
      __GIT_BRANCH__: JSON.stringify(gitRevisionPlugin.branch()),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    }),
  ];

  if (!isProduction) {
    plugins.push(codeInspectorPlugin({ bundler: 'webpack' }));
  }

  if (isGzip) {
    plugins.push(
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false,
      })
    );
  }

  if (isAnalyze) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true,
      })
    );
  }

  return plugins;
};
