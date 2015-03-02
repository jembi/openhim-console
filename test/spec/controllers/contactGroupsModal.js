'use strict';
/* global sinon:false */
/* jshint expr: true */

describe('Controller: ContactGroupsModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  // setup config constant to be used for API server details
  beforeEach(function(){
    module('openhimWebui2App', function($provide){
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });
    });
  });

  var scope, createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    var modalInstance = sinon.spy();

    createController = function () {
      var contactGroup;
      contactGroup = {
        $save: sinon.spy(),
        $update: sinon.spy()
      };
      return $controller('ContactGroupsModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        contactGroup: contactGroup
      });
    };
  }));

  it('should create a new contact group if this is not an update', function () {
    createController();
    scope.contactGroup.should.be.ok;
  });

  it('should run validateFormContactGroups() for any validation errors - ngErrors.hasErrors -> TRUE', function () {
    createController();

    scope.contactGroup.group = '';
    scope.contactGroup.users = '';

    // run the validate
    scope.validateFormContactGroups();
    scope.ngError.should.have.property('hasErrors', true);
    scope.ngError.should.have.property('group', true);
    scope.ngError.should.have.property('users', true);
  });

  it('should run validateFormContactGroups() for any validation errors - ngErrors.hasErrors -> FALSE', function () {
    createController();

    scope.contactGroup.group = 'Group 1';
    scope.contactGroup.users = [{user: 'User 1', method: 'sms', maxAlerts: 'no max'}, {user: 'User 22', method: 'email', maxAlerts: '1 per day'}];

    // run the validate
    scope.validateFormContactGroups();
    scope.ngError.should.have.property('hasErrors', false);
  });

  it('should run submitFormContactGroups() and check any validation errors - FALSE - should not save the record', function () {
    createController();

    scope.contactGroup.group = '';
    scope.contactGroup.users = '';

    // run the submit
    scope.submitFormContactGroups();
    scope.ngError.should.have.property('hasErrors', true);
    scope.ngError.should.have.property('group', true);
    scope.ngError.should.have.property('users', true);
  });

  it('should run submitFormContactGroups() and check any validation errors - TRUE - Should save the record', function () {
    createController();

    // update is false so create new contact group
    scope.update = false;

    scope.contactGroup.group = 'Group 1';
    scope.contactGroup.users = [{user: 'User 1', method: 'sms', maxAlerts: 'no max'}, {user: 'User 22', method: 'email', maxAlerts: '1 per day'}];

    // run the submit
    scope.submitFormContactGroups();
    scope.ngError.should.have.property('hasErrors', false);
    scope.contactGroup.$save.should.be.called;
  });

  it('should run submitFormContactGroups() and check any validation errors - TRUE - Should update the record', function () {
    createController();

    // update is false so create new contact group
    scope.update = true;

    scope.contactGroup.group = 'Group 1';
    scope.contactGroup.users = [{user: 'User 1', method: 'sms', maxAlerts: 'no max'}, {user: 'User 22', method: 'email', maxAlerts: '1 per day'}];

    // run the submit
    scope.submitFormContactGroups();
    scope.ngError.should.have.property('hasErrors', false);
    scope.contactGroup.$update.should.be.called;

    scope.contactGroup.should.have.property('group', 'Group 1' );
    scope.contactGroup.should.have.property('users');
    scope.contactGroup.users.should.have.length(2);
  });


});
