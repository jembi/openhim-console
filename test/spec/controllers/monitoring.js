'use strict';

describe('Controller: MonitoringCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var MonitoringCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MonitoringCtrl = $controller('MonitoringCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    // TODO
    console.log('Test pending');
  });
});
