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

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
