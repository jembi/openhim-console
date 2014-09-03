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

    createController = function () {
      var client;
      client = {
        $save: sinon.spy(),
        $update: sinon.spy()
      };
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

  it('should run validateFormClients() for any validation errors - ngErrors.hasErrors -> TRUE', function () {
    createController();

    scope.client.clientID = '';
    scope.client.name = '';
    scope.client.clientDomain = '';
    scope.client.roles = [];
    scope.temp.password = 'password';

    // run the validate
    scope.validateFormClients();
    scope.ngError.should.have.property('hasErrors', true);
    scope.ngError.should.have.property('clientID', true);
    scope.ngError.should.have.property('name', true);
    scope.ngError.should.have.property('clientDomain', true);
    scope.ngError.should.have.property('roles', true);
    scope.ngError.should.have.property('passwordConfirm', true);
  });

  it('should run validateFormClients() for any validation errors - ngErrors.hasErrors -> FALSE', function () {
    createController();

    scope.client.clientID = 'clientID';
    scope.client.name = 'clientName';
    scope.client.clientDomain = 'clientDomain';
    scope.client.roles = ['admin', 'Poc'];
    scope.temp.password = 'password';
    scope.temp.passwordConfirm = 'password';

    // run the validate
    scope.validateFormClients();
    scope.ngError.should.have.property('hasErrors', false);
  });

  it('should run submitFormClients() and check any validation errors - FALSE - should not save the record', function () {
    createController();

    scope.client.clientID = '';
    scope.client.name = '';
    scope.client.clientDomain = '';
    scope.client.roles = [];
    scope.temp.password = 'password';

    // run the submit
    scope.submitFormClients();
    scope.ngError.should.have.property('hasErrors', true);
    scope.ngError.should.have.property('clientID', true);
    scope.ngError.should.have.property('name', true);
    scope.ngError.should.have.property('clientDomain', true);
    scope.ngError.should.have.property('roles', true);
    scope.ngError.should.have.property('passwordConfirm', true);
  });

  it('should run submitFormClients() and check any validation errors - TRUE - Should save the record', function () {
    createController();

    // update is false so create new client
    scope.update = false;

    scope.client.clientID = 'clientID';
    scope.client.name = 'clientName';
    scope.client.clientDomain = 'clientDomain';
    scope.client.roles = ['admin', 'Poc'];
    scope.temp.password = 'password';
    scope.temp.passwordConfirm = 'password';

    // run the submit
    scope.submitFormClients();
    scope.ngError.should.have.property('hasErrors', false);
    scope.client.$save.should.be.called;
  });

  it('should run submitFormClients() and check any validation errors - TRUE - Should update the record', function () {
    createController();

    // update is false so create new client
    scope.update = true;

    scope.client.clientID = 'clientID';
    scope.client.name = 'clientName';
    scope.client.clientDomain = 'clientDomain';
    scope.client.roles = ['admin', 'Poc'];
    scope.temp.password = 'password';
    scope.temp.passwordConfirm = 'password';

    // run the submit
    scope.submitFormClients();
    scope.ngError.should.have.property('hasErrors', false);
    scope.client.$update.should.be.called;

    scope.client.should.have.property('passwordSalt' );
    scope.client.should.have.property('passwordHash');
    scope.client.should.have.property('clientID', 'clientID');
    scope.client.should.have.property('name', 'clientName');
    scope.client.should.have.property('clientDomain', 'clientDomain');
    scope.client.roles.should.have.length(2);
  });




});
