'use strict';

describe('Controller: ApplicationsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var ApplicationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApplicationsCtrl = $controller('ApplicationsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of applications to the scope', function () {
    // TODO
    console.log("Test pending");
  });
});
