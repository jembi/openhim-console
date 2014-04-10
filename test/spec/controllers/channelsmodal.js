'use strict';

describe('Controller: ChannelsmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var ChannelsmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChannelsmodalCtrl = $controller('ChannelsmodalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
