'use strict';
/* global sinon:false */
/* jshint expr: true */

describe('Controller: UsersModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    var modalInstance = sinon.spy();

    createController = function (withClient) {
      var user;
      if (withClient) {
        user = {
          $save: sinon.spy(),
          $update: sinon.spy()
        };
      }
      return $controller('UsersModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        user: user
      });
    };
  }));

  it('should create a new user if this is not an update', function () {
    createController();
    scope.user.should.be.ok;
  });

  it('should save a new user', function () {
    createController();
    sinon.spy(scope.user, '$save');
    scope.save(scope.user);
    scope.user.$save.should.be.called;
  });

  it('should set a user to be updated if one is supplied', function () {
    createController(true);
    scope.user.should.be.ok;
  });

  it('should update an existing user', function () {
    createController(true);
    scope.save(scope.user);
    scope.user.$update.should.be.called;
  });

});