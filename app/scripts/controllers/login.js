'use strict';

angular.module('openhimWebui2App')
  .controller('LoginCtrl', function ($scope, login, $window) {

    //if url "#/logout" is returned then destroy the session
    if( $window.location.hash === '#/logout' ){
      localStorage.removeItem('consoleSession');
    }

    $scope.loginEmail = '';
    $scope.loginPassword = '';

    $scope.validateLogin = function(){
      $scope.alerts = [];
      var loginEmail = $scope.loginEmail;
      var loginPassword = $scope.loginPassword;

      if(!loginEmail){
        $scope.alerts.push({ type: 'danger', msg: 'Please provide your E-mail address' });
      }
      if(!loginPassword){
        $scope.alerts.push({ type: 'danger', msg: 'Please provide your Password' });
      }

      //if basic alerts empty continue to attempt login
      if($scope.alerts.length === 0){

        $scope.alerts = [];
        $scope.alerts.push({ type: 'warning', msg: 'Busy checking your credentials...' });

        login.login(loginEmail, loginPassword, function(loggedIn) {
          if (loggedIn) {

            /*------------------Set sessionID and expire timestamp------------------*/
            var currentTime = new Date();
            //add 2hours onto timestamp (2hours persistence time)
            var expireTime = new Date(currentTime.getTime() + (2*1000*60*60));
            //generate random sessionID
            var sessionID = Math.random().toString(36).slice(2).toUpperCase();

            //create session object
            var consoleSessionObject = { 'sessionID': sessionID, 'expires': expireTime };

            // Put the object into storage
            localStorage.setItem('consoleSession', JSON.stringify( consoleSessionObject ));
            /*------------------Set sessionID and expire timestamp------------------*/

            //redirect user to landing page (Channels)
            $window.location = '#/channels';

          }else{
            $scope.alerts = [];
            $scope.alerts.push({ type: 'danger', msg: 'The supplied credentials were incorrect. Please try again' });
          }
        });

      }

    };

  });