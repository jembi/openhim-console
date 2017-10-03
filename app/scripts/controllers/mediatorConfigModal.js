export function MediatorConfigModalCtrl ($rootScope, $scope, $uibModalInstance, $timeout, Api, Notify, Alerting, mediator) {
  $scope.mediator = Api.Mediators.get({ urn: mediator.urn }, function () {
    if (!$scope.mediator.config) {
      $scope.mediator.config = {}
    }
  })

  function notifyUser () {
    Notify.notify('mediatorConfigChanged')
    $uibModalInstance.close()
  };

  function success () {
    Alerting.AlertAddMsg('top', 'success', 'The mediator configuration was updated successfully')
    notifyUser()
  };

  function error (err) {
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the mediator config: #' + err.status + ' - ' + err.data)
    notifyUser()
  };

  $scope.saveConfig = function () {
    new Api.MediatorConfig($scope.mediator.config).$update({ urn: $scope.mediator.urn }, success, error)
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }
}
