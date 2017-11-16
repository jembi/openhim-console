'use strict'
/* global sinon: false */

describe('Controller: UsersCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var createController, httpBackend, scope, modalSpy

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $uibModal) {
    httpBackend = $httpBackend

    httpBackend.when('GET', new RegExp('config/visualizer.json')).respond({
      'components': [],
      'endpoints': [],
      'color': { 'inactive': '#cccccc', 'active': '#4cae4c', 'error': '#d43f3a', 'text': '#000000' },
      'size': { 'width': 1000, 'height': 400, 'padding': 20 },
      'time': { 'updatePeriod': 200, 'maxSpeed': 5, 'minDisplayPeriod': 100, 'maxTimeout': 5000 }
    })

    $httpBackend.when('GET', new RegExp('.*/mediators')).respond([
      {
        'urn': 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE',
        'version': '0.0.1',
        'name': 'Test 1 Mediator',
        'description': 'Test 1 Description',
        'defaultChannelConfig': [
          { 'name': 'Mediator Channel 1', 'urlPattern': '/channel1', 'routes': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }], 'allow': [ 'xdlab' ], 'type': 'http' }
        ],
        'endpoints': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }]
      }, {
        'urn': 'EEEEEEEE-DDDD-CCCC-BBBB-AAAAAAAAAAAA',
        'version': '0.1.2',
        'name': 'Test 2 Mediator',
        'description': 'Test 2 Description',
        'defaultChannelConfig': [
          { 'name': 'Mediator Channel 2', 'urlPattern': '/channnel2', 'routes': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }], 'allow': [ 'xdlab' ], 'type': 'http' }
        ],
        'endpoints': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }, { 'name': 'Route 2', 'host': 'localhost2', 'port': '3333', 'primary': false, 'type': 'http' }]
      }
    ])

    $httpBackend.when('GET', new RegExp('.*/users')).respond([{
      'firstname': 'Super',
      'surname': 'User',
      'email': 'super@openhim.org',
      'passwordAlgorithm': 'sample/api',
      'passwordHash': '539aa778930879b01b37ff62',
      'passwordSalt': '79b01b37ff62',
      'groups': ['admin'],
      'settings': {}
    }, {
      'firstname': 'Ordinary',
      'surname': 'User',
      'email': 'normal@openhim.org',
      'passwordAlgorithm': 'sample/api',
      'passwordHash': '539aa778930879b01b37ff62',
      'passwordSalt': '79b01b37ff62',
      'groups': ['limited'],
      'settings': {}
    }
    ])

    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      {'name': 'Sample JsonStub Channel 1', 'urlPattern': 'sample/api', 'allow': ['PoC'], 'txViewAcl': ['test', 'limited'], 'txViewFullAcl': ['test'], 'txRerunAcl': ['test'], 'routes': [{'host': 'jsonstub.com', 'port': 80, 'primary': true}], '_id': '5322fe9d8b6add4b2b059dd8'},
      {'name': 'Sample JsonStub Channel 2', 'urlPattern': 'sample/api', 'allow': ['PoC'], 'txViewAcl': ['limited'], 'txViewFullAcl': [], 'txRerunAcl': ['limited'], 'routes': [{'host': 'jsonstub.com', 'port': 80}], '_id': '5322fe9d8b6add4b2b059aa3'}
    ])

    modalSpy = sinon.spy($uibModal, 'open')

    scope = $rootScope.$new()
    createController = function () {
      scope = $rootScope.$new()
      return $controller('UsersCtrl', { $scope: scope })
    }
  }))

  it('should attach a list of users to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/users'))
    createController()
    httpBackend.flush()
    scope.users.length.should.equal(2)
  })

  it('should open a modal to confirm deletion of a user', function () {
    createController()
    httpBackend.flush()
    scope.confirmDelete(scope.users[0])
    modalSpy.should.have.been.calledOnce()
  })

  it('should open a modal to add a user', function () {
    createController()
    scope.addUser()

    modalSpy.should.have.been.calledOnce()

    httpBackend.flush()
  })

  it('should open a modal to edit a user', function () {
    createController()
    scope.editUser()

    modalSpy.should.have.been.calledOnce()

    httpBackend.flush()
  })

  it('should attached a usersChannelsMatrix object to the scope', function () {
    createController()
    httpBackend.flush()

    scope.usersChannelsMatrix.should.have.property('channels')
    scope.usersChannelsMatrix.channels.length.should.equal(2)
    scope.usersChannelsMatrix.should.have.property('users')
    scope.usersChannelsMatrix.users.length.should.equal(2)

    scope.usersChannelsMatrix.users[0].user.email.should.equal('super@openhim.org')
    scope.usersChannelsMatrix.users[0].allowedChannels.length.should.equal(2)
    scope.usersChannelsMatrix.users[0].allowedChannelsBody.length.should.equal(2)
    scope.usersChannelsMatrix.users[0].allowedChannelsRerun.length.should.equal(2)

    scope.usersChannelsMatrix.users[1].user.email.should.equal('normal@openhim.org')
    scope.usersChannelsMatrix.users[1].allowedChannels.length.should.equal(2)
    scope.usersChannelsMatrix.users[1].allowedChannelsBody.length.should.equal(0)
    scope.usersChannelsMatrix.users[1].allowedChannelsRerun.length.should.equal(1)
  })
})
