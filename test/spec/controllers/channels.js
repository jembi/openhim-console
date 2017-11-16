'use strict'
/* global sinon: false */

describe('Controller: ChannelsCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend, modalSpy

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $uibModal) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      {'name': 'Sample JsonStub Channel 1', 'urlPattern': 'sample/api', 'priority': 1, 'allow': ['PoC'], 'routes': [{'host': 'jsonstub.com', 'port': 80, 'primary': true}], '_id': '5322fe9d8b6add4b2b059ff5'},
      {'name': 'Sample JsonStub Channel 2', 'urlPattern': 'sample/api', 'priority': 5, 'allow': ['PoC'], 'routes': [{'host': 'jsonstub.com', 'port': 80}], '_id': '5322fe9d8b6add4b2b059ff6'},
      {'name': 'Sample JsonStub Channel 3', 'urlPattern': 'sample/api', 'priority': 7, 'allow': ['PoC'], 'routes': [{'host': 'jsonstub.com', 'port': 80}], '_id': '5322fe9d8b6add4b33333333', 'status': 'deleted'}
    ])

    $httpBackend.when('GET', new RegExp('.*/clients')).respond([
      {clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'},
      {clientID: 'test2', clientDomain: 'test2.openhim.org', name: 'Test 2', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'}
    ])

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { 'firstname': 'Super', 'surname': 'User', 'email': 'super@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['admin'] },
      { 'firstname': 'Ordinary', 'surname': 'User', 'email': 'normal@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['limited'] }
    ])

    $httpBackend.when('GET', new RegExp('.*/groups')).respond([
      { 'group': 'Group 1', 'users': [ {'user': 'User 1', 'method': 'sms', 'maxAlerts': 'no max'}, {'user': 'User 2', 'method': 'email', 'maxAlerts': '1 per day'}, {'user': 'User 3', 'method': 'email', 'maxAlerts': '1 per hour'} ] },
      { 'group': 'Group 2', 'users': [ {'user': 'User 4', 'method': 'email', 'maxAlerts': 'no max'} ] }
    ])

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
        'endpoints': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }]
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
        'endpoints': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }, { 'name': 'Route 2', 'host': 'localhost2', 'port': '3333', 'primary': false, 'type': 'http' }]
      }
    ])

    $httpBackend.when('GET', new RegExp('.*/keystore/ca')).respond([
      {'country': 'US', 'state': 'Missouri', 'locality': 'St. Louis', 'organization': 'Mallinckrodt Institute of Radiology', 'organizationUnit': 'Electronic Radiology Lab', 'commonName': 'MIR2014-16', 'emailAddress': 'moultonr@mir.wustl.edu', 'data': '-----FAKE CERTIFICATE DATA-----', '_id': '54e1ca5afa069b5a7b938c4f', 'validity': { 'start': '2014-10-09T13:15:28.000Z', 'end': '2016-11-29T13:15:28.000Z' }},
      {'country': 'ZA', 'state': 'KZN', 'locality': 'Durban', 'organization': 'Jembi Health Systems NPC', 'organizationUnit': 'eHealth', 'commonName': 'openhim', 'emailAddress': 'ryan@jembi.org', 'data': '-----FAKE CERTIFICATE DATA-----', '_id': '54e1ca5afa069b5a7b938c50', 'validity': { 'start': '2014-11-25T12:52:21.000Z', 'end': '2016-10-30T12:52:21.000Z' }}
    ])

    modalSpy = sinon.spy($uibModal, 'open')

    createController = function () {
      scope = $rootScope.$new()
      return $controller('ChannelsCtrl', { $scope: scope })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a list of channels to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/channels'))
    createController()
    httpBackend.flush()
    scope.channels.length.should.equal(3)
  })

  it('should open a modal to confirm deletion of a channel', function () {
    createController()
    httpBackend.flush()

    scope.confirmDelete(scope.channels[0])
    modalSpy.should.have.been.calledOnce()
  })

  it('should open a modal to confirm restoration of a deleted channel', function () {
    createController()
    httpBackend.flush()

    scope.confirmRestore(scope.channels[2])
    modalSpy.should.have.been.calledOnce()
  })

  it('should open a modal to add a channel', function () {
    createController()
    scope.addChannel()

    modalSpy.should.have.been.calledOnce()
    httpBackend.flush()
  })

  it('should open a modal to edit a channel', function () {
    createController()
    scope.editChannel()

    modalSpy.should.have.been.calledOnce()
    httpBackend.flush()
  })

  it('should getLowestPriority level from channels', function () {
    createController()
    httpBackend.flush()

    var lowestLevel = scope.getLowestPriority()
    lowestLevel.should.equal(7)
  })

  it('should successfully updateChannelPriority level', function () {
    createController()
    httpBackend.flush()

    scope.channels[0].$update = sinon.spy()
    scope.channels[1].$update = sinon.spy()
    scope.channels[2].$update = sinon.spy()

    scope.channels[0].should.have.property('priority', 1)
    scope.channels[1].should.have.property('priority', 5)
    scope.channels[2].should.have.property('priority', 7)

    // up the priority level - Should stay the same as 1 is the highest
    scope.updateChannelPriority(scope.channels[0], 'up')
    scope.channels[0].should.have.property('priority', 1)
    scope.updateChannelPriority(scope.channels[0], 'down')
    scope.channels[0].should.have.property('priority', 2)

    scope.updateChannelPriority(scope.channels[1], 'up')
    scope.updateChannelPriority(scope.channels[1], 'up')
    scope.channels[1].should.have.property('priority', 3)

    scope.updateChannelPriority(scope.channels[2], 'down')
    scope.updateChannelPriority(scope.channels[2], 'down')
    scope.updateChannelPriority(scope.channels[2], 'down')
    scope.channels[2].should.have.property('priority', 10)

    scope.channels[0].$update.should.have.been.called()
    scope.channels[1].$update.should.have.been.called()
    scope.channels[2].$update.should.have.been.called()
  })
})
