'use strict';

angular.module('openhimConsoleApp')
  .controller('RolesCtrl', function ($rootScope, $scope, $modal, $interval, Api, Alerting) {
    
    $scope.displayAssignClients = {};
    $scope.closeX = {};
    $scope.addPlus= {};
    
    /* -------------------------Load Clients---------------------------- */
    var querySuccess = function(clients){
      $scope.clients = clients;
      if( clients.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no clients created');
      }
    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    // do the initial request
    Api.Clients.query(querySuccess, queryError);

    $scope.$on('clientsChanged', function () {
      Api.Clients.query(querySuccess, queryError);
    });
    /* -------------------------Load Clients---------------------------- */
    
  
    /* -------------------------Load Channels---------------------------- */
    var querySuccess = function(channels){
      $scope.channels = channels;
      if( channels.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no channels created');
      }
    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    // do the initial request
    Api.Channels.query(querySuccess, queryError);

    $scope.$on('channelsChanged', function () {
      Api.Channels.query(querySuccess, queryError);
    });
    /* -------------------------Load Channels---------------------------- */
      
    
    /* -------------------------Load Roles---------------------------- */
    
    $scope.$watch('channels', function (newVal, oldVal) {
      if(newVal) {
        loadRoles();
      }
    });
    
    var loadRoles = function () {
      var querySuccess = function(roles){
        $scope.roles = roles;
        if( roles.length === 0 ){
          Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no roles created');
        }
      };

      var queryError = function(err){
        // on error - add server error alert
        Alerting.AlertAddServerMsg(err.status);
      };

      // do the initial request
      Api.Roles.query(querySuccess, queryError);

      $scope.$on('rolesChanged', function () {
        Api.Roles.query(querySuccess, queryError);
      });
    }    
    /* -------------------------Load Roles---------------------------- */
    
    
    $scope.roleAssignedToChannel = function(channelID, roleChannels) {
      for(var i=0; i<roleChannels.length; i++) {
        if ( channelID == roleChannels[i]._id ) {
          return true;
        }
      }
      return false;
    }; 
    
    $scope.roleAssignedToClient = function(client, role) {
      for (var i=0;i<client.roles.length;i++) {
        if (client.roles[i] == role.name) {
          return true;
        }
      }
      return false;
    };
    
    $scope.displayAssignRoleToClients = function(role) {
      $scope.displayAssignClients[role.name] = $scope.displayAssignClients[role.name] === true ? false : true;
    }; 
    
    $scope.assignRoleToClient = function(client, role) {
      $scope.clientEdited = true;
      for (var i=0;i<$scope.clients.length;i++) {
        if ($scope.clients[i]._id == client._id) {
          if ($scope.clients[i].roles.length > 0) {
            for (var j=0;j<$scope.clients[i].roles.length;j++) {
              if (! ($scope.clients[i].roles[j] == role.name)) {
                $scope.clients[i].roles.push(role.name);
              }
            }
          } else {
            $scope.clients[i].roles.push(role.name);
          }
        } 
      }
    };
    
    $scope.removeRoleFromClient = function(client, role) {
      $scope.clientEdited = true;
      for (var i=0;i<$scope.clients.length;i++) {
        if ($scope.clients[i]._id == client._id) {
            $scope.clients[i].roles.pop(role.name);
        }
      }
    };
    
    $scope.toggleCloseX = function(client, role) {
      $scope.closeX[role.name+client.name] = $scope.closeX[role.name+client.name] === true ? false : true;
    };
    
    $scope.toggleAddPlus = function(client, role) {
      $scope.addPlus[role.name+client.name] = $scope.addPlus[role.name+client.name] === true ? false : true;
    };
    
    $scope.toggleDisplayAllClients = function() {
      $scope.displayAllClients = $scope.displayAllClients === true ? false : true;
    }; 
    
    $scope.writeClientEditToApi = function() {
        console.log('hello');
    }
  });
