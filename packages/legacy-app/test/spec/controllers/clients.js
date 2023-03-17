'use strict'
/* global sinon: false */

describe('Controller: ClientsCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend, modalSpy

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $uibModal) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/clients')).respond([
      { clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234' },
      { clientID: 'test2', clientDomain: 'test2.openhim.org', name: 'Test 2', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234' }
    ])

    $httpBackend.when('GET', new RegExp('.*/channels')).respond([])

    $httpBackend.when('GET', new RegExp('.*/authentication/types')).respond(['basic-auth', 'jwt-auth', 'mutual-tls-auth', 'custom-token-auth'])

    $httpBackend.when('GET', new RegExp('.*/roles')).respond([
      { name: 'test', clients: ['test'], channels: ['test'] }
    ])

    $httpBackend.when('GET', new RegExp('.*/keystore/ca')).respond([])

    $httpBackend.when('PUT', new RegExp('.*/roles/test')).respond({})

    $httpBackend.when('POST', new RegExp('.*/roles')).respond({})

    $httpBackend.when('GET', new RegExp('.*views/confirmModal.html')).respond({})

    modalSpy = sinon.spy($uibModal, 'open')

    createController = function () {
      scope = $rootScope.$new()
      return $controller('ClientsCtrl', { $scope: scope })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a list of clients to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/clients'))
    httpBackend.expectGET(new RegExp('.*/channels'))
    httpBackend.expectGET(new RegExp('.*/roles'))
    createController()
    httpBackend.flush()
    scope.clients.length.should.equal(2)
  })

  it('should open a modal to confirm deletion of a client', function () {
    createController()
    httpBackend.flush()

    scope.confirmClientDelete(scope.clients[0])
    modalSpy.should.have.been.calledOnce()
  })

  it('should open a modal to add a client', function () {
    createController()
    scope.addClient()
    modalSpy.should.have.been.calledOnce()
    httpBackend.flush()
  })

  it('should open a modal to edit a client', function () {
    createController()
    scope.editClient()
    modalSpy.should.have.been.calledOnce()
    httpBackend.flush()
  })

  var client = { clientID: 'test' }
  var role = { name: 'test', displayName: 'dispTest' }
  var channel = { name: 'test' }

  it('should assign a role to a client', function () {
    createController()

    scope.clientRoles = []

    scope.assignRoleToClient(client, role, true)
    scope.clientRoles.should.have.property('testtest', true)
    httpBackend.flush()
  })

  it('should remove a role from a client', function () {
    createController()

    scope.clientRoles = []

    scope.removeRoleFromClient(client, role, true)
    scope.clientRoles.should.have.property('testtest', false)

    httpBackend.flush()
  })

  it('should toggle edit clients from true to false', function () {
    createController()
    httpBackend.flush()

    scope.editClients = true

    scope.toggleEditClients()
    scope.editClients.should.equal(false)
  })

  it('should assign a role to a channel', function () {
    createController()

    scope.channelRoles = []

    scope.assignRoleToChannel(channel, role, true)
    scope.channelRoles.should.have.property('testtest', true)
    httpBackend.flush()
  })

  it('should remove a role from a channel', function () {
    createController()

    scope.channelRoles = []

    scope.removeAssignRoleFromChannel(channel, role, true)
    scope.channelRoles.should.have.property('testtest', false)

    httpBackend.flush()
  })

  it('should save existing name of a role', function () {
    createController()
    httpBackend.flush()

    scope.roles[0].name = 'dispTest'

    scope.changeRoleName(role)
    scope.nameSaved.should.have.property('dispTest', true)
  })

  it('should save the new name of a role', function () {
    createController()
    httpBackend.flush()

    scope.roles[0].name = 'test'

    scope.changeRoleName(role)
    scope.nameSaved.should.have.property('dispTest', true)
    httpBackend.flush()
  })

  it('should toggle edit role names from true to false', function () {
    createController()
    httpBackend.flush()

    scope.editRoleNames = true

    scope.toggleEditRoleNames()
    scope.editRoleNames.should.equal(false)
  })

  it('should create a new role', function () {
    createController()
    httpBackend.flush()

    scope.newRolesIndex = 0
    scope.newRoles.name = 'testNew'

    scope.addRole()
    scope.newRoles[0].should.have.property('idName', 'Role0')
    scope.newRoles[0].should.have.property('index', 0)
    scope.newRoles[0].should.have.property('name', 'testNew')
  })

  it('should assign a client to a new role successfully', function () {
    createController()
    httpBackend.flush()

    scope.assignClientToNewRole(client, role)
    scope.clientRoles.should.have.property('testtest', true)
  })

  it('should assign a new role to a channel successfully', function () {
    createController()
    httpBackend.flush()

    scope.assignNewRoleToChannel(channel, role)
    scope.channelRoles.should.have.property('testtest', true)
  })

  it('should save a new role', function () {
    createController()
    httpBackend.flush()

    scope.newRoles = []
    scope.newRoles[0] = { name: 'test' }
    scope.newRoles[1] = { name: 'test2' }

    scope.saveNewRole(role)
    httpBackend.flush()
    scope.newRoles.length.should.equal(1)
    scope.newRoles[0].should.have.property('name', 'test2')
  })

  it('should remove a new role', function () {
    createController()
    httpBackend.flush()

    scope.newRoles = []
    scope.newRoles[0] = { name: 'test' }
    scope.newRoles[1] = { name: 'test2' }

    scope.removeNewRole(role)
    scope.newRoles.length.should.equal(1)
    scope.newRoles[0].should.have.property('name', 'test2')
  })

  it('should create a delete popup to confirm delete and thereafter delete the role', function () {
    createController()
    httpBackend.flush()

    scope.confirmRoleDelete(role)
    modalSpy.should.have.been.calledOnce()
  })
})
