'use strict';

angular.module('openhimWebui2App')
  .controller('LoginCtrl', function ($scope, login, $window,$rootScope) {

    //if url "#/logout" is returned then destroy the session
    if( $window.location.hash === '#/logout' ){
      localStorage.removeItem('consoleSession');
      $rootScope.navMenuVisible = false;
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

        //check login credentials and create session if valid
        $scope.checkLoginCredentials(loginEmail, loginPassword);

      }

    };

    $scope.checkLoginCredentials = function(loginEmail, loginPassword){
      login.login(loginEmail, loginPassword, function(loggedIn) {
        $scope.alerts = [];
        if (loggedIn) {

          //Create the session for the logged in user
          $scope.createUserSession(loginEmail);

          //redirect user to landing page (Channels)
          $window.location = '#/transactions';

        }else{
          $scope.alerts.push({ type: 'danger', msg: 'The supplied credentials were incorrect. Please try again' });
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
          var sessionUserSettings = userProfile.settings;

          //create session object
          var consoleSessionObject = { 'sessionID': sessionID, 
                                        'sessionUser': loginEmail, 
                                        'sessionUserGroups': sessionUserGroups, 
                                        'sessionUserSettings': sessionUserSettings, 
                                        'expires': expireTime };
                                        
          // Put the object into storage
          localStorage.setItem('consoleSession', JSON.stringify( consoleSessionObject ));
        }
        
        /*------------------Set sessionID and expire timestamp------------------*/
      }
      
    };

  });