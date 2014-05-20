'use strict';

angular.module('openhimWebui2App')
  .factory('Api', function ($resource) {

    var headers = {};
    var host = '192.168.1.155';
    var port = '8080';

    return {
      Channels: $resource('http://' + host + ':' + port + '/channels', null, {
          query: {
            url: 'http://' + host + ':' + port + '/channels/:channelName',
            params: { channelname: '@name' },
            headers: headers,
            isArray: true
          },
          save: {
            method: 'POST',
            headers: headers
          }
        }),
        Clients: $resource('http://' + host + ':' + port + '/clients/:clientId', { clientId: '@clientId' }, {
          query: {
            headers: headers,
            isArray: true
          }
        }),
        Transactions: $resource('http://' + host + ':' + port + '/transactions/:transactionId', { transactionId: '@name' }, {
          query: {
            headers: headers,
            isArray: true
          }
        })
      };
  });
