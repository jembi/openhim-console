'use strict';
/* jshint expr: true */

describe('Controller: TasksCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/tasks')).respond([
      { '_id': '53e1eac5e907b57711509853', 'completedDate': '2014-08-06', 'remainingTransactions': 0, 'user': 'testuser', 'created': '2014-08-06', 'transactions': [{ 'tid': '53e072e1ccbb302937ffb773', 'tstatus': 'Completed' }, { 'tid': '53e064d1ccbb302937ffb772', 'tstatus': 'Completed' }], 'status': 'Completed' },
      { '_id': '52e1eac5e807b57711509854', 'completedDate': '2014-08-07', 'remainingTransactions': 2, 'user': 'testuser', 'created': '2014-08-07', 'transactions': [{ 'tid': '54e072e1ccbb302937ffb772', 'tstatus': 'Processing' }], 'status': 'Processing' }
    ]);

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { 'firstname': 'Super', 'surname': 'User', 'email': 'super@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['admin'] },
      { 'firstname': 'Ordinary', 'surname': 'User', 'email': 'normal@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['limited'] }
    ]);

    createController = function() {
      scope = $rootScope.$new();
      return $controller('TasksCtrl', { $scope: scope });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a list of tasks to the scope', function () {
    createController();
    httpBackend.flush();
    scope.tasks.length.should.equal(2);
  });

  it('should attach a list of Users to the scope', function () {
    createController();
    httpBackend.flush();

    scope.users.length.should.equal(2);
    scope.users[0].should.have.property('email', 'super@openim.org');
    scope.users[1].should.have.property('email', 'normal@openim.org');
  });

});