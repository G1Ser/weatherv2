/**
 * @param {boolean} isProduction -是否生产环境
 * @returns {object} optimization配置对象
 */
module.exports = isProduction => {
  if (!isProduction) return {};
  return {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        'vue-vendor': {
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
          name: 'vue-vendor',
          priority: 10,
        },
        'vue-decorator': {
          test: /[\\/]node_modules[\\/](vue-class-component|vue-property-decorator)[\\/]/,
          name: 'vue-decorator',
          priority: 9,
        },
        polyfill: {
          test: /[\\/]node_modules[\\/]core-js[\\/]/,
          name: 'polyfill',
          priority: 8,
        },
      },
    },
  };
};
