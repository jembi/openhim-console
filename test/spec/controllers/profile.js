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
});