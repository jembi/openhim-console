'use strict';

angular.module('openhimConsoleApp')
  .controller('RolesCtrl', function ($rootScope, $scope, $modal, $interval, Api, Alerting) {
    
    $scope.displayAssignClients = {};
    
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
      client.roles.push(role.name);
      client.$update();
    }
    
    $scope.removeRoleFromClient = function(client, role) {
      client.roles.pop(role.name);
      client.$update();
    }
    
    $scope.toggleDisplayAllClients = function() {
      $scope.displayAllClients = $scope.displayAllClients === true ? false : true;
    }; 
  });
