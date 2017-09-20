'use strict'
/* global CryptoJS: true */

angular.module('openhimConsoleApp')
  .factory('Authinterceptor', function () {
    var user = localStorage.getItem('loggedOnUser')
    user = JSON.parse(user)

    return {
      'setLoggedInUser': function (u) {
        user = u
        localStorage.setItem('loggedOnUser', JSON.stringify(user))
      },
      'getLoggedInUser': function () {
        var user = localStorage.getItem('loggedOnUser')
        user = JSON.parse(user)
        return user
      },
      'request': function (config) {
        if (user) {
          var passwordhash = user.passwordHash
          var requestSalt = CryptoJS.lib.WordArray.random(16).toString()
          var requestTS = new Date().toISOString()
          try {
            /**
             * Try and syncronize with server time
             *
             */
            requestTS = new Date(Math.abs(new Date().getTime() + user.timeDiff)).toISOString()
          } catch (e) {
            console.log('Authinterceptor: ' + e.message)
          }
          var username = user.email

          var sha512 = CryptoJS.algo.SHA512.create()
          sha512.update(passwordhash)
          sha512.update(requestSalt)
          sha512.update(requestTS)
          var hash = sha512.finalize()

          config.headers['auth-username'] = username
          config.headers['auth-ts'] = requestTS
          config.headers['auth-salt'] = requestSalt
          config.headers['auth-token'] = hash.toString(CryptoJS.enc.Hex)
        }

        return config
      }
    }
  }).config(function ($httpProvider) {
    $httpProvider.interceptors.push('Authinterceptor')
  })
