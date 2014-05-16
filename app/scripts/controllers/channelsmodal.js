'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsModalCtrl', function ($scope, $modalInstance, Api, Notify) {
    $scope.channel = new Api.Channels();

    $scope.save = function(channel) {
      channel.$save({ channelName: "" }, function() {
        // On success
        // reset backing object and notify of change to channels
        $scope.channelToAdd = new Api.Channels();
        Notify.notify('channelsChanged');

        // close modal
        $modalInstance.close();
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
