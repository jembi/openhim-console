'use strict'
/* global sinon:false */

describe('Controller: ExportImportModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend, modalInstance, data

  var expectedResponse = [
    {'model': 'Clients', 'record': {_id: '5322fe9d8b6add4b2b059ff6', clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'}, 'status': 'Updated', 'message': 'Successfully inserted Clients with name', 'uid': 'test1'},
    {'model': 'Users', 'record': { _id: '1569fe9d8b6addd83l559fd3', 'firstname': 'Ordinary', 'surname': 'User', 'email': 'normal@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['limited'] }, 'status': 'Updated', 'message': '', 'uid': 'normal@openim.org'}
  ]

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    httpBackend.when('POST', new RegExp('.*/metadata')).respond(expectedResponse)

    scope = $rootScope.$new()
    modalInstance = {
      close: function () { return true }
    }

    data = [
      {'model': 'Channels', 'record': {'name': 'Sample JsonStub Channel 1', 'urlPattern': 'sample/api', 'allow': ['PoC'], 'routes': [{'host': 'jsonstub.com', 'port': 80, 'primary': true}], '_id': '5322fe9d8b6add4b2b059ff5'}, 'status': 'Valid', 'message': '', 'uid': 'Sample JsonStub Channel 1'},
      {'model': 'Clients', 'record': {'_id': '5322fe9d8b6add4b2b059ff6', 'clientID': 'test1', 'clientDomain': 'test1.openhim.org', 'name': 'Test 1', 'roles': ['test'], 'passwordAlgorithm': 'sha512', 'passwordHash': '1234', 'passwordSalt': '1234'}, 'status': 'Conflict', 'message': '', 'uid': 'test1'},
      {'model': 'Clients', 'record': {'_id': '4567fe9d8b6addd83l559ff8', 'clientID': 'test2', 'clientDomain': 'test2.openhim.org', 'name': 'Test 2', 'roles': ['test'], 'passwordAlgorithm': 'sha512', 'passwordHash': '1234', 'passwordSalt': '1234'}, 'status': 'Conflict', 'message': '', 'uid': 'test2'},
      {'model': 'Users', 'record': { '_id': '6380fe9d8b6addd83l559fs7', 'firstname': 'Super', 'surname': 'User', 'email': 'super@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['admin'] }, 'status': 'Conflict', 'message': '', 'uid': 'super@openim.org'},
      {'model': 'Users', 'record': { '_id': '1569fe9d8b6addd83l559fd3', 'firstname': 'Ordinary', 'surname': 'User', 'email': 'normal@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['limited'] }, 'status': 'Valid', 'message': '', 'uid': 'normal@openim.org'},
      {'model': 'Mediators', 'record': {'_id': '4444fe9d8b6addd83l5595555', 'urn': 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE', 'version': '0.0.1', 'name': 'Test 1 Mediator', 'description': 'Test 1 Description', 'defaultChannelConfig': [{ 'name': 'Mediator Channel 1', 'urlPattern': '/channel1', 'routes': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }], 'allow': [ 'xdlab' ], 'type': 'http' }], 'endpoints': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }]}, 'status': 'Conflict', 'message': '', 'uid': 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE'}
    ]

    createController = function () {
      return $controller('ExportImportModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        data: data
      })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a list of conflicts to the scope', function () {
    createController()

    scope.conflicts.length.should.equal(4)
    scope.validImports.length.should.equal(2)
  })

  it('should execute saveImport() and import the data', sinon.test(function () {
    createController()

    // used to check if
    var spy = this.spy(modalInstance, 'close')

    // lets change some data in our data object before doing the import
    scope.conflicts.forEach(function (item) {
      item.action = 'overwrite'
    })

    // execute the import function
    scope.saveImport(function () {
      sinon.assert.calledOnce(spy)
    })

    httpBackend.expect('POST', new RegExp('.*/metadata'))
    httpBackend.flush()
  }))

  it('should execute saveImport() and do not import data', sinon.test(function () {
    data.forEach(function (item) {
      item.status = 'Conflict'
    })

    createController()
    scope.conflicts.length.should.equal(6)

    // used to monitor when modal gets closed - indicates completion
    var spy = this.spy(modalInstance, 'close')

    // lets change some data in our data object before doing the import
    scope.conflicts.forEach(function (item) {
      item.action = 'ignore'
    })

    // execute the import function
    scope.saveImport(function () {
      sinon.assert.calledOnce(spy)
    })
  }))

  it('should execute validateImportFile() and return TRUE - no errors', function () {
    createController()

    // lets change some data in our data object before doing the import
    scope.conflicts.forEach(function (item) {
      if (item.record._id === '5322fe9d8b6add4b2b059ff6') {
        item.record.clientID = 'Updated_Test_Client'
        item.action = 'duplicate'
      } else {
        item.action = 'overwrite'
      }
    })

    scope.conflicts.some(function (item) {
      return item.should.have.property('action', 'duplicate')
    })

    scope.validateImport().should.equal(true)
  })

  it('should execute validateImportFile() and return FALSE - errors', function () {
    createController()

    // lets change some data in our data object before doing the import
    scope.conflicts.forEach(function (item) {
      item.action = 'duplicate'
    })

    scope.conflicts.every(function (item) {
      return item.should.have.property('action', 'duplicate')
    })

    scope.validateImport().should.equal(false)
  })

  it('should execute checkIfAllOverwrites() and set selectedAll to true', function () {
    createController()

    // lets change some data in our data object before doing the import
    scope.conflicts.forEach(function (item) {
      item.action = 'overwrite'
    })

    scope.checkIfAllOverwrites()

    scope.outcome.selectedAll.should.equal(true)
  })

  it('should execute checkIfAllOverwrites() and set selectedAll to true', function () {
    createController()

    // lets change some data in our data object before doing the import
    scope.conflicts.forEach(function (item) {
      if (item.uid === 'test1' || item.uid === 'test2') {
        item.action = 'overwrite'
      }
    })

    scope.checkIfAllOverwrites()

    scope.outcome.selectedAll.should.equal(false)
  })

  it('should execute selectAll() and set all items.action to overwrite', function () {
    createController()

    scope.selectAll()

    // lets change some data in our data object before doing the import
    scope.conflicts.every(function (item) {
      return item.action === 'overwrite'
    }).should.equal(true)
  })
})
