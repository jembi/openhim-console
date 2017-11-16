'use strict'
/* jshint expr: true */
/* global sinon: false */
/* global moment: false */

describe('Controller: MediatorsCtrl', function () {
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

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $uibModal) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/mediators')).respond([
      {
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
      },
      {
        'urn': 'EEEEEEEE-DDDD-CCCC-BBBB-AAAAAAAAAAAA',
        'version': '0.1.2',
        'name': 'Test 2 Mediator',
        'description': 'Test 2 Description',
        'defaultChannelConfig': [
          {
            'name': 'Mediator Channel 2',
            'urlPattern': '/channnel2',
            'routes': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }],
            'allow': [ 'xdlab' ],
            'type': 'http'
          }
        ],
        'endpoints': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }, { 'name': 'Route 2', 'host': 'localhost2', 'port': '3333', 'primary': false, 'type': 'http' }],
        '_lastHeartbeat': moment().subtract(3, 'minutes').toDate(),
        '_uptime': 5443200 // over 2 months
      }
    ])

    modalSpy = sinon.spy($uibModal, 'open')

    createController = function () {
      scope = $rootScope.$new()
      return $controller('MediatorsCtrl', { $scope: scope })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a list of mediators to the scope', function () {
    createController()
    httpBackend.flush()
    scope.mediators.length.should.equal(2)

    scope.mediators[0].urn.should.equal('AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE')
    scope.mediators[0].name.should.equal('Test 1 Mediator')
    scope.mediators[0].description.should.equal('Test 1 Description')
    scope.mediators[0].version.should.equal('0.0.1')
    scope.mediators[0].endpoints.length.should.equal(1)

    scope.mediators[1].urn.should.equal('EEEEEEEE-DDDD-CCCC-BBBB-AAAAAAAAAAAA')
    scope.mediators[1].name.should.equal('Test 2 Mediator')
    scope.mediators[1].description.should.equal('Test 2 Description')
    scope.mediators[1].version.should.equal('0.1.2')
    scope.mediators[1].endpoints.length.should.equal(2)
  })

  it('should calculate the lastHeartbeatStatus field based on the last heartbeat', function () {
    createController()
    httpBackend.flush()

    scope.mediators[0].lastHeartbeatStatus.should.equal('success')
    scope.mediators[1].lastHeartbeatStatus.should.equal('danger')
  })

  it('should set the uptimeDisplay field with a human friendly display string', function () {
    createController()
    httpBackend.flush()

    scope.mediators[0].uptimeDisplay.should.equal('an hour')
    scope.mediators[1].uptimeDisplay.should.equal('2 months')
  })
})
