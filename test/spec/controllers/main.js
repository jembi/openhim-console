'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    // TODO
    console.log('Test pending');
  });
});
