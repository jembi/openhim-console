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
          buildClientRolesObject();
        }
      });
    }
    
    var buildClientRolesObject = function() {
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
    $scope.roleAssignedToChannel = function(channel, role) {
      for(var i=0; i<role.channels.length; i++) {
        if ( channel._id == role.channels[i]._id ) {
          return true;
        }
      }
      return false;
    };
    
    // This code will come in handy when we create a roles collection
    // $scope.assignChannelToRole = function(channel, role) {
    //   role.channels.push({"_id":channel._id, "name":channel.name});
    //     Api.Channels.update({}, role, function(result) {
    //     Notify.notify('rolesChanged');
    //   }, function(){});
    // };
    // 
    // $scope.removeChannelFromRole = function(channel, role) {
    //   var index = -1;
    //   for(var i = 0; i < role.channels.length; i++) {
    //     if (role.channels[i]._id === channel._id) {
    //         index = i;
    //         break;
    //     }
    //   }
    //   role.channels.splice(index, 1);
    //   Api.Channels.update({}, role, function(result) {
    //     Notify.notify('rolesChanged');
    //   }, function(){});
    // };
    
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
