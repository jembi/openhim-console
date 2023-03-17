'use strict'

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'sinon-chai', 'dirty-chai'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/moment/moment.js',
      'dist/bundle.js',
      { pattern: 'dist/bundle.js.map', included: false, watched: false },
      'dist/index.html',
      { pattern: 'dist/fonts/*', watched: false, included: false, served: true, nocache: false },
      'test/spec/controllers/*.js'
    ],
    proxies: {
      '/fonts/': 'http://localhost:8090/base/dist/fonts/'
    },
    reporters: ['mocha'],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8090,
    mochaReporter: {
      showDiff: true,
      output: 'autowatch'
    },

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['ChromeHeadless']
  })
}
