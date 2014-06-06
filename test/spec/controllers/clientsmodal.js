'use strict';
/* global sinon:false */
/* jshint expr: true */

describe('Controller: ClientsmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    var modalInstance = sinon.spy();

    createController = function (withClient) {
      var client;
      if (withClient) {
        client = {
          $save: sinon.spy(),
          $update: sinon.spy()
        };
      }
      return $controller('ClientsModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        client: client
      });
    };

  }));

  it('should create a new client if this is not an update', function () {
    createController();
    scope.client.should.be.ok;
  });

  it('should save a new client', function () {
    createController();
    sinon.spy(scope.client, '$save');
    scope.save(scope.client);
    scope.client.$save.should.be.called;
  });

  it('should set a client to be updated if one is supplied', function () {
    createController(true);
    scope.client.should.be.ok;
  });

  it('should update an existing client', function () {
    createController(true);
    scope.save(scope.client);
    scope.client.$update.should.be.called;
  });
});
