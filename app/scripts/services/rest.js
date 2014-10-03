'use strict';

angular.module('openhimWebui2App')
  .factory('Api', function ($resource, HOST, PORT) {

    return {
      Authenticate: $resource('http://' + HOST + ':' + PORT + '/authenticate/:email'),

      Channels: $resource('http://' + HOST + ':' + PORT + '/channels/:channelId', { channelId: '@_id' }, {
        update: { method: 'PUT' }
      }),

      Users: $resource('http://' + HOST + ':' + PORT + '/users/:email', { email: '@email' }, {
        update: { method: 'PUT' }
      }),

      Clients: $resource('http://' + HOST + ':' + PORT + '/clients/:clientId', { clientId: '@_id' }, {
        update: { method: 'PUT' }
      }),

      Transactions: $resource('http://' + HOST + ':' + PORT + '/transactions/:transactionId', { transactionId: '@_id' }),

      Mediators: $resource('http://' + HOST + ':' + PORT + '/mediators/:uuid', { uuid: '@uuid' }),

      // add the metric endpoints
      Metrics: $resource('http://' + HOST + ':' + PORT + '/metrics/:type/:channelId', {}),
      MetricsStatus: $resource('http://' + HOST + ':' + PORT + '/metrics/status', {}),

      Tasks: $resource('http://' + HOST + ':' + PORT + '/tasks/:taskId', { taskId: '@_id' }, {
        update: { method: 'PUT' }
      }),

      ContactGroups: $resource('http://' + HOST + ':' + PORT + '/groups/:groupId', { groupId: '@_id' }, {
        update: { method: 'PUT' }
      })

    };
  });