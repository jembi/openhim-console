'use strict'
/* jshint expr: true */
/* global sinon: false */

describe('Controller: TransactionDetailsCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend, modalSpy // eslint-disable-line

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $uibModal) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/transactions/538ed0867962a27d5df259b0')).respond({'_id': '5322fe9d8b6add4b2b059ff5', 'name': 'Transaction 1', 'urlPattern': 'sample/api', 'channelID': '5322fe9d8b6add4b2b059dd8', 'clientID': '5344fe7d8b6add4b2b069dd7'})
    $httpBackend.when('GET', new RegExp('.*/transactions?.*')).respond([{'name': 'Transaction 5', 'urlPattern': 'sample/api', '_id': '5322fe9d8b6add4b2basd979', 'parentID': '5322fe9d8b6add4b2b059ff5'}])

    $httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({'_id': '539846c240f2eb682ffeca4b', 'email': 'test@user.org', 'firstname': 'test', 'surname': 'test', 'groups': ['admin', 'test', 'other']})

    $httpBackend.when('GET', new RegExp('.*/channels/5322fe9d8b6add4b2b059dd8')).respond({'_id': '5322fe9d8b6add4b2b059dd8', 'name': 'Sample JsonStub Channel 1', 'urlPattern': 'sample/api', 'allow': ['PoC'], 'txRerunAcl': ['test'], 'routes': [{'host': 'jsonstub.com', 'port': 80, 'primary': true}]})

    $httpBackend.when('GET', new RegExp('.*/clients/5344fe7d8b6add4b2b069dd7')).respond({'_id': '5344fe7d8b6add4b2b069dd7', 'clientID': 'test1', 'clientDomain': 'test1.openhim.org', 'name': 'Test 1', 'roles': ['test'], 'passwordAlgorithm': 'sha512', 'passwordHash': '1234', 'passwordSalt': '1234'})

    modalSpy = sinon.spy($uibModal, 'open')

    createController = function () {
      scope = $rootScope.$new()
      return $controller('TransactionDetailsCtrl', { $scope: scope, $routeParams: { transactionId: '538ed0867962a27d5df259b0' } })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a single transaction to the scope', function () {
    createController()
    httpBackend.flush()
    scope.transactionDetails.name.should.equal('Transaction 1')
    scope.childTransactions.length.should.equal(1)
  })

  it('should attach a single channel object to the scope', function () {
    createController()
    httpBackend.flush()

    scope.channel.name.should.equal('Sample JsonStub Channel 1')
    scope.channel.urlPattern.should.equal('sample/api')
    scope.channel.routes.length.should.equal(1)
  })

  it('should attach a single client to the scope', function () {
    createController()
    httpBackend.flush()

    scope.client.name.should.equal('Test 1')
    scope.client.clientID.should.equal('test1')
    scope.client.clientDomain.should.equal('test1.openhim.org')
    scope.client.roles.length.should.equal(1)
  })
})
