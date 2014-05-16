'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsModalCtrl', function ($scope, $modalInstance, Api, Notify, channel) {
    var update = false;
    if (channel) {
      update = true;
    }

    $scope.channel = channel || new Api.Channels();

    var onSuccess = function() {
      // On success
      // reset backing object and notify of change to channels
      $scope.channelToAdd = new Api.Channels();
      Notify.notify('channelsChanged');

      // close modal
      $modalInstance.close();
    };

    $scope.saveOrUpdate = function(channel) {
      if (update) {
        channel.$update(onSuccess);
      } else {
        channel.$save({ channelName: '' }, onSuccess);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
