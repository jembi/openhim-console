'use strict';
/* global sinon:false */
/* jshint expr: true */

describe('Controller: ProfileCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope,$httpBackend) {

    httpBackend = $httpBackend;

    httpBackend.when('GET', new RegExp('.*/authenticate/test@user.org')).respond({
      salt: 'test-salt',
      ts: 'test-ts'
    });


    httpBackend.when('GET', new RegExp('.*/users')).respond({
      '__v': 0,
      '_id': '539846c240f2eb682ffeca4b',
      'email': 'test@user.org',
      'firstname': 'test',
      'passwordAlgorithm': 'sha512',
      'passwordHash': '7d0d1a30d16f5343e3390fe9ef1dd61539a7f797267e0d2241ed22390dfc9743091244ddb2463df2f1adf6df3c355876ed34c6523f1e8d3b7f16f4b2afc8c160',
      'passwordSalt': 'test-salt',
      'surname': 'test',
      'groups': [
        'test',
        'other'
      ]
    });

    httpBackend.when('PUT', new RegExp('.*/users')).respond('user has been successfully updated');

    createController = function() {
      scope = $rootScope.$new();
      scope.consoleSession = {};
      scope.consoleSession.sessionUser = 'test@user.org';
      scope.user = {
        $save: sinon.spy(),
        $update: sinon.spy()
      };
      return $controller('ProfileCtrl', {
        $scope: scope
      });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should fetch a user profile', function () {

    httpBackend.expectGET(new RegExp('.*/users'));
    createController();
    httpBackend.flush();

    scope.user.should.have.property('email', 'test@user.org');
    scope.user.should.have.property('firstname', 'test');
    scope.user.should.have.property('surname', 'test');
    scope.user.groups.should.have.length(2);

  });

  it('should update a user profile', function () {
    createController();
    scope.user.surname = 'new surname';
    scope.save(scope.user);
    httpBackend.expectPUT(new RegExp('.*/users'));
    scope.user.should.have.property('surname', 'new surname');
    httpBackend.expectGET(new RegExp('.*/users'));
    httpBackend.flush();
   //original mock has not been modified
    scope.user.should.have.property('surname', 'test');

  });

  it('should test whether the user profile has all the required fields', function() {
    createController();
    //Set the password and not the reset password

    scope.user.password = 'test-password';
    //Save button should be disabled since the password has not been confirmed
    scope.isUserValid(scope.user,scope.user.password,scope.user.passwordRetype).should.be.false;
    httpBackend.flush();
  });

  it('should create a salt and generate a new hash and save it if a new password is provided in the profile', function() {
    createController();
    //Set the password and not the reset password
    scope.user.email ='test@user.org';
    scope.user.password = 'test-password';
    //Save button should be disabled since the password has not been confirmed
    scope.save(scope.user, scope.user.password);
    scope.user.should.have.property('passwordSalt');
    scope.user.should.have.property('passwordHash');
    httpBackend.expectGET(new RegExp('.*/authenticate'));
    httpBackend.flush();
  });

  it('should refresh the user from api', function () {
    createController();
    scope.user.surname = 'new surname';
    scope.save(scope.user);
    httpBackend.expectPUT(new RegExp('.*/users'));
    scope.user.should.have.property('surname', 'new surname');

    httpBackend.expectGET(new RegExp('.*/users'));
    httpBackend.flush();
    //must be original object from api
    scope.user.should.have.property('surname', 'test');

  });
});