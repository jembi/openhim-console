'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsCtrl', function ($scope, channels) {
    $scope.channels = channels.query();
  });
