'use strict';
/* jshint expr: true */

describe('Controller: AppConfigCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {

    createController = function() {
      scope = $rootScope.$new();
      return $controller('AppConfigCtrl', { $scope: scope });
    };

  }));

  it('Should create constant variables and assign title to scope', function () {
    createController();
    scope.should.have.property('appTitle');
    scope.should.have.property('appFooterTitle');
  });

});
