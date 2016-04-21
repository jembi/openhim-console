'use strict';

angular.module('openhimConsoleApp')
  .controller('ClientsCtrl', function ($rootScope, $scope, $modal, $interval, Api, Alerting, Notify) {


    var queryError = function(err){
      Alerting.AlertAddServerMsg(err.status); // on error - add server error alert
    };

    /* -------------------------Load Clients---------------------------- */
    var clientQuerySuccess = function(clients){
      $scope.clients = clients;
      if( clients.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no clients created');
      }
    };
    
    Api.Clients.query(clientQuerySuccess, queryError);

    $scope.$on('clientsChanged', function () {
      Api.Clients.query(clientQuerySuccess, queryError);
      loadRoles();
    });
    /* -------------------------End Load Clients---------------------------- */



    /* -------------------------Add/edit client popup modal---------------------------- */
    $scope.addClient = function() {
      Alerting.AlertReset();
      $scope.serverRestarting = false;

      $modal.open({
        templateUrl: 'views/clientsmodal.html',
        controller: 'ClientsModalCtrl',
        resolve: {
          client: function () {}
        }
      });
    };

    $scope.editClient = function(client) {
      Alerting.AlertReset();
      $scope.serverRestarting = false;

      $modal.open({
        templateUrl: 'views/clientsmodal.html',
        controller: 'ClientsModalCtrl',
        resolve: {
          client: function () {
            return client;
          }
        }
      });
    };
    /* -------------------------End Add/edit client popup modal---------------------------- */

  
    /*-------------------------------------------------------------------*/
    /*----------------------------------Roles----------------------------*/
    $scope.addNewRole = false;
    $scope.newRoles = [];
    $scope.newRolesIndex = 0;
    
    var apiCall = function(method, parameters, body, callback) {
      var success = function() {
        callback(null, body);
      };
      
      var error = function(err) {
        callback(err);
      };
      
      switch(method) {
        case 'update':
          Api.Roles.update(parameters, body, success, error);
          break;
        case 'save':
          Api.Roles.save(parameters, body, success, error);
          break;
        case 'remove':
          Api.Roles.remove(parameters, body, success, error);
          break;
      }
    };
    
  
    /* -------------------------Load Channels---------------------------- */
    var channelQuerySuccess = function(channels){
      $scope.channels = channels;
      if( channels.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no channels created');
      } else {
        Alerting.AlertReset('bottom');
      }
    };

    Api.Channels.query(channelQuerySuccess, queryError); // request channels for table columns
    /* -------------------------End Load Channels---------------------------- */
      
    
    /* -------------------------Load Roles---------------------------- */  
    $scope.$watch('channels', function (newVal) {
      if(newVal) {
        loadRoles();  // channels need to be loaded before roles to set up the table columns
      }
    });
    
    var loadRoles = function () {
      var roleQuerySuccess = function(roles) {
        $scope.roles = roles;
        if( roles.length === 0 ) {
          Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no roles created');
        } else {
          Alerting.AlertReset('bottom');
        }
      };

      Api.Roles.query(roleQuerySuccess, queryError); // request roles

      $scope.$on('rolesChanged', function() {
        Api.Roles.query(roleQuerySuccess, queryError);  // listen for changed roles and reload roles
      });
    };
    /* -------------------------End Load Roles---------------------------- */
    
    
    /* -------------------------Assign Clients to Roles---------------------------- */
    $scope.$watch('clients', function (newVal) {
      if(newVal) {
        waitForRoles(); // wait for roles before assigning clients
      }
    });
    
    var waitForRoles = function() {
      $scope.$watch('roles', function (newVal) {
        if(newVal) {
          buildClientsRolesObject();
          buildChannelsRolesObject();
          angular.forEach($scope.roles, function(role) {
            role.displayName = role.name;
          });
        }
      });
    };
    
    var buildClientsRolesObject = function() {
      $scope.clientRoles = {};
      angular.forEach($scope.roles, function(role) {
        for (var i=0;i<role.clients.length;i++) {
          $scope.clientRoles[role.clients[i].clientID + role.name] = true;
        }
      });
    };
    
    
    var editRoleCallback = function (err) {
      if(err) {
        Alerting.AlertReset();
        return Alerting.AlertAddMsg('role', 'danger', 'An error has occurred while saving the roles\' details: #' + err.status + ' - ' + err.data);
      }
      Alerting.AlertReset();
      Notify.notify('clientsChanged');
      Alerting.AlertAddMsg('role', 'success', 'The role has been saved successfully');
    };
    

    $scope.assignRoleToClient = function(client, role, save) {
      if(!role.clients) {
        role.clients = [];
      }
      role.clients.push({'_id': client._id, 'name': client.clientID});
      $scope.clientRoles[client.clientID + role.name] = true;
      
      var updateBody = Object.assign({}, role);
      updateBody.name = undefined;
      if(save) {
        apiCall('update', {name:role.name}, updateBody, editRoleCallback);
      }
    };
    
    $scope.removeRoleFromClient = function(client, role, save) {
      $scope.clientRoles[client.clientID + role.name] = false;
      
      var index = -1;
      for(var i = 0; i<role.clients.length; i++) {
         if (role.clients[i].clientID ===  client.clientID) {
             index = i;
             break;
         }
      }
      role.clients.splice(index, 1);
      
      var updateBody = Object.assign({}, role);
      updateBody.name = undefined;
      if(save) {
        apiCall('update', {name:role.name}, updateBody, editRoleCallback);
      }
    };
    
    $scope.toggleEditClients = function() {
      $scope.editClients = $scope.editClients === true ? false : true;
    };
    /* -------------------------End Assign Clients to Roles---------------------------- */
    
    
    /* -------------------------Assign Roles To Channels---------------------------- */
    var buildChannelsRolesObject = function() {
      $scope.channelRoles = {};
      angular.forEach($scope.channels, function(channel) {
        angular.forEach($scope.roles, function(role) {
          for (var i=0;i<role.channels.length;i++) {
            if (role.channels[i]._id === channel._id) {
              $scope.channelRoles[channel.name + role.name] = true;
            }
          }
        });
      });
    };
    
    $scope.assignRoleToChannel = function(channel, role, save) {
      if(!role.channels) {
        role.channels = []; // if the role has no channels, initialize the array
      }
      role.channels.push({'_id': channel._id, 'name': channel.name});
      $scope.channelRoles[channel.name + role.name] = true;

      var updateBody = Object.assign({}, role);
      updateBody.name = undefined;
      if(save) {
        apiCall('update', {name:role.name}, updateBody, editRoleCallback);
      }
    };
    
    $scope.removeAssignRoleFromChannel = function(channel, role, save) {
      $scope.channelRoles[channel.name + role.name] = false;
      var index = -1;
      for(var i = 0; i<role.channels.length; i++) {
         if (role.channels[i].name ===  channel.name) {
             index = i;
             break;
         }
      }
      role.channels.splice(index, 1);
      
      var updateBody = Object.assign({}, role);
      updateBody.name = undefined;
      if(save) {
        apiCall('update', {name:role.name}, updateBody, editRoleCallback);
      }
    };
    /* -------------------------End Assign Roles To Channels---------------------------- */
    
    
    /* -------------------------Edit Roles---------------------------- */
    
    
    
    
    
    $scope.nameSaved = [];
    $scope.changeRoleName = function(role) {
      try {
        angular.forEach($scope.roles, function(aRole) {
          if(aRole.name === role.displayName) {
            throw 'break';
          }
        });
        var updateBody = {};
        updateBody.name = role.displayName;
        $scope.nameSaved[role.displayName] = true;
        apiCall('update', {name:role.name}, updateBody, editRoleCallback);
      } catch (e) {
        $scope.nameSaved[role.displayName] = true;
      }
    };
    
    $scope.toggleEditRoleNames = function() {
      $scope.editRoleNames = $scope.editRoleNames === true ? false : true;
      $scope.nameSaved = [];
    };
    
    $scope.addRole = function() {
      Alerting.AlertReset();
      $scope.newRoles.push(
        {
          idName: 'Role' + $scope.newRolesIndex, 
          index: $scope.newRolesIndex++,
          name: $scope.newRoles.name
        });
    };
    
    
    
    $scope.assignClientToNewRole = function (client, role) {
      if(!role.name) {
        Alerting.AlertReset();
        return Alerting.AlertAddMsg('role', 'danger', 'Please name the Role before assigning Clients/Channels');
      }
      if(!role.clients) {
        role.clients = []; // if the role has no clients, initialize the array
      }
      role.clients.push({'_id': client._id, 'name': client.clientID});
      $scope.clientRoles[client.clientID + role.name] = true;
    };
    
    $scope.assignNewRoleToChannel = function (channel, role) {
      if(!role.name) {
        Alerting.AlertReset();
        return Alerting.AlertAddMsg('role', 'danger', 'Please name the Role before assigning Clients/Channels');
      }
      if(!role.channels) {
        role.channels = []; // if the role has no channels, initialize the array
      }
      role.channels.push({'_id': channel._id, 'name': channel.name});
      $scope.channelRoles[channel.name + role.name] = true;
    };
    
    
    var saveNewRoleCallback = function (err, role) {
      if(err) {
        Alerting.AlertReset();
        return Alerting.AlertAddMsg('role', 'danger', err.data);
      }
      Notify.notify('clientsChanged');
      Alerting.AlertReset();
      Alerting.AlertAddMsg('role', 'success', 'The role has been added successfully');
      $scope.removeNewRole(role);
    };
    
    
    $scope.saveNewRole = function(role) {
      apiCall('save', {name:null}, role, saveNewRoleCallback);
    };
    
    $scope.removeNewRole = function(role) {
      var spliceIndex = -1;
      
      for(var i = 0; i<$scope.newRoles.length; i++) {
         if ($scope.newRoles[i].name ===  role.name) {
             spliceIndex = i;
             break;
         }
      }
      $scope.newRoles.splice(spliceIndex, 1);
    };
    
    var removeRoleCallback = function(err) {
      if(err) {
        Alerting.AlertReset();
        return Alerting.AlertAddMsg('role', 'danger', 'An error has occurred while deleting the role: #' + err.status + ' - ' + err.data);
      }
      Notify.notify('rolesChanged');
      Notify.notify('clientsChanged');
      Alerting.AlertReset();
      Alerting.AlertAddMsg('role', 'success', 'The role has been deleted successfully');
    };
    
    $scope.removeRole = function(role) {
      apiCall('remove', {name:role.name}, null, removeRoleCallback);
      var spliceIndex = -1;
      for(var i = 0; i<$scope.roles.length; i++) {
         if ($scope.roles[i].name ===  role.name) {
             spliceIndex = i;
             break;
         }
      }
      $scope.roles.splice(spliceIndex, 1);
    };
    
    /* -------------------------End Edit Roles---------------------------- */
    
    
    /*------------------------Delete Confirm----------------------------*/
    var confirmDelete = function(object, objectType, callback) {
      Alerting.AlertReset();
      $scope.serverRestarting = false;
      
      var deleteObject = {
        title: 'Delete ' + objectType,
        button: 'Delete',
        message: 'Are you sure you wish to delete the "' + objectType + '": "' + object.name + '"?'
      };
      
      var modalInstance = $modal.open({
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: function () {
            return deleteObject;
          }
        }
      });
      
      modalInstance.result.then(function () {
        // Delete confirmed - delete the object
        callback();
      }, function () {
        // delete cancelled - do nothing
      });
    };
    
    var clientDeleteSuccess = function () {
      $scope.clients = Api.Clients.query();
      Alerting.AlertReset();
      Alerting.AlertAddMsg('client', 'success', 'The client has been deleted successfully');
    };
    
    var clientDeleteError = function (err) {
      Alerting.AlertReset();
      Alerting.AlertAddMsg('client', 'danger', 'An error has occurred while deleting the client: #' + err.status + ' - ' + err.data);
    };
    
    $scope.confirmRoleDelete = function(role) {
      confirmDelete(role, 'Role', function() {
        $scope.removeRole(role);
      });
    };
    
    $scope.confirmClientDelete = function(client) {
      confirmDelete(client, 'Client', function() {
        client.$remove(clientDeleteSuccess, clientDeleteError);
      });
    };
    /*------------------------End Delete Confirm----------------------------*/

  });
