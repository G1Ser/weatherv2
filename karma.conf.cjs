module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-spec-reporter'),
    ],
    reporters: ['spec'],
    specReporter: {
      suppressPassed: false,
      suppressSkipped: true,
      suppressSummary: false,
      failFast: false,
    },
  });
};
