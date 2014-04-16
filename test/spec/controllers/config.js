'use strict';

describe('Controller: ConfigCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var ConfigCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigCtrl = $controller('ConfigCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    // TODO
    console.log("Test pending");
  });
});
