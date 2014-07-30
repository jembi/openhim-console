'use strict';

angular.module('openhimWebui2App')
  .factory('Api', function ($resource, HOST, PORT) {

    return {
      Authenticate: $resource('http://' + HOST + ':' + PORT + '/authenticate/:email'),

      Channels: $resource('http://' + HOST + ':' + PORT + '/channels/:channelName', { channelName: '@name' }, {
        update: { method: 'PUT' }
      }),

      Users: $resource('http://' + HOST + ':' + PORT + '/users/:email', { email: '@email' }, {
        update: { method: 'PUT' }
      }),

      Clients: $resource('http://' + HOST + ':' + PORT + '/clients/:clientID', { clientID: '@clientID' }, {
        update: { method: 'PUT' }
      }),

      Transactions: $resource('http://' + HOST + ':' + PORT + '/transactions/:transactionId', { transactionId: '@_id' }),

      Tasks: $resource('http://' + HOST + ':' + PORT + '/tasks/:taskId', { taskId: '@_id' }, {
        update: { method: 'PUT' }
      })
    };
  });