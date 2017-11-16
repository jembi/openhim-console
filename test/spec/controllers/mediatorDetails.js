'use strict'
/* jshint expr: true */
/* global sinon: false */

describe('Controller: MediatorDetailsCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', {
        'protocol': 'https',
        'host': 'localhost',
        'hostPath': '',
        'port': 8080,
        'title': 'Title',
        'footerTitle': 'FooterTitle',
        'footerPoweredBy': 'FooterPoweredBy',
        'mediatorLastHeartbeatWarningSeconds': 60,
        'mediatorLastHeartbeatDangerSeconds': 120
      })
    })
  })

  var scope, createController, httpBackend, modalSpy // eslint-disable-line

  var testMediator = {
    'urn': 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE',
    'version': '0.0.1',
    'name': 'Test 1 Mediator',
    'description': 'Test 1 Description',
    'defaultChannelConfig': [
      {
        'name': 'Mediator Channel 1',
        'urlPattern': '/channel1',
        'routes': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }],
        'allow': [ 'xdlab' ],
        'type': 'http'
      }
    ],
    'endpoints': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }],
    '_lastHeartbeat': new Date(),
    '_uptime': 3600
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $uibModal) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/mediators/AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE')).respond(testMediator)
    $httpBackend.when('POST', new RegExp('.*/mediators/AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE/channels'), ['Mediator Channel 1']).respond(201)
    $httpBackend.when('POST', new RegExp('.*/mediators/AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE/channels'), ['Mediator Channel 2']).respond(500)

    modalSpy = sinon.spy($uibModal, 'open')

    createController = function () {
      scope = $rootScope.$new()
      return $controller('MediatorDetailsCtrl', { $scope: scope, $routeParams: { urn: 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE' } })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a single meditor to the scope', function () {
    createController()
    httpBackend.flush()
    scope.mediatorDetails.urn.should.equal('AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE')
    scope.mediatorDetails.version.should.equal('0.0.1')
    scope.mediatorDetails.name.should.equal('Test 1 Mediator')
    scope.mediatorDetails.description.should.equal('Test 1 Description')
    scope.mediatorDetails.endpoints[0].name.should.equal('Route 1')
    scope.mediatorDetails.endpoints[0].host.should.equal('localhost')
    scope.mediatorDetails.endpoints[0].port.should.equal('1111')
    scope.mediatorDetails.endpoints[0].primary.should.equal(true)
    scope.mediatorDetails.endpoints[0].type.should.equal('http')
  })

  it('should calculate the lastHeartbeatStatus field based on the last heartbeat', function () {
    createController()
    httpBackend.flush()

    scope.mediatorDetails.lastHeartbeatStatus.should.equal('success')
  })

  it('should set the uptimeDisplay field with a human friendly display string', function () {
    createController()
    httpBackend.flush()

    scope.mediatorDetails.uptimeDisplay.should.equal('an hour')
  })

  it('should construct a config def map by parameter', function () {
    testMediator.configDefs = [ {
      displayName: 'Param 1',
      description: 'Param 1 description',
      param: 'param1',
      type: 'string'
    } ]

    testMediator.config = {
      param1: 'val1'
    }

    createController()
    httpBackend.flush()

    delete testMediator.config
    delete testMediator.configDefs

    scope.mediatorDefsMap.param1.displayName.should.be.equal('Param 1')
    scope.mediatorDefsMap.param1.description.should.be.equal('Param 1 description')
  })

  it('should create an empty map if the mediator has not configDefs', function () {
    createController()
    httpBackend.flush()

    // empty object test
    expect(Object.getOwnPropertyNames(scope.mediatorDefsMap).length).to.be.equal(0)
  })

  it('should save a mediator channel with a particular name', function () {
    createController()
    httpBackend.flush()

    scope.addChannel('Mediator Channel 1')
    httpBackend.flush()
    scope.alerts.top[0].msg.should.be.equal('Successfully installed mediator channel')
  })

  it('should alert when there is an error saving mediator channel with a particular name', function () {
    createController()
    httpBackend.flush()

    scope.addChannel('Mediator Channel 2')
    httpBackend.flush()
    scope.alerts.top[0].msg.should.be.equal('Oops, something went wrong. Could not install mediator channel.')
  })
})
