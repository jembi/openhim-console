'use strict';

describe('Controller: UsersCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var UsersCtrl, httpBackend,  scope, modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {
    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      {
        'firstname': 'Super',
        'surname': 'User',
        'email': 'super@openim.org',
        'passwordAlgorithm': 'sample/api',
        'passwordHash': '539aa778930879b01b37ff62',
        'passwordSalt': '79b01b37ff62',
        'groups': ['admin']

      },
      {
        'firstname': 'Ordinary',
        'surname': 'User',
        'email': 'normal@openim.org',
        'passwordAlgorithm': 'sample/api',
        'passwordHash': '539aa778930879b01b37ff62',
        'passwordSalt': '79b01b37ff62',
        'groups': ['limited']
      }
    ]);

    modalSpy = sinon.spy($modal, 'open');

    scope = $rootScope.$new();
    UsersCtrl = $controller('UsersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of users to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/users'));
    UsersCtrl;
    httpBackend.flush();
    scope.users.length.should.equal(2);

  });

  it('should remove a user', function () {
    UsersCtrl;
    httpBackend.flush();

    httpBackend.expectDELETE(new RegExp('.*/users/super@openim.org')).respond(200, '');
    scope.removeUser(scope.users[0]);
    httpBackend.flush();
  });

  it('should open a modal to add a user', function () {
    UsersCtrl
    scope.addUser();

    modalSpy.should.be.calledOnce;

    httpBackend.flush();
  });

  it('should open a modal to edit a user', function () {
    UsersCtrl
    scope.editUser();

    modalSpy.should.be.calledOnce;

    httpBackend.flush();
  });
});
