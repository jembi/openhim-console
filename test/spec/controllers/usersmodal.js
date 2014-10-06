'use strict';
/* global sinon:false */
/* jshint expr: true */

describe('Controller: UsersModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { 'firstname': 'Super', 'surname': 'User', 'email': 'super@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['admin'] },
      { 'firstname': 'Ordinary', 'surname': 'User', 'email': 'normal@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['limited'] }
    ]);

    scope = $rootScope.$new();
    var modalInstance = sinon.spy();

    createController = function () {
      var user;
      user = {
        $save: sinon.spy(),
        $update: sinon.spy()
      };
      return $controller('UsersModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        user: user
      });
    };
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should create a new user if this is not an update', function () {
    createController();
    httpBackend.flush();

    scope.user.should.be.ok;
  });

  it('should run validateFormUsers() for any validation errors - ngErrors.hasErrors -> TRUE', function () {
    createController();
    httpBackend.flush();

    scope.user.firstname = '';
    scope.user.surname = '';
    scope.user.msisdn = '2712';
    scope.user.groups = [];
    scope.temp.password = 'password';

    scope.validateFormUsers();
    scope.ngError.should.have.property('hasErrors', true);
    scope.ngError.should.have.property('firstname', true);
    scope.ngError.should.have.property('surname', true);
    scope.ngError.should.have.property('msisdn', true);
    scope.ngError.should.have.property('groups', true);
    scope.ngError.should.have.property('passwordConfirm', true);
  });

  it('should run validateFormUsers() for any validation errors - ngErrors.hasErrors -> FALSE', function () {
    createController();
    httpBackend.flush();

    scope.user.email = 'new@user.com';
    scope.user.firstname = 'John';
    scope.user.surname = 'Doe';
    scope.user.msisdn = '27123456789';
    scope.user.groups = ['group1', 'group2'];
    scope.temp.password = 'password';
    scope.temp.passwordConfirm = 'password';

    scope.validateFormUsers();
    scope.ngError.should.have.property('hasErrors', false);
  });

  it('should run submitFormUsers() and check any validation errors - FALSE - should not save the record', function () {
    createController();
    httpBackend.flush();

    scope.user.firstname = '';
    scope.user.surname = '';
    scope.user.msisdn = '2712';
    scope.user.groups = [];
    scope.temp.password = 'password';

    scope.submitFormUsers();
    scope.ngError.should.have.property('hasErrors', true);
    scope.ngError.should.have.property('firstname', true);
    scope.ngError.should.have.property('surname', true);
    scope.ngError.should.have.property('msisdn', true);
    scope.ngError.should.have.property('groups', true);
    scope.ngError.should.have.property('passwordConfirm', true);
  });

  it('should run submitFormUsers() and check any validation errors - TRUE - Should save the record', function () {
    createController();
    httpBackend.flush();

    // update is false so create new user
    scope.update = false;

    scope.user.email = 'new@user.com';
    scope.user.firstname = 'John';
    scope.user.surname = 'Doe';
    scope.user.msisdn = '27123456789';
    scope.user.groups = ['group1', 'group2'];
    scope.temp.password = 'password';
    scope.temp.passwordConfirm = 'password';
    scope.user.dailyReport = true;
    scope.user.weeklyReport = true;

    scope.submitFormUsers();
    scope.ngError.should.have.property('hasErrors', false);
    scope.user.$save.should.be.called;
  });

  it('should run submitFormUsers() and check any validation errors - TRUE - Should update the record', function () {
    createController();
    httpBackend.flush();

    // update is false so create new user
    scope.update = true;

    scope.user.email = 'new@user.com';
    scope.user.firstname = 'John';
    scope.user.surname = 'Doe';
    scope.user.msisdn = '27987654321';
    scope.user.dailyReport = true;
    scope.user.weeklyReport = true;
    scope.user.groups = ['group333', 'group444', 'group555'];
    scope.temp.password = 'passwordtest';
    scope.temp.passwordConfirm = 'passwordtest';

    scope.submitFormUsers();
    scope.ngError.should.have.property('hasErrors', false);
    scope.user.$update.should.be.called;

    scope.user.should.have.property('passwordSalt' );
    scope.user.should.have.property('passwordHash');
    scope.user.should.have.property('firstname', 'John');
    scope.user.should.have.property('surname', 'Doe');
    scope.user.should.have.property('dailyReport', true);
    scope.user.should.have.property('weeklyReport', true);
    scope.user.should.have.property('msisdn', '27987654321');
    scope.user.groups.should.have.length(3);
  });

  it('should create two taglist objects', function () {
    createController();
    httpBackend.flush();

    scope.taglistUserRoleOptions.should.have.length(2);
    
    scope.taglistUserRoleOptions[0].should.equal('admin');
    scope.taglistUserRoleOptions[1].should.equal('limited');
    
  });

});