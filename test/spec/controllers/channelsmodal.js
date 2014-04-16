'use strict';

describe('Controller: ChannelsmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var ChannelsmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChannelsModalCtrl = $controller('ChannelsModalCtrl', {
      $scope: scope
    });
  }));

});
