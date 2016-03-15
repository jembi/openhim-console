'use strict';

angular.module('openhimConsoleApp')
  .controller('RolesCtrl', function ($rootScope, $scope, $modal, $interval, Api, Notify, Alerting) {
    
    
    var clientsMirror = null;
    var channelsMirror = null;
    var rolesMirror = null;
    
    /* -------------------------Load Clients---------------------------- */
    var clientQuerySuccess = function(clients){
      if(!clientsMirror) {
        $scope.clientsMirror = clients;
      }
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
    Api.Clients.query(clientQuerySuccess, queryError);

    $scope.$on('clientsChanged', function () {
      Api.Clients.query(clientQuerySuccess, queryError);
    });
    /* -------------------------End Load Clients---------------------------- */
    
  
    /* -------------------------Load Channels---------------------------- */
    var channelQuerySuccess = function(channels){
      if(!channelsMirror) {
        $scope.channelsMirror = channels;
      }
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
    Api.Channels.query(channelQuerySuccess, queryError);

    $scope.$on('channelsChanged', function () {
      Api.Channels.query(channelQuerySuccess, queryError);
    });
    /* -------------------------End Load Channels---------------------------- */
      
    
    /* -------------------------Load Roles---------------------------- */
    
    $scope.$watch('channels', function (newVal, oldVal) {
      if(newVal) {
        loadRoles();
      }
    });
    
    var loadRoles = function () {
      var roleQuerySuccess = function(roles){
        if(!rolesMirror) {
          $scope.rolesMirror = roles;
        }
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
      Api.Roles.query(roleQuerySuccess, queryError);

      $scope.$on('rolesChanged', function () {
        Api.Roles.query(roleQuerySuccess, queryError);
      });
    }    
    /* -------------------------End Load Roles---------------------------- */
    
    $scope.toggleEditRoleNames = function() {
      $scope.editRoleNames = $scope.editRoleNames === true ? false : true;
    }
    
    $scope.addRole = function() {
      console.log('hello');
    }
    
    /* -------------------------Assign Clients to Roles---------------------------- */
    $scope.clientRoles = {};

    $scope.$watch('clientsMirror', function (newVal, oldVal) {
      if(newVal) {
        waitForRolesMirror();
      }
    });
    
    var waitForRolesMirror = function() {
      $scope.$watch('rolesMirror', function (newVal, oldVal) {
        if(newVal) {
          buildClientsRolesObject();
          buildChannelsRolesObject();
        }
      });
    }
    
    var buildClientsRolesObject = function() {
      angular.forEach($scope.clientsMirror, function(client) { 
        angular.forEach($scope.rolesMirror, function(role) {
          $scope.clientRoles[client.name + role.name] = false;
          for (var i=0;i<client.roles.length;i++) {
            if (client.roles[i] == role.name) {
              $scope.clientRoles[client.name + role.name] = true;
            }
          }
        });
      });
    }

    $scope.assignRoleToClient = function(client, role) {
      $scope.clientRoles[client.name + role.name] = true;
      client.roles.push(role.name);
      Api.Clients.update({}, client , function(response){
        Notify.notify('clientsChanged');
      }, function(error) {
        Alerting.AlertAddMsg('server', 'error', error);
      });
    };
    
    $scope.removeRoleFromClient = function(client, role) {
      $scope.clientRoles[client.name + role.name] = false;
      var index = client.roles.indexOf(role.name);
      client.roles.splice(index, 1);
      Api.Clients.update({}, client , function(response) {
        Notify.notify('clientsChanged');
      }, function(error) {
        Alerting.AlertAddMsg('server', 'error', error);
      });
    };
    
    $scope.toggleEditClients = function() {
      $scope.editClients = $scope.editClients === true ? false : true;
    };
    /* -------------------------End Assign Clients to Roles---------------------------- */
    
    
    /* -------------------------Assign Roles To Channels---------------------------- */
    $scope.channelRoles = {};
    var buildChannelsRolesObject = function() {
      angular.forEach($scope.channelsMirror, function(channel) {
        angular.forEach($scope.rolesMirror, function(role) {
          $scope.channelRoles[channel._id + role.name] = false;
          for (var i=0;i<role.channels.length;i++) {
            if (role.channels[i]._id == channel._id) {
              $scope.channelRoles[channel.name + role.name] = true;
            }
          }
        });
      });
    }
    
    $scope.assignRoleToChannel = function(channel, role) {
      $scope.channelRoles[channel.name + role.name] = true;
      channel.allow.push(role.name);
      Api.Channels.update({}, channel, function(result) {
        Notify.notify('channelsChanged');
      }, function(error) {
        Alerting.AlertAddMsg('server', 'error', error);
      });
    };
    
    $scope.removeAssignRoleFromChannel = function(channel, role) {
      $scope.channelRoles[channel.name + role.name] = false;
      var index = channel.allow.indexOf(role.name);
      channel.allow.splice(index, 1);
      Api.Channels.update({}, channel, function(result) {
        Notify.notify('channelsChanged');
      }, function(error) {
        Alerting.AlertAddMsg('server', 'error', error);
      });
    };
    /* -------------------------End Assign Roles To Channels---------------------------- */
  });
