'use strict';

angular.module('openhimConsoleApp')
  .controller('MediatorConfigModalCtrl', function ($rootScope, $scope, $modalInstance, $timeout, Api, Notify, Alerting, mediator) {
    $scope.inputKeys = {};
    $scope.inputValues = {};

    $scope.mediator = Api.Mediators.get({ urn: mediator.urn }, function(){
      if (!$scope.mediator.config) {
        $scope.mediator.config = {};
      }
    });
    
    var success = function () {
      Alerting.AlertAddMsg('top', 'success', 'The mediator configuration was updated successfully');
      notifyUser();
    };

    var error = function (err) {
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the mediator config: #' + err.status + ' - ' + err.data);
      notifyUser();
    };

    var notifyUser = function(){
      Notify.notify('mediatorConfigChanged');
      $modalInstance.close();
    };

    $scope.saveConfig = function () {
      new Api.MediatorConfig($scope.mediator.config).$update({ urn: $scope.mediator.urn }, success, error);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.removeMapping = function (param, mapping) {
      delete $scope.mediator.config[param][mapping];
    };

    $scope.addNewMapping = function (param) {
      if (!$scope.mediator.config[param]) {
        $scope.mediator.config[param] = {};
      }
      $scope.mediator.config[param][$scope.inputKeys[param]] = $scope.inputValues[param];
      $scope.inputKeys[param] = '';
      $scope.inputValues[param] = '';
    };

    $scope.doesNewKeyExist = function (param) {
      return $scope.mediator.config[param] && $scope.mediator.config[param][$scope.inputKeys[param]];
    };

    $scope.isNewKeyValid = function (param) {
      return $scope.inputKeys[param] && !$scope.doesNewKeyExist(param);
    };
  });
