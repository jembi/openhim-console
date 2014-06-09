'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var LoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it('should test something', function () {
    // TODO - once this page is implemented
  });
});
