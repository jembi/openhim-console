'use strict';

angular.module('openhimWebui2App')
  .factory('Api', function ($resource) {

    var headers = {
      'JsonStub-User-Key': '0582582f-89b8-436e-aa76-ba5444fc219d',
      'JsonStub-Project-Key': 'eb980467-84d4-4268-ab4c-ae6258fe1ce8'
    };
    var host = 'jsonstub.com';
    var port = '80';

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
        Applications: $resource('http://' + host + ':' + port + '/applications/:appId', { appId: '@applicationId' }, {
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
