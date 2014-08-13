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
      { '_id': '53e1eac5e907b57711509853', 'completedDate': '2014-08-11T11:57:15.145Z', 'remainingTransactions': 0, 'user': 'super@openim.org', 'created': '2014-08-11T11:57:10.253Z', 'transactions': [{ 'tid': '53e072e1ccbb302937ffb773', 'tstatus': 'Completed' }, { 'tid': '53e064d1ccbb302937ffb772', 'tstatus': 'Completed' }], 'status': 'Completed' },
      { '_id': '52e1eac5e807b57711509854', 'completedDate': '2014-08-11T11:53:46.483Z', 'remainingTransactions': 1, 'user': 'testuser', 'created': '2014-08-11T11:53:39.971Z', 'transactions': [{ 'tid': '54e072e1ccbb302937ffb772', 'tstatus': 'Processing' }], 'status': 'Processing' }
    ]);

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { 'firstname': 'Super', 'surname': 'User', 'email': 'super@openhim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['admin'] },
      { 'firstname': 'Ordinary', 'surname': 'User', 'email': 'normal@openhim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['limited'] }
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
    scope.users[0].should.have.property('email', 'super@openhim.org');
    scope.users[1].should.have.property('email', 'normal@openhim.org');
  });

  it('should clear all filters', function () {
    createController();
    httpBackend.flush();

    scope.filter.status = 'Completed';
    scope.filter.user = 'super@openhim.org';
    scope.filter.created = '2014-08-06';
    
    scope.clearFilters();

    scope.filter.should.not.have.property('status');
    scope.filter.should.not.have.property('user');
    scope.filter.should.not.have.property('created');
  });

  it('should get the execution time', function () {
    createController();
    httpBackend.flush();

    var executionTime1 = scope.getExecutionTime(scope.tasks[0]);
    var executionTime2 = scope.getExecutionTime(scope.tasks[1]);

    executionTime1.should.equal('4.89');
    executionTime2.should.equal('6.51');
  });

  it('should get the amount of rerun transactions that has been processed', function () {
    createController();
    httpBackend.flush();

    var processedTotal1 = scope.getProcessedTotal(scope.tasks[0]);
    var processedTotal2 = scope.getProcessedTotal(scope.tasks[1]);

    processedTotal1.should.equal(2);
    processedTotal2.should.equal(0);
  });

  it('should attach a list of tasks to the scope', function () {
    createController();
    httpBackend.flush();

    var tasks = [
      { '_id': '53e1eac5e907b57711509853', 'completedDate': '2014-08-11T11:57:15.145Z', 'remainingTransactions': 0, 'user': 'super@openim.org', 'created': '2014-08-11T11:57:10.253Z', 'transactions': [{ 'tid': '53e072e1ccbb302937ffb773', 'tstatus': 'Completed' }, { 'tid': '53e064d1ccbb302937ffb772', 'tstatus': 'Completed' }], 'status': 'Completed' },
      { '_id': '52e1eac5e807b57711509854', 'completedDate': '2014-08-11T11:53:46.483Z', 'remainingTransactions': 1, 'user': 'testuser', 'created': '2014-08-11T11:53:39.971Z', 'transactions': [{ 'tid': '54e072e1ccbb302937ffb772', 'tstatus': 'Processing' }], 'status': 'Processing' }
    ];

    scope.querySuccess(tasks);
    scope.tasks.length.should.equal(2);
  });

  it('should attach a warning alert for no tasks found', function () {
    createController();
    httpBackend.flush();

    var tasks = [];

    scope.querySuccess(tasks);
    scope.tasks.length.should.equal(0);
    scope.alerts.top.length.should.equal(1);
    scope.alerts.top[0].should.have.property('msg', 'There are currently no tasks created');
  });

});