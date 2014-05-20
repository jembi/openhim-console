'use strict';

angular.module('openhimWebui2App')
  .factory('Notify', function Notify($rootScope) {
    var notifyService = {};

    notifyService.notify = function(event) {
      $rootScope.$broadcast(event);
    };

    return notifyService;
  });
