'use strict';
/* global CryptoJS: false */

angular.module('openhimWebui2App')
  .controller('ClientsModalCtrl', function ($scope, $modalInstance, $timeout, Api, Notify, Alerting, client) {
    
    /***************************************************************/
    /**   These are the functions for the Client initial load     **/
    /***************************************************************/

    // object to store temp values like password (not associated with schema object)
    $scope.temp = {};

    if (client) {
      $scope.update = true;
      $scope.client = angular.copy(client);
    }else{
      $scope.update = false;
      $scope.client = new Api.Clients();
    }

    /***************************************************************/
    /**   These are the functions for the Client initial load     **/
    /***************************************************************/



    /**************************************************************/
    /**   These are the functions for the Client Modal Popup     **/
    /**************************************************************/

    var success = function () {
      // add the success message
      Alerting.AlertAddMsg('top', 'success', 'The client has been saved successfully');
      notifyUser();
    };

    var error = function (err) {
      // add the success message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the clients\' details: #' + err.status + ' - ' + err.data);
      notifyUser();
    };

    var notifyUser = function(){
      // reset backing object and refresh clients list
      Notify.notify('clientsChanged');
      $modalInstance.close();
    };

    var saveClient = function (client) {
      if ($scope.update) {
        client.$update(success, error);
      } else {
        client.$save({ clientId: '' }, success, error);
      }
    };

    var setHashAndSave = function (client, hash, salt) {
      if (typeof salt !== 'undefined' && salt !== null) {
        client.passwordSalt = salt;
      }
      client.passwordHash = hash;
      saveClient(client);
    };

    var hashSHA512 = function (client, password) {
      var salt = CryptoJS.lib.WordArray.random(16).toString();
      var sha512 = CryptoJS.algo.SHA512.create();
      sha512.update(password);
      sha512.update(salt);
      var hash = sha512.finalize();
      client.passwordAlgorithm = 'sha512';
      setHashAndSave(client, hash.toString(CryptoJS.enc.Hex), salt);
    };

    $scope.save = function (client, password) {
      if (password) {
        hashSHA512(client, password);
      } else {
        saveClient(client);
      }
    };

    /**************************************************************/
    /**   These are the functions for the Client Modal Popup     **/
    /**************************************************************/


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };


    /**************************************************************************/
    /**   These are the general functions for the Client form validation     **/
    /**************************************************************************/
   
    $scope.validateFormClients = function(){

      // reset hasErrors alert object
      Alerting.AlertReset('hasErrors');

      // clear timeout if it has been set
      $timeout.cancel( $scope.clearValidation );

      $scope.ngError = {};
      $scope.ngError.hasErrors = false;

      // clientID validation
      if( !$scope.client.clientID ){
        $scope.ngError.clientID = true;
        $scope.ngError.hasErrors = true;
      }

      // name validation
      if( !$scope.client.name ){
        $scope.ngError.name = true;
        $scope.ngError.hasErrors = true;
      }

      // domain validation
      if( !$scope.client.clientDomain ){
        $scope.ngError.clientDomain = true;
        $scope.ngError.hasErrors = true;
      }

      // roles validation
      if( !$scope.client.roles || $scope.client.roles.length===0 ){
        $scope.ngError.roles = true;
        $scope.ngError.hasErrors = true;
      }

      // password validation
      if( $scope.temp.password ){
        if( !$scope.temp.passwordConfirm || $scope.temp.password !== $scope.temp.passwordConfirm ){
          $scope.ngError.passwordConfirm = true;
          $scope.ngError.hasErrors = true;
        }
      }

      if ( $scope.ngError.hasErrors ){
        $scope.clearValidation = $timeout(function(){
          // clear errors after 5 seconds
          $scope.ngError = {};
        }, 5000);
        Alerting.AlertAddMsg('hasErrors', 'danger', $scope.validationFormErrorsMsg);
      }

    };

    $scope.submitFormClients = function(){
      // validate the form first to check for any errors
      $scope.validateFormClients();
      // save the client object if no errors are present
      if ( $scope.ngError.hasErrors === false ){
        $scope.save($scope.client, $scope.temp.password);
      }
    };

    /**************************************************************************/
    /**   These are the general functions for the Client form validation     **/
    /**************************************************************************/

  });
