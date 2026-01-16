const path = require('path');
const { defineConfig } = require('@vue/cli-service');
const devServerConfig = require('./config/server.config');
const pluginsConfig = require('./config/plugins.config');
const optimizationConfig = require('./config/optimization.config');

const isProduction = process.env.NODE_ENV === 'production';
const isAnalyze = process.argv.includes('--analyze');
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
    plugins: pluginsConfig({ isProduction, isAnalyze, isGzip }),
    optimization: optimizationConfig(isProduction),
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '天气预报';
      return args;
    });
    if (isProduction) {
      config.optimization.minimizer('terser').tap(args => {
        args[0].terserOptions.compress.pure_funcs = ['console.log'];
        args[0].terserOptions.compress.drop_debugger = true;
        args[0].terserOptions.format.comments = false;
        args[0].extractComments = false;
        return args;
      });
    }
  },
});
