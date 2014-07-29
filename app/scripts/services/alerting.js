'use strict';

/* NB! remember to include the factory (Alerting) into your Controllers */
/* <alert ng-repeat="alert in alerts.top" type="alert.type" close="closeAlert('top', $index)">{{alert.msg}}</alert> */

angular.module('openhimWebui2App')
  .factory('Alerting', function ($rootScope) {

    return {
      AlertAddMsg: function (alertScope, alertType, alertMsg) {
        
        // check if alerts object exist
        if( !$rootScope.alerts ){
          $rootScope.alerts = {};
        }

        // check if alertScope object exists
        if ( !$rootScope.alerts[alertScope] ){
          $rootScope.alerts[alertScope] = [];
        }

        // create alertObject
        var alertObject = { type: alertType, msg: alertMsg };

        // push alertObject to appropriate alertScope
        $rootScope.alerts[alertScope].push(alertObject);

      },
      AlertAddServerMsg: function (errCode) {

        var alertMsg;
        switch (errCode){
          case 403:
            alertMsg = 'The request has been forbidden by the server. Please contact the server administrator';
            break;
          default:
            alertMsg = 'A server-side error has occurred. Please contact the server administrator';
        }
   
        // check if alerts object exist
        if( !$rootScope.alerts ){
          $rootScope.alerts = {};
        }

        // check if alertScope object exists
        if ( !$rootScope.alerts.server ){
          $rootScope.alerts.server = [];
        }

        // create alertObject
        var alertObject = { type: 'danger', msg: alertMsg };

        // push alertObject to appropriate alertScope
        $rootScope.alerts.server.push(alertObject);

      },
      AlertReset: function () {
        // reset the alerts objects
        $rootScope.alerts = null;
      }

    };

  })
  .run( function($rootScope) {

    // register listener to watch route changes
    $rootScope.$on( '$routeChangeStart', function() {

      // reset the alert object for each route changed
      $rootScope.alerts = null;

    });

  });