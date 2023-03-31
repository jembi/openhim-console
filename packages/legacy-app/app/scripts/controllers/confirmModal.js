export function ConfirmModalCtrl ($scope, $uibModalInstance, confirmObject) {
  $scope.confirmObject = confirmObject

  $scope.confirmed = function () {
    $uibModalInstance.close()
  }

  $scope.cancelled = function () {
    $uibModalInstance.dismiss('cancel')
  }
}
