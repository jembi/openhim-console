'use strict';

angular.module('openhimWebui2App')
  .factory('Api', function ($rootScope, $resource) {

    // fetch API server details
    var protocol = angular.copy( $rootScope.protocol );
    var host = angular.copy( $rootScope.host );
    var port = angular.copy( $rootScope.port );
    var server = protocol + '://' + host + ':' + port;

    // delete API server details from rootScope
    delete $rootScope.protocol;
    delete $rootScope.host;
    delete $rootScope.port;

    return {
      Authenticate: $resource( server + '/authenticate/:email' ),

      Channels: $resource( server + '/channels/:channelId', { channelId: '@_id' }, {
        update: { method: 'PUT' }
      }),

      Users: $resource( server + '/users/:email', { email: '@email' }, {
        update: { method: 'PUT' }
      }),

      Clients: $resource( server + '/clients/:clientId/:property', { clientId: '@_id', property: '@property' }, {
        update: { method: 'PUT' }
      }),

      Transactions: $resource( server + '/transactions/:transactionId', { transactionId: '@_id' }),

      Mediators: $resource( server + '/mediators/:urn', { urn: '@urn' }),

      // add the metric endpoints
      Metrics: $resource( server + '/metrics/:type/:channelId', {}),
      MetricsStatus: $resource( server + '/metrics/status', {}),

      Tasks: $resource( server + '/tasks/:taskId', { taskId: '@_id' }, {
        update: { method: 'PUT' }
      }),

      ContactGroups: $resource( server + '/groups/:groupId', { groupId: '@_id' }, {
        update: { method: 'PUT' }
      }),

      VisualizerEvents: $resource( server + '/visualizer/events/:receivedTime'),
      VisualizerSync: $resource( server + '/visualizer/sync'),

      // endpoint to restart the core server
      Restart: $resource( server + '/restart', {})

    };
  });
