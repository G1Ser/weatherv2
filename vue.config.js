const path = require('path');
const { defineConfig } = require('@vue/cli-service');
const devServerConfig = require('./config/server.config');
const pluginsConfig = require('./config/plugins.config');

const isProduction = process.env.NODE_ENV === 'production';
const isAnalyze = process.argv.includes('--analyze');
const isProfile = process.argv.includes('--profile');
const isGzip = process.argv.includes('--gzip');

module.exports = defineConfig({
  publicPath: '/',
  outputDir: 'dist',
  productionSourceMap: false,
  devServer: devServerConfig,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['js', '.vue', '.json', '.ts', '.tsx', '.jsx'],
    },
    plugins: pluginsConfig({ isProduction, isAnalyze, isProfile, isGzip }),
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '天气预报';
      return args;
    });
  },
});
