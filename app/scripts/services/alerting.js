/* NB! remember to include the factory (Alerting) into your Controllers */
/* <alert ng-repeat="alert in alerts.top" type="alert.type" close="closeAlert('top', $index)">{{alert.msg}}</alert> */

export function Alerting ($rootScope) {
  $rootScope.alerts = {}

  return {
    AlertAddMsg: function (alertScope, alertType, alertMsg) {
      // check if alertScope object exists
      if (!$rootScope.alerts[alertScope]) {
        $rootScope.alerts[alertScope] = []
      }

      // create alertObject
      const alertObject = { type: alertType, msg: alertMsg }

      const scopeAlerts = $rootScope.alerts[alertScope]

      if (!scopeAlerts.some(el => el.type === alertType && el.msg === alertMsg)) {
        scopeAlerts.push(alertObject)
      }
    },
    AlertAddServerMsg: function (errCode) {
      let alertMsg
      switch (errCode) {
        case 403:
          alertMsg = 'The request has been forbidden by the server. Please contact the server administrator'
          break
        case 404:
          alertMsg = 'The request resource could not be found'
          break
        default:
          alertMsg = 'A server-side error has occurred. Please contact the server administrator'
      }

      // check if server object exists
      if (!$rootScope.alerts.server) {
        $rootScope.alerts.server = []
      }

      // create alertObject
      const alertObject = { type: 'danger', msg: alertMsg }

      // push alertObject to appropriate alertScope
      $rootScope.alerts.server.push(alertObject)
    },
    AlertReset: function (alertScope) {
      if (!alertScope) {
        // reset the alerts objects
        $rootScope.alerts = {}
      } else {
        if ($rootScope.alerts) {
          // reset the alerts objects
          $rootScope.alerts[alertScope] = undefined
        }
      }
    },
    AlertValidationMsgs: function () {
      $rootScope.validationRequiredMsg = 'This field is required!'
      $rootScope.validationPasswordConfirmMsg = 'Please confirm you password!'
      $rootScope.validationFormErrorsMsg = 'There appears to be some errors in your form. Please correct and try again.'
    }

  }
}
