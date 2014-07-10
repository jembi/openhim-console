'use strict';

angular.module('openhimWebui2App')
  .factory('Api', function ($resource) {

    var host = '192.168.1.177';
    var port = '8080';

    return {
      Authenticate: $resource('http://' + host + ':' + port + '/authenticate/:email'),

      Channels: $resource('http://' + host + ':' + port + '/channels/:channelName', { channelName: '@name' }, {
        update: { method: 'PUT' }
      }),

      Users: $resource('http://' + host + ':' + port + '/users/:email', { email: '@email' }, {
        update: { method: 'PUT' }
      }),

      Clients: $resource('http://' + host + ':' + port + '/clients/:clientID', { clientID: '@clientID' }, {
        update: { method: 'PUT' }
      }),

      Transactions: $resource('http://' + host + ':' + port + '/transactions/:transactionId', { transactionId: '@_id' }),

      Tasks: $resource('http://' + host + ':' + port + '/tasks/:taskId', { taskId: '@_id' }, {
        update: { method: 'PUT' }
      })
    };
  });