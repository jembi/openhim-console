'use strict';

angular.module('openhimConsoleApp')
  .controller('RolesCtrl', function ($rootScope, $scope, $modal, $interval, Api, Notify, Alerting) {
    
    
    var rolesMirror = null;
    $scope.addNewRole = false;
    $scope.newRoles = [];
    $scope.newRolesIndex = 0;
    
    var queryError = function(err){
      Alerting.AlertAddServerMsg(err.status); // on query error - add server error alert
    };
    
    var apiCall = function(method, parameters, body, callback) {
      var success = function() {
        //Alerting.AlertAddMsg('top', 'success', 'Successfully updated role');
        //Notify.notify('rolesChanged');
        console.log('Api Call Successful');
      };
      
      var error = function(error) {
        Alerting.AlertAddMsg('server', 'error', error);
      };
      
      switch(method) {
        case 'update':
          Api.Roles.update(parameters, body, success, error);
          break;
        case 'save':
          Api.Roles.save(parameters, body, success, error);
          break;
      }
    }
    
    /* -------------------------Load Clients---------------------------- */
    var clientQuerySuccess = function(clients){
      $scope.clients = clients;
      if( clients.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no clients created');
      } else {
        Alerting.AlertReset('bottom');
      }
    };

    Api.Clients.query(clientQuerySuccess, queryError); // request all clients to assign to roles
    /* -------------------------End Load Clients---------------------------- */
    
  
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
        loadRoles();  // load roles after channels are loaded
      }
    });
    
    var loadRoles = function () {
      var roleQuerySuccess = function(roles){
        if(!rolesMirror) {
          $scope.rolesMirror = roles; // only populate the rolesMirror once
        }
        $scope.roles = roles;
        if( roles.length === 0 ){
          Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no roles created');
        } else {
          Alerting.AlertReset('bottom');
        }
      };

      Api.Roles.query(roleQuerySuccess, queryError); // request roles

      $scope.$on('rolesChanged', function () {
        Api.Roles.query(roleQuerySuccess, queryError);  // listen for changed roles and reload roles
      });
    };
    /* -------------------------End Load Roles---------------------------- */
    
    
    /* -------------------------Assign Clients to Roles---------------------------- */
    $scope.$watch('clients', function (newVal) {
      if(newVal) {
        waitForRolesMirror(); // wait for roles before assigning clients
      }
    });
    
    var waitForRolesMirror = function() {
      $scope.$watch('rolesMirror', function (newVal) {
        if(newVal) {
          buildClientsRolesObject();
          buildChannelsRolesObject();
          angular.forEach($scope.rolesMirror, function(role) {
            role.displayName = role.name;
          });
        }
      });
    };
    
    $scope.clientRoles = {};
    var buildClientsRolesObject = function() {
      angular.forEach($scope.clients, function(client) { 
        angular.forEach($scope.rolesMirror, function(role) {
          $scope.clientRoles[client.name + role.name] = false;
          for (var i=0;i<client.roles.length;i++) {
            if (client.roles[i] === role.name) {
              $scope.clientRoles[client.name + role.name] = true;
            }
          }
        });
      });
    };
    
    

    $scope.assignRoleToClient = function(client, role, save) {
      if(!role.clients) {
        role.clients = [];
      }
      role.clients.push({'_id': client._id, 'name': client.name});
      $scope.clientRoles[client.name + role.name] = true;
      
      var updateBody = Object.assign({}, role);
      updateBody.name = undefined;
      if(save) {
        apiCall('update', {name:role.name}, updateBody);
      }
    };
    
    $scope.removeRoleFromClient = function(client, role, save) {
      $scope.clientRoles[client.name + role.name] = false;
      var index = client.roles.indexOf(role.name);
      client.roles.splice(index, 1);
      if(save) {
        Api.Clients.update({}, client , function() {
          Notify.notify('clientsChanged');
        }, function(error) {
          Alerting.AlertAddMsg('server', 'error', error);
        });
      }
    };
    
    $scope.toggleEditClients = function() {
      $scope.editClients = $scope.editClients === true ? false : true;
    };
    /* -------------------------End Assign Clients to Roles---------------------------- */
    
    
    /* -------------------------Assign Roles To Channels---------------------------- */
    $scope.channelRoles = {};
    var buildChannelsRolesObject = function() {
      angular.forEach($scope.channels, function(channel) {
        angular.forEach($scope.rolesMirror, function(role) {
          $scope.channelRoles[channel.name + role.name] = false;
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
      if(save){
        apiCall('update', {name:role.name}, updateBody);
      }
    };
    
    $scope.removeAssignRoleFromChannel = function(channel, role, save) {
      $scope.channelRoles[channel.name + role.name] = false;
      var index = channel.allow.indexOf(role.name);
      channel.allow.splice(index, 1);
      if(save) {
        Api.Channels.update({}, channel, function() {
          Notify.notify('channelsChanged');
        }, function(error) {
          Alerting.AlertAddMsg('server', 'error', error);
        });
      }
    };
    /* -------------------------End Assign Roles To Channels---------------------------- */
    
    
    /* -------------------------Edit Roles---------------------------- */
    $scope.nameSaved = [];
    $scope.changeRoleName = function(role) {
      var updateBody = {};
      updateBody.name = role.displayName;
      Api.Roles.update({name:role.name}, updateBody,  function() {
        $scope.nameSaved[role.name] = true;
        Notify.notify('rolesChanged');
      }, function(error) {
        Alerting.AlertAddMsg('server', 'error', error);
      });
    };
    
    $scope.toggleEditRoleNames = function() {
      $scope.editRoleNames = $scope.editRoleNames === true ? false : true;
      $scope.nameSaved = [];
    };
    
    $scope.addRole = function() {
      $scope.newRoles.push(
        {
          name: 'Role' + $scope.newRolesIndex, 
          index: $scope.newRolesIndex++
        });
    };
    
    
    
    $scope.assignClientToNewRole = function (client, role) {
      if(!role.clients) {
        role.clients = []; // if the role has no clients, initialize the array
      }
      role.clients.push({'_id': client._id, 'name': client.name});
      $scope.clientRoles[client.name + role.name] = true;
    }
    
    $scope.assignNewRoleToChannel = function (channel, role) {
      if(!role.channels) {
        role.channels = []; // if the role has no channels, initialize the array
      }
      role.channels.push({'_id': channel._id, 'name': channel.name});
      $scope.channelRoles[channel.name + role.name] = true;
    }
    
    $scope.saveNewRole = function(role) {
      apiCall('save', {name:null}, role);
      Notify.notify('rolesChanged');
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
    
    $scope.removeRole = function(role) {
      Api.Roles.remove({name:role.name}, function() {
        Notify.notify('rolesChanged');
      }, function(error) {
        Alerting.AlertAddMsg('server', 'error', error);
      });
    };
    
    /* -------------------------End Edit Roles---------------------------- */
    
    
    /*------------------------Delete Confirm----------------------------*/
    $scope.confirmDelete = function(role){
      Alerting.AlertReset();

      var deleteObject = {
        title: 'Delete Role',
        button: 'Delete',
        message: 'Are you sure you wish to delete the role "' + role.name + '"?'
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
        // Delete confirmed - delete the user
        $scope.removeRole(role);
      }, function () {
        // delete cancelled - do nothing
      });

    };
    /*------------------------End Delete Confirm----------------------------*/
  });
