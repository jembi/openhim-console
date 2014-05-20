'use strict';

describe('Controller: ClientsModalCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var ClientsModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClientsModalCtrl = $controller('ClientsModalCtrl', {
      $scope: scope
    });
  }));

});
