export function ForgotPasswordCtrl ($scope, $location, Alerting, Api) {
  $scope.userEmail = ''
  $scope.showFormCtrl = true
  $scope.linkUserEmail = ''

  $scope.$watch('userEmail', function (newVal, oldVal) {
    if (newVal || newVal !== oldVal) {
      $scope.linkUserEmail = '?email=' + newVal
    }
  })

  if ($location.search().email) {
    $scope.userEmail = $location.search().email
  }

  $scope.submitRequest = function () {
    // reset alert object
    Alerting.AlertReset()
    const userEmail = $scope.userEmail

    if (!userEmail) {
      Alerting.AlertAddMsg('forgotPassword', 'danger', 'Please provide your email address')
    } else if (userEmail === 'root@openhim.org') {
      Alerting.AlertAddMsg('forgotPassword', 'danger', 'Cannot reset password for "root@openhim.org"')
    } else {
      Alerting.AlertAddMsg('forgotPassword', 'warning', 'Busy checking your credentials...')

      // autheticate valid email address
      Api.Authenticate.get({ email: userEmail }, function () {
        // send request to API - create token/expiry for email user
        Api.UserPasswordResetRequest.get({ email: userEmail }, function () {
          Alerting.AlertReset()
          Alerting.AlertAddMsg('forgotPassword', 'info', 'Password reset email has been sent...')
          $scope.showFormCtrl = false
        }, function () {
          Alerting.AlertReset()
          Alerting.AlertAddMsg('forgotPassword', 'danger', 'An error occurred while trying to request a password reset. Please contact your system administrator')
        })
      }, function () {
        Alerting.AlertReset()
        Alerting.AlertAddMsg('forgotPassword', 'danger', 'Could not authenticate email address')
      })
    }
  }
}
