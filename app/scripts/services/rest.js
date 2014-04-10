'use strict';

angular.module('openhimWebui2App')
  .factory('Api', function ($resource) {

    var jsonStubHeaders = {
      'JsonStub-User-Key': '0582582f-89b8-436e-aa76-ba5444fc219d',
      'JsonStub-Project-Key': 'eb980467-84d4-4268-ab4c-ae6258fe1ce8'
    };
    var host = 'jsonstub.com';
    var port = '80';

    return {
      Channels: $resource('http://' + host + ':' + port + '/channels.json', null, {
          query: {
            url: 'http://' + host + ':' + port + '/channels/:channelName.json',
            params: { channelname: '@name' },
            headers: jsonStubHeaders,
            isArray: true
          },
          save: {
            method: 'POST',
            headers: jsonStubHeaders
          }
        }),
      Applications: $resource('http://' + host + ':' + port + '/applications/:appId.json', { appId: '@applicationId' }, {
          query: {
            headers: jsonStubHeaders,
            isArray: true
          }
        }),
      Transactions: $resource('http://' + host + ':' + port + '/transactions/:transactionId.json', { transactionId: '@name' }, {
          query: {
            headers: jsonStubHeaders,
            isArray: true
          }
        })
    };
  });
