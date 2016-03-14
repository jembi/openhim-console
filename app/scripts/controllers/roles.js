'use strict';

angular.module('openhimConsoleApp')
  .controller('RolesCtrl', function ($rootScope, $scope, $modal, $interval, Api, Notify, Alerting) {
    
    $scope.clientsObject = {};
    $scope.channelsObject = {};
    $scope.rolesObject = {};
    
    /* -------------------------Load Clients---------------------------- */
    var clientQuerySuccess = function(clients){
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
    /* -------------------------Load Clients---------------------------- */
    
  
    /* -------------------------Load Channels---------------------------- */
    var channelQuerySuccess = function(channels){
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
    /* -------------------------Load Channels---------------------------- */
      
    
    /* -------------------------Load Roles---------------------------- */
    
    $scope.$watch('channels', function (newVal, oldVal) {
      if(newVal) {
        loadRoles();
      }
    });
    
    var loadRoles = function () {
      var roleQuerySuccess = function(roles){
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
    $scope.roleAssignedToClient = function(client, role) {
      if(client.roles) {
        for (var i=0;i<client.roles.length;i++) {
          if (client.roles[i] == role.name) {
            return true;
          }
        }
        return false;
      }
    };
    
    $scope.assignRoleToClient = function(client, role) {
      client.roles.push(role.name);
      client.$update(function(result) {
        Notify.notify('clientsChanged');
      }, function(){});
    };
    
    $scope.removeRoleFromClient = function(client, role) {
      var index = client.roles.indexOf(role.name);
      client.roles.splice(index, 1);
      client.$update(function(result) {
        Notify.notify('clientsChanged');
      }, function(){});
    };
    
    $scope.toggleEditClients = function() {
      $scope.editClients = $scope.editClients === true ? false : true;
    };
    /* -------------------------Assign Clients to Roles---------------------------- */
    
    
    /* -------------------------Assign Roles To Channels---------------------------- */
    $scope.roleAssignedToChannel = function(channel, role) {
      for(var i=0; i<role.channels.length; i++) {
        if ( channel._id == role.channels[i]._id ) {
          return true;
        }
      }
      return false;
    };
    
    $scope.assignChannelToRole = function(channel, role) {
      role.channels.push({"_id":channel._id, "name":channel.name});
      role.$update(function(result) {
        Notify.notify('rolesChanged');
      }, function(){});
    };
    
    $scope.removeChannelFromRole = function(channel, role) {
      var index = -1;
      for(var i = 0; i < role.channels.length; i++) {
        if (role.channels[i]._id === channel._id) {
            index = i;
            break;
        }
      }
      role.channels.splice(index, 1);
      role.$update(function(result) {
        Notify.notify('rolesChanged');
      }, function(){});
    };
    
    $scope.assignRoleToChannel = function(channel, role) {
      channel.allow.push(role.name);
      channel.$update(function(result) {
        Notify.notify('channelsChanged');
      }, function(){});
    };
    
    $scope.removeAssignRoleFromChannel = function(channel, role) {
      var index = channel.allow.indexOf(role.name);
      channel.allow.splice(index, 1);
      channel.$update(function(result) {
        Notify.notify('channelsChanged');
      }, function(){});
    };
    /* -------------------------Assign Roles To Channels---------------------------- */
  });
