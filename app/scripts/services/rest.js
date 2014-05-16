'use strict';

angular.module('openhimWebui2App')
  .factory('Api', function ($resource) {

    var host = 'localhost';
    var port = '8080';

    return {
      Channels: $resource('http://' + host + ':' + port + '/channels/:channelName', { channelName: '@name' }, {
        update: { method: 'PUT' }
      }),
      Applications: $resource('http://' + host + ':' + port + '/applications/:appId', { appId: '@applicationID' }),
      Transactions: $resource('http://' + host + ':' + port + '/transactions/:transactionId', { transactionId: '@_id' })
    };
  });
