'use strict';

describe('Controller: ClientsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var ClientsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientsCtrl = $controller('ClientsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of clients to the scope', function () {
    // TODO
    console.log('Test pending');
  });
});
