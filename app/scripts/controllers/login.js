'use strict';

angular.module('openhimWebui2App')
  .controller('LoginCtrl', function ($scope, login, $window, $rootScope, Alerting) {

    //if url "#/logout" is returned then destroy the session
    if( $window.location.hash === '#/logout' ){
      localStorage.removeItem('consoleSession');
      $rootScope.navMenuVisible = false;
    }

    $scope.loginEmail = '';
    $scope.loginPassword = '';

    $scope.validateLogin = function(){
      // reset alert object
      Alerting.AlertReset();
      var loginEmail = $scope.loginEmail;
      var loginPassword = $scope.loginPassword;

      if(!loginEmail || !loginPassword){
        Alerting.AlertAddMsg('login', 'danger', 'Please provide your login credentials');
      }else{
        // reset alert to show processing message
        Alerting.AlertReset();
        Alerting.AlertAddMsg('login', 'warning', 'Busy checking your credentials...');

        //check login credentials and create session if valid
        $scope.checkLoginCredentials(loginEmail, loginPassword);
      }

    };

    $scope.checkLoginCredentials = function(loginEmail, loginPassword){
      login.login(loginEmail, loginPassword, function(result) {
        // reset alert object
        Alerting.AlertReset();
        if (result === 'Authentication Success') {
          //Create the session for the logged in user
          $scope.createUserSession(loginEmail);

          //redirect user to landing page (Channels)
          $window.location = '#/transactions';
        }else{
          if ( result === 'Internal Server Error' ){
            Alerting.AlertAddServerMsg();
          }else{
            Alerting.AlertAddMsg('login', 'danger', 'The supplied credentials were incorrect. Please try again');
          }
        }
      });
    };

    $scope.createUserSession = function(loginEmail){

      // check if email supplied
      if ( !loginEmail ){
        return 'No Email supplied!';
      }else{
        /*------------------Set sessionID and expire timestamp------------------*/
        
         // get the logged in user details
        var userProfile = login.getLoggedInUser();
        // check if userProfile exists
        if ( !userProfile.groups ){
          return 'Logged in user could not be found!';
        }else{

          var currentTime = new Date();
          //add 2hours onto timestamp (2hours persistence time)
          var expireTime = new Date(currentTime.getTime() + (2*1000*60*60));
          //generate random sessionID
          var sessionID = Math.random().toString(36).slice(2).toUpperCase();

          var sessionUserGroups = userProfile.groups;

          //create session object
          var consoleSessionObject = { 'sessionID': sessionID, 'sessionUser': loginEmail, 'sessionUserGroups': sessionUserGroups, 'expires': expireTime };

          // Put the object into storage
          localStorage.setItem('consoleSession', JSON.stringify( consoleSessionObject ));
        }
        
        /*------------------Set sessionID and expire timestamp------------------*/
      }
      
    };

  });