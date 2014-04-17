'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsModalCtrl', function ($scope, $modalInstance, Api) {
    $scope.channel = new Api.Channels();

    $scope.save = function(channel) {
      channel.$save();

      // reset backing object and refresh channels list
      $scope.channelToAdd = new Api.Channels();
      $scope.channels = Api.Channels.query();

      // close modal
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
