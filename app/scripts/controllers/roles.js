'use strict';

angular.module('openhimConsoleApp')
  .controller('RolesCtrl', function ($rootScope, $scope, $modal, $interval, Api, Notify, Alerting) {
    
    
    var clientsMirror = null;
    var channelsMirror = null;
    var rolesMirror = null;
    $scope.addNewRole = false;
    $scope.newRoles = [];
    $scope.newRolesIndex = 0;
    
    /* -------------------------Load Clients---------------------------- */
    var clientQuerySuccess = function(clients){
      if(!clientsMirror) {
        $scope.clientsMirror = clients;
      }
      $scope.clients = clients;
      if( clients.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no clients created');
      } else {
        Alerting.AlertReset('bottom');
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
      } else {
        Alerting.AlertReset('bottom');
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
        } else {
          Alerting.AlertReset('bottom');
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
    
    
    /* -------------------------Assign Clients to Roles---------------------------- */
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
          angular.forEach($scope.rolesMirror, function(role) {
            role.displayName = role.name;
          });
        }
      });
    }
    
    $scope.clientRoles = {};
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

    $scope.assignRoleToClient = function(client, role, save) {
      $scope.clientRoles[client.name + role.name] = true;
      client.roles.push(role.name);
      if(save) {
        Api.Clients.update({}, client , function(response){
          Notify.notify('clientsChanged');
        }, function(error) {
          Alerting.AlertAddMsg('server', 'error', error);
        });
      }
    };
    
    $scope.removeRoleFromClient = function(client, role, save) {
      $scope.clientRoles[client.name + role.name] = false;
      var index = client.roles.indexOf(role.name);
      client.roles.splice(index, 1);
      if(save) {
        Api.Clients.update({}, client , function(response) {
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
      angular.forEach($scope.channelsMirror, function(channel) {
        angular.forEach($scope.rolesMirror, function(role) {
          $scope.channelRoles[channel.name + role.name] = false;
          for (var i=0;i<role.channels.length;i++) {
            if (role.channels[i]._id == channel._id) {
              $scope.channelRoles[channel.name + role.name] = true;
            }
          }
        });
      });
    }
    
    $scope.assignRoleToChannel = function(channel, role, save) {
      $scope.channelRoles[channel.name + role.name] = true;
      channel.allow.push(role.name);
      if(save) {
        Api.Channels.update({}, channel, function(result) {
          Notify.notify('channelsChanged');
        }, function(error) {
          Alerting.AlertAddMsg('server', 'error', error);
        });
      }
    };
    
    $scope.removeAssignRoleFromChannel = function(channel, role, save) {
      $scope.channelRoles[channel.name + role.name] = false;
      var index = channel.allow.indexOf(role.name);
      channel.allow.splice(index, 1);
      if(save) {
        Api.Channels.update({}, channel, function(result) {
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
      angular.forEach($scope.clientsMirror, function(client) {
        for (var i=0;i<client.roles.length;i++) {
          if (client.roles[i] == role.name) {
            $scope.clientRoles[client.name + role.displayName] = true;
            client.roles.push(role.displayName);
          }
        }
      });

      angular.forEach($scope.channelsMirror, function(channel) {
        for (var i=0;i<role.channels.length;i++) {
          if (role.channels[i]._id == channel._id) {
            $scope.channelRoles[channel.name + role.displayName] = true;
            channel.allow.push(role.displayName);
          }
        }
      });
      $scope.removeRole(role);
      updateChannels(role);
      updateClients(role);
      
      $scope.nameSaved[role.displayName] = true;
    }
    
    $scope.toggleEditRoleNames = function() {
      $scope.editRoleNames = $scope.editRoleNames === true ? false : true;
      $scope.nameSaved = [];
    }
    
    $scope.addRole = function() {
      $scope.newRoles.push(
        {
          name: "Role" + $scope.newRolesIndex, 
          index: $scope.newRolesIndex++
        });
    }
    
    $scope.removeNewRole = function(role) {
      var spliceIndex = -1;
      for(var i = 0; i<$scope.newRoles.length; i++) {
         if ($scope.newRoles[i].name ===  role.name) {
             spliceIndex = i;
             break;
         }
      }
      $scope.newRoles.splice(spliceIndex, 1);
    }
    
    $scope.saveNewRole = function(role) {
      var roleAssignedToChannel = false;
      for(var k in $scope.channelRoles) {
        var channelIndex = k.indexOf(role.name);
        if( channelIndex > 0) {
          roleAssignedToChannel = true;
        }
      }
      
      var clientAssignedToRole = false;
      for(var k in $scope.clientRoles) {
        var clientIndex = k.indexOf(role.name);
        if( clientIndex > 0) {
          clientAssignedToRole = true;
        }
      }
      
      if (roleAssignedToChannel) {
        updateChannels(role);
        if (clientAssignedToRole) {
          updateClients(role);
        }
        $scope.removeNewRole(role);
        Alerting.AlertReset('bottom');
      } else {
        Alerting.AlertAddMsg('bottom', 'warning', 'Please assign a new role to at least on Channel');
      }
    }
    
    var updateChannels = function(role) {
      for(var k in $scope.channelRoles) {
        var channelIndex = k.indexOf(role.name);
        if( channelIndex > 0) {
          angular.forEach($scope.channelsMirror, function(channel) {
            if(channel.name == k.substring(0, channelIndex)) {
              Api.Channels.update({}, channel, function(result) {
                Notify.notify('channelsChanged');
              }, function(error) {
                Alerting.AlertAddMsg('server', 'error', error);
              });
            }
          });
        }
      }
    }
    
    var updateClients = function(role) {
      for(var k in $scope.clientRoles) {
        var clientIndex = k.indexOf(role.name);
        if( clientIndex > 0) {
          angular.forEach($scope.clientsMirror, function(client) {
            if(client.name == k.substring(0, clientIndex)) {
              Api.Clients.update({}, client, function(result) {
                Notify.notify('clientsChanged');
              }, function(error) {
                Alerting.AlertAddMsg('server', 'error', error);
              });
            }
          });
        }
      }
    }
    
    $scope.removeRole = function(role) {
      angular.forEach($scope.channels, function(channel) {
        var channelSpliceIndex = channel.allow.indexOf(role.name);
        if(channelSpliceIndex >= 0) {
          channel.allow.splice(channelSpliceIndex, 1);
          Api.Channels.update({}, channel, function(result) {
            Notify.notify('channelsChanged');
          }, function(error) {
            Alerting.AlertAddMsg('server', 'error', error);
          });
        }
      });
      
      angular.forEach($scope.clients, function(client) {
        var clientSpliceIndex = client.roles.indexOf(role.name);
        if(clientSpliceIndex > 0) {
          client.roles.splice(clientSpliceIndex, 1);
          Api.Clients.update({}, client, function(result) {
            Notify.notify('clientsChanged');
          }, function(error) {
            Alerting.AlertAddMsg('server', 'error', error);
          });
        }
      });
    }
    
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
