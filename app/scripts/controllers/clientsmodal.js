'use strict';
/* global CryptoJS: false */

angular.module('openhimWebui2App')
  .controller('ClientsModalCtrl', function ($scope, $modalInstance, Api, Notify, Alerting, client) {
    

    if (client) {
      $scope.update = true;
      $scope.client = angular.copy(client);
    }else{
      $scope.update = false;
      $scope.client = new Api.Clients();
    }



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

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.isClientValid = function (client, password, passwordRetype) {
      return client.clientID && client.name && client.clientDomain && client.roles && (password || client.passwordAlgorithm || client.cert) && !(password && password !== passwordRetype);
    };
  });
