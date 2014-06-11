'use strict';

angular.module('openhimWebui2App')
  .controller('LoginCtrl', function ($scope, login, $window) {
    // temporarily hard code this: (ie. force root user to be logged in)
    login.login('root@openhim.orgaa', 'openhim-password', function(loggedIn) {
      if (loggedIn) {
        console.log('Logged in, redirecting...');
        $window.location = '#/channels';
      }
    });
  });
