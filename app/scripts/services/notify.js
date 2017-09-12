'use strict'

angular.module('openhimConsoleApp')
  .factory('Notify', function Notify ($rootScope) {
    var notifyService = {}

    notifyService.notify = function (event) {
      $rootScope.$broadcast(event)
    }

    return notifyService
  })
