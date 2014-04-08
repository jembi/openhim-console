'use strict';

angular.module('openhimWebui2App')
  .factory('channels', function ($resource) {
    return $resource('http://jsonstub.com/channels/:channelName.json', { channelName: '@name' },
      {
        query: {
          headers: {
            'JsonStub-User-Key': '0582582f-89b8-436e-aa76-ba5444fc219d',
            'JsonStub-Project-Key': 'eb980467-84d4-4268-ab4c-ae6258fe1ce8'
          },
          isArray: true
        }
      });
  });
