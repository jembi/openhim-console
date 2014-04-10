'use strict';

describe('Controller: SidebarCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var SidebarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SidebarCtrl = $controller('SidebarCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
