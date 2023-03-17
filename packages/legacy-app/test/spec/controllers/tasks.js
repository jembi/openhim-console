'use strict'
/* global sinon:false */

describe('Controller: TasksCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/tasks\\?(filterLimit|filterPage)')).respond([
      { _id: '53e1eac5e907b57711509853', completedDate: '2014-08-11T11:57:15.145Z', totalTransactions: 2, remainingTransactions: 0, user: 'super@openim.org', created: '2014-08-11T11:57:10.253Z', transactions: [{ tid: '53e072e1ccbb302937ffb773', tstatus: 'Completed' }, { tid: '53e064d1ccbb302937ffb772', tstatus: 'Completed' }], status: 'Completed' },
      { _id: '52e1eac5e807b57711509854', completedDate: '2014-08-11T11:53:46.483Z', totalTransactions: 1, remainingTransactions: 1, user: 'testuser', created: '2014-08-11T11:53:39.971Z', transactions: [{ tid: '54e072e1ccbb302937ffb772', tstatus: 'Processing' }], status: 'Processing' }
    ])

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { firstname: 'Super', surname: 'User', email: 'super@openhim.org', passwordAlgorithm: 'sample/api', passwordHash: '539aa778930879b01b37ff62', passwordSalt: '79b01b37ff62', groups: ['admin'] },
      { firstname: 'Ordinary', surname: 'User', email: 'normal@openhim.org', passwordAlgorithm: 'sample/api', passwordHash: '539aa778930879b01b37ff62', passwordSalt: '79b01b37ff62', groups: ['limited'] }
    ])

    $httpBackend.when('GET', new RegExp('.*/heartbeat')).respond({ now: Date.now() })

    createController = function () {
      scope = $rootScope.$new()
      var route = {
        reload: sinon.spy()
      }
      return $controller('TasksCtrl', { $scope: scope, $route: route })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a list of tasks to the scope', function () {
    createController()
    httpBackend.flush()
    scope.tasks.length.should.equal(2)
  })

  it('should attach a list of Users to the scope', function () {
    createController()
    httpBackend.flush()

    scope.users.length.should.equal(2)
    scope.users[0].should.have.property('email', 'super@openhim.org')
    scope.users[1].should.have.property('email', 'normal@openhim.org')
  })

  it('should clear all filters', function () {
    createController()
    httpBackend.flush()

    scope.filters.limit = 100
    scope.filters.status = 'Completed'
    scope.filters.user = 'super@openhim.org'
    scope.filters.date = '2014-08-06'

    scope.clearFilters()

    scope.filters.should.have.property('limit', 100)
    scope.filters.should.have.property('status', '')
    scope.filters.should.have.property('user', '')
    scope.filters.should.have.property('date', '')

    httpBackend.flush()
  })

  it('should get the execution time', function () {
    createController()
    httpBackend.flush()

    var executionTime1 = scope.getExecutionTime(scope.tasks[0])
    var executionTime2 = scope.getExecutionTime(scope.tasks[1])

    executionTime1.should.equal('4.89')
    executionTime2.should.equal('6.51')
  })

  it('should get the amount of rerun transactions that has been processed', function () {
    createController()
    httpBackend.flush()

    var processedTotal1 = scope.getProcessedTotal(scope.tasks[0])
    var processedTotal2 = scope.getProcessedTotal(scope.tasks[1])

    processedTotal1.should.equal(2)
    processedTotal2.should.equal(0)
  })

  it('should attach a list of tasks to the scope', function () {
    createController()
    httpBackend.flush()

    var tasks = [
      { _id: '53e1eac5e907b57711509853', completedDate: '2014-08-11T11:57:15.145Z', remainingTransactions: 0, user: 'super@openim.org', created: '2014-08-11T11:57:10.253Z', transactions: [{ tid: '53e072e1ccbb302937ffb773', tstatus: 'Completed' }, { tid: '53e064d1ccbb302937ffb772', tstatus: 'Completed' }], status: 'Completed' },
      { _id: '52e1eac5e807b57711509854', completedDate: '2014-08-11T11:53:46.483Z', remainingTransactions: 1, user: 'testuser', created: '2014-08-11T11:53:39.971Z', transactions: [{ tid: '54e072e1ccbb302937ffb772', tstatus: 'Processing' }], status: 'Processing' }
    ]

    scope.refreshSuccess(tasks)
    scope.tasks.length.should.equal(2)
  })

  it('should attach a warning alert for no tasks found', function () {
    createController()
    httpBackend.flush()

    var tasks = []

    scope.refreshSuccess(tasks)
    scope.tasks.length.should.equal(0)
    scope.alerts.bottom.length.should.equal(1)
    scope.alerts.bottom[0].should.have.property('msg', 'There are no tasks for the current filters')
  })

  it('should send a correct update after pausing a task', function () {
    createController()

    var task = [
      { _id: '53e1eac5e907b57711509853', completedDate: '2014-08-11T11:57:15.145Z', remainingTransactions: 0, user: 'super@openim.org', created: '2014-08-11T11:57:10.253Z', transactions: [{ tid: '53e072e1ccbb302937ffb773', tstatus: 'Processing' }, { tid: '53e064d1ccbb302937ffb772', tstatus: 'Queued' }], status: 'Processing' }
    ]

    httpBackend.expectPUT(new RegExp('.*/tasks'), { status: 'Paused' }).respond(200, '')
    scope.pauseTask(task)
    httpBackend.flush()
  })

  it('should send a correct update after resuming a task', function () {
    createController()

    var task = [
      { _id: '53e1eac5e907b57711509853', completedDate: '2014-08-11T11:57:15.145Z', remainingTransactions: 0, user: 'super@openim.org', created: '2014-08-11T11:57:10.253Z', transactions: [{ tid: '53e072e1ccbb302937ffb773', tstatus: 'Processing' }, { tid: '53e064d1ccbb302937ffb772', tstatus: 'Queued' }], status: 'Processing' }
    ]

    httpBackend.expectPUT(new RegExp('.*/tasks'), { status: 'Queued' }).respond(200, '')
    scope.resumeTask(task)
    httpBackend.flush()
  })

  it('should open a modal to confirm cancellation of a task', function () {
    createController()

    var task = [
      { _id: '53e1eac5e907b57711509853', completedDate: '2014-08-11T11:57:15.145Z', remainingTransactions: 0, user: 'super@openim.org', created: '2014-08-11T11:57:10.253Z', transactions: [{ tid: '53e072e1ccbb302937ffb773', tstatus: 'Processing' }, { tid: '53e064d1ccbb302937ffb772', tstatus: 'Queued' }], status: 'Processing' }
    ]

    scope.cancelTask(task)
    httpBackend.flush()
  })

  it('should prepend new tasks to the scope', function () {
    createController()
    httpBackend.flush()

    var originalLength = scope.tasks.length

    httpBackend.when('GET', new RegExp('.*/tasks')).respond([
      { _id: '53e1eac5e907b57711509999', completedDate: '2014-08-11T11:57:15.145Z', totalTransactions: 2, remainingTransactions: 0, user: 'super@openim.org', created: '2014-08-11T11:57:10.253Z', transactions: [{ tid: '53e072e1ccbb302937ffb773', tstatus: 'Completed' }, { tid: '53e064d1ccbb302937ffb772', tstatus: 'Completed' }], status: 'Completed' }
    ])

    scope.pollForLatest()
    httpBackend.flush()

    scope.tasks.length.should.equal(originalLength + 1)
    scope.tasks[0]._id.should.equal('53e1eac5e907b57711509999')
  })

  it('should update "Processing" tasks', function () {
    createController()
    httpBackend.flush()

    // did it load correctly...
    scope.tasks[1]._id.should.equal('52e1eac5e807b57711509854')
    scope.tasks[1].status.should.equal('Processing')

    httpBackend.when('GET', new RegExp('.*/tasks/52e1eac5e807b57711509854')).respond(
      { _id: '52e1eac5e807b57711509854', completedDate: '2014-08-11T11:53:46.483Z', remainingTransactions: 0, user: 'testuser', created: '2014-08-11T11:53:39.971Z', transactions: [{ tid: '54e072e1ccbb302937ffb772', tstatus: 'Successful' }], status: 'Completed' }
    )

    scope.pollForProcessingUpdates()
    httpBackend.flush()

    // only status should change, position in array must be the same
    scope.tasks[1]._id.should.equal('52e1eac5e807b57711509854')
    scope.tasks[1].status.should.equal('Completed')
  })
})
