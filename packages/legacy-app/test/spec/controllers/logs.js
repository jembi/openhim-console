'use strict'

describe('Controller: LogsCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend, location, rootScope

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $location) {
    httpBackend = $httpBackend
    location = $location
    rootScope = $rootScope

    $httpBackend.when('GET', new RegExp('.*/logs')).respond([
      {
        label: 'worker1',
        meta: {},
        level: 'info',
        timestamp: '2015-10-29T09:40:31.536Z',
        message: 'Some message'
      },
      {
        label: 'worker1',
        meta: {},
        level: 'info',
        timestamp: '2015-10-29T09:40:39.128Z',
        message: 'Another message'
      }
    ])

    createController = function () {
      scope = $rootScope.$new()
      return $controller('LogsCtrl', { $scope: scope })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should fetch initial logs', function () {
    createController()
    httpBackend.flush()

    var logArr = scope.logs.split('\n')
    logArr[0].should.contain(' - info: [worker1] Some message')
    logArr[1].should.contain(' - info: [worker1] Another message')
  })

  it('should send data range in ISO 8601 format', function () {
    location.search({ level: 'debug', from: '2015-11-03 10:50', until: '2015-11-03 11:00' })
    rootScope.$apply()

    httpBackend.expectGET(new RegExp('.*/logs\\?from=2015-11-03T10:50:00.*&level=debug&until=2015-11-03T11:00:00.*'))

    createController()
    httpBackend.flush()
  })

  it('should reset the scope', function () {
    location.search({ level: 'debug', from: '2015-11-03 10:50', until: '2015-11-03 11:00' })
    rootScope.$apply()

    createController()
    httpBackend.flush()
    scope.reset()

    scope.params.level.should.equal('info')
    expect(scope.params.from).to.not.exist()
    expect(scope.params.until).to.not.exist()
  })
})
