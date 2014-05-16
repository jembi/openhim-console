'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsCtrl', function ($scope, $modal, Api) {
    $scope.channels = Api.Channels.query();

    $scope.$on('channelsChanged', function() {
      $scope.channels = Api.Channels.query();
    });

    $scope.openModal = function() {
      $modal.open({
        templateUrl: 'views/channelsmodal.html',
        controller: 'ChannelsModalCtrl'
      });
    };

    $scope.removeChannel = function(channel) {
      channel.$remove(function() {
        // On success
        $scope.channels = Api.Channels.query();
      });
    };
  });
