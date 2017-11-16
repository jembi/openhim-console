'use strict'
/* global sinon:false */

describe('Controller: ClientsModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend
  var client = {
    $save: sinon.spy(),
    $update: sinon.spy(),
    _id: '553516b69fdbfc281db58efd',
    roles: ['role1', 'role2']
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/clients$')).respond([
      {clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test', 'testing2'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'},
      {clientID: 'test2', clientDomain: 'test2.openhim.org', name: 'Test 2', roles: ['test', 'testing again'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'}
    ])

    $httpBackend.when('GET', new RegExp('.*/roles$')).respond([{}])

    $httpBackend.when('GET', new RegExp('.*/keystore/ca')).respond([{commonName: 'test1'}, {commonName: 'test2'}])

    scope = $rootScope.$new()
    var modalInstance = sinon.spy()

    createController = function (client) {
      return $controller('ClientsModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        client: client
      })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should create a new client if this is not an update', function () {
    httpBackend.when('GET', new RegExp('.*/clients/553516b69fdbfc281db58efd')).respond(client)
    createController(client)
    httpBackend.flush()

    scope.client.should.be.ok()
  })

  it('should query and attach certs to scope', function () {
    createController()
    httpBackend.flush()

    scope.certs.should.be.ok()
    scope.certs.should.have.length(2)
  })

  it('should run validateFormClients() for any validation errors - ngErrors.hasErrors -> TRUE', function () {
    createController()
    httpBackend.flush()

    scope.client.clientID = ''
    scope.client.name = ''
    scope.client.clientDomain = ''
    scope.client.roles = []
    scope.client.passwordHash = ''
    scope.client.certFingerprint = ''
    scope.temp.password = ''

    // run the validate

    scope.validateFormClients()
    scope.ngError.should.have.property('hasErrors', true)
    scope.ngError.should.have.property('clientID', true)
    scope.ngError.should.have.property('name', true)
    scope.ngError.should.have.property('roles', true)
    scope.ngError.should.have.property('certFingerprint', true)
  })

  it('should run validateFormClients() for any validation errors - confirm user password', function () {
    createController()
    httpBackend.flush()

    scope.client.clientID = ''
    scope.client.name = ''
    scope.client.clientDomain = ''
    scope.client.roles = []
    scope.temp.password = 'password'

    // run the validate
    scope.validateFormClients()
    scope.ngError.should.have.property('hasErrors', true)
    scope.ngError.should.have.property('passwordConfirm', true)
  })

  it('should run validateFormClients() for any validation errors - ngErrors.hasErrors -> FALSE', function () {
    createController()
    httpBackend.flush()

    scope.client.clientID = 'clientID'
    scope.client.name = 'clientName'
    scope.client.clientDomain = 'clientDomain'
    scope.client.roles = ['admin', 'Poc']
    scope.temp.password = 'password'
    scope.temp.passwordConfirm = 'password'

    // run the validate
    scope.validateFormClients()
    scope.ngError.should.have.property('hasErrors', false)
  })

  it('should run submitFormClients() and check any validation errors - FALSE - should not save the record', function () {
    createController()
    httpBackend.flush()

    scope.client.clientID = ''
    scope.client.name = ''
    scope.client.clientDomain = ''
    scope.client.roles = []
    scope.temp.password = 'password'

    // run the submit
    scope.submitFormClients()
    scope.ngError.should.have.property('hasErrors', true)
    scope.ngError.should.have.property('clientID', true)
    scope.ngError.should.have.property('name', true)
    scope.ngError.should.have.property('roles', true)
    scope.ngError.should.have.property('passwordConfirm', true)
  })

  it('should run submitFormClients() and check any validation errors - TRUE - Should save the record', function () {
    httpBackend.when('GET', new RegExp('.*/clients/553516b69fdbfc281db58efd')).respond(client)
    createController(client)
    httpBackend.flush()

    // update is false so create new client
    scope.update = false

    scope.client.clientID = 'clientID'
    scope.client.name = 'clientName'
    scope.client.clientDomain = 'clientDomain'
    scope.client.roles = ['admin', 'Poc']
    scope.temp.password = 'password'
    scope.temp.passwordConfirm = 'password'
    scope.formData.assigned.admin = true

    // run the submit
    scope.submitFormClients()
    scope.ngError.should.have.property('hasErrors', false)
    scope.client.$save.should.have.been.called()
  })

  it('should run submitFormClients() and check any validation errors - TRUE - Should update the record', function () {
    httpBackend.when('GET', new RegExp('.*/clients/553516b69fdbfc281db58efd')).respond(client)
    createController(client)
    httpBackend.flush()

    // update is false so create new client
    scope.update = true

    scope.client.clientID = 'clientID'
    scope.client.name = 'clientName'
    scope.client.clientDomain = 'clientDomain'
    scope.client.roles = ['admin', 'Poc']
    scope.temp.password = 'password'
    scope.temp.passwordConfirm = 'password'

    // run the submit
    scope.submitFormClients()
    scope.ngError.should.have.property('hasErrors', false)
    scope.client.$update.should.have.been.called()

    scope.client.should.have.property('passwordSalt')
    scope.client.should.have.property('passwordHash')
    scope.client.should.have.property('clientID', 'clientID')
    scope.client.should.have.property('name', 'clientName')
    scope.client.should.have.property('clientDomain', 'clientDomain')
    scope.client.roles.should.have.length(2)
  })

  it('should create a new role successfully', function () {
    createController()
    httpBackend.flush()

    scope.formData.newClientRole = 'TestRole'

    scope.createNewRole()
    scope.formData.should.have.property('duplicateNewRole', false)
    scope.client.roles.should.have.length(1)
    scope.roles.should.have.length(2)
    scope.formData.assigned.should.have.property('TestRole', true)
    scope.formData.should.have.property('newClientRole', null)
  })

  it('should fail to create a new if role already exists', function () {
    createController()
    httpBackend.flush()

    scope.roles[0].name = 'TestRole'
    scope.formData.newClientRole = 'TestRole'

    scope.createNewRole()
    scope.formData.should.have.property('duplicateNewRole', true)
    scope.roles.should.have.length(1)
  })

  it('should fail to create a new role with the name of a client', function () {
    createController()
    httpBackend.flush()

    scope.clients[0].clientID = 'TestRole'
    scope.formData.newClientRole = 'TestRole'

    scope.createNewRole()
    scope.formData.should.have.property('duplicateNewRole', true)
    scope.roles.should.have.length(1)
  })

  it('should toggle an assigned role', function () {
    createController()
    httpBackend.flush()

    scope.client.roles[0] = 'TestRole'
    scope.client.roles[1] = 'TestRole2'
    scope.formData.assigned.TestRole = true

    scope.toggleAssignedRoles('TestRole')
    scope.formData.assigned.should.have.property('TestRole', false)
    scope.client.roles.should.have.length(1)
  })

  it('should toggle an unassigned role', function () {
    createController()
    httpBackend.flush()

    scope.formData.assigned.TestRole = false

    scope.toggleAssignedRoles('TestRole')
    scope.formData.assigned.should.have.property('TestRole', true)
    scope.client.roles.should.have.length(1)
  })
})
