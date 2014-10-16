'use strict';

angular.module('openhimWebui2App')
  .factory('Api', function ($resource, HOST, PORT) {

    return {
      Authenticate: $resource('https://' + HOST + ':' + PORT + '/authenticate/:email'),

      Channels: $resource('https://' + HOST + ':' + PORT + '/channels/:channelId', { channelId: '@_id' }, {
        update: { method: 'PUT' }
      }),

      Users: $resource('https://' + HOST + ':' + PORT + '/users/:email', { email: '@email' }, {
        update: { method: 'PUT' }
      }),
      UsersChannelsMatrix: $resource('https://' + HOST + ':' + PORT + '/usersChannelsMatrix', {}),

      Clients: $resource('https://' + HOST + ':' + PORT + '/clients/:clientId', { clientId: '@_id' }, {
        update: { method: 'PUT' }
      }),

      Transactions: $resource('https://' + HOST + ':' + PORT + '/transactions/:transactionId', { transactionId: '@_id' }),

      Mediators: $resource('https://' + HOST + ':' + PORT + '/mediators/:uuid', { uuid: '@uuid' }),

      // add the metric endpoints
      Metrics: $resource('https://' + HOST + ':' + PORT + '/metrics/:type/:channelId', {}),
      MetricsStatus: $resource('https://' + HOST + ':' + PORT + '/metrics/status', {}),

      Tasks: $resource('https://' + HOST + ':' + PORT + '/tasks/:taskId', { taskId: '@_id' }, {
        update: { method: 'PUT' }
      }),

      ContactGroups: $resource('https://' + HOST + ':' + PORT + '/groups/:groupId', { groupId: '@_id' }, {
        update: { method: 'PUT' }
      })

    };
  });