'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsCtrl', function ($scope, $modal, Api) {
    $scope.channels = Api.Channels.query();

    $scope.openModal = function() {
      $modal.open({
          templateUrl: 'views/channelsmodal.html',
          controller: 'ChannelsModalCtrl'
        });
    };
  });
