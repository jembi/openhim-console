'use strict';

angular.module('openhimWebui2App')
  .factory('Api', function ($resource) {

    var host = 'openhim-preprod.jembi.org';
    var port = '8080';

    return {
      Channels: $resource('http://' + host + ':' + port + '/channels/:channelName', { channelName: '@name' }, {
        update: { method: 'PUT' }
      }),
      Clients: $resource('http://' + host + ':' + port + '/clients/:clientId', { clientId: '@clientID' }),
      Transactions: $resource('http://' + host + ':' + port + '/transactions/:transactionId', { transactionId: '@_id' })
    };
  });
