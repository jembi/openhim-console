'use strict'
/* global sinon:false */

describe('Controller: TaskDetailsCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/tasks/53e1eac5e907b57711509853')).respond({ '_id': '53e1eac5e907b57711509853', 'completedDate': '2014-08-11T11:57:15.145Z', 'totalTransactions': 2, 'remainingTransactions': 0, 'user': 'testuser', 'created': '2014-08-11T11:57:10.253Z', 'transactions': [{ 'tid': '53e072e1ccbb302937ffb773', 'tstatus': 'Completed' }, { 'tid': '53e064d1ccbb302937ffb772', 'tstatus': 'Completed' }], 'status': 'Completed' })

    createController = function () {
      scope = $rootScope.$new()
      var route = {
        reload: sinon.spy()
      }
      return $controller('TaskDetailsCtrl', { $scope: scope, $routeParams: { taskId: '53e1eac5e907b57711509853' }, $route: route })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a single task to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/tasks/53e1eac5e907b57711509853'))
    createController()
    httpBackend.flush()
    scope.task.user.should.equal('testuser')
    scope.task.transactions.length.should.equal(2)
  })

  it('should get the execution time', function () {
    createController()
    httpBackend.flush()

    var executionTime = scope.getExecutionTime(scope.task)
    executionTime.should.equal('4.89')
  })

  it('should get the amount of rerun transactions that has been processed', function () {
    createController()
    httpBackend.flush()

    var processedTotal = scope.getProcessedTotal(scope.task)
    processedTotal.should.equal(2)
  })

  it('should send a correct update after pausing a task', function () {
    createController()

    var task = [
      { '_id': '53e1eac5e907b57711509853', 'completedDate': '2014-08-11T11:57:15.145Z', 'remainingTransactions': 0, 'user': 'super@openim.org', 'created': '2014-08-11T11:57:10.253Z', 'transactions': [{ 'tid': '53e072e1ccbb302937ffb773', 'tstatus': 'Processing' }, { 'tid': '53e064d1ccbb302937ffb772', 'tstatus': 'Queued' }], 'status': 'Processing' }
    ]

    httpBackend.expectPUT(new RegExp('.*/tasks'), { status: 'Paused' }).respond(200, '')
    scope.pauseTask(task)
    httpBackend.flush()
  })

  it('should send a correct update after resuming a task', function () {
    createController()

    var task = [
      { '_id': '53e1eac5e907b57711509853', 'completedDate': '2014-08-11T11:57:15.145Z', 'remainingTransactions': 0, 'user': 'super@openim.org', 'created': '2014-08-11T11:57:10.253Z', 'transactions': [{ 'tid': '53e072e1ccbb302937ffb773', 'tstatus': 'Processing' }, { 'tid': '53e064d1ccbb302937ffb772', 'tstatus': 'Queued' }], 'status': 'Processing' }
    ]

    httpBackend.expectPUT(new RegExp('.*/tasks'), { status: 'Queued' }).respond(200, '')
    scope.resumeTask(task)
    httpBackend.flush()
  })

  it('should open a modal to confirm cancellation of a task', function () {
    createController()

    var task = [
      { '_id': '53e1eac5e907b57711509853', 'completedDate': '2014-08-11T11:57:15.145Z', 'remainingTransactions': 0, 'user': 'super@openim.org', 'created': '2014-08-11T11:57:10.253Z', 'transactions': [{ 'tid': '53e072e1ccbb302937ffb773', 'tstatus': 'Processing' }, { 'tid': '53e064d1ccbb302937ffb772', 'tstatus': 'Queued' }], 'status': 'Processing' }
    ]

    scope.cancelTask(task)
    httpBackend.flush()
  })
})
