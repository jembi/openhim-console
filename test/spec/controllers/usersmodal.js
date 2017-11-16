'use strict'
/* global sinon:false */

describe('Controller: UsersModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    httpBackend.when('GET', new RegExp('config/visualizer.json')).respond({
      'components': [],
      'channels': [],
      'mediators': [],
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

    $httpBackend.when('GET', new RegExp('.*/users$')).respond([
      { 'firstname': 'Super', 'surname': 'User', 'email': 'super@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['admin'], 'settings': {} },
      { 'firstname': 'Ordinary', 'surname': 'User', 'email': 'normal@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['limited'], 'settings': {} }
    ])

    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      {'name': 'Sample JsonStub Channel 1', 'urlPattern': 'sample/api', 'allow': ['PoC'], 'txRerunAcl': ['test'], 'routes': [{'host': 'jsonstub.com', 'port': 80, 'primary': true}], '_id': '5322fe9d8b6add4b2b059dd8'},
      {'name': 'Sample JsonStub Channel 2', 'urlPattern': 'sample/api', 'allow': ['PoC'], 'txRerunAcl': ['testing'], 'routes': [{'host': 'jsonstub.com', 'port': 80}], '_id': '5322fe9d8b6add4b2b059aa3'}
    ])

    $httpBackend.when('GET', new RegExp('.*/users/.+')).respond({})

    scope = $rootScope.$new()
    var modalInstance = sinon.spy()

    createController = function (user) {
      return $controller('UsersModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        user: user
      })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should fetch user data from the API when updating', function () {
    httpBackend.expect('GET', new RegExp('.*/users/.+'))
    createController({ email: 'test@ing.org' })
    httpBackend.flush()
  })

  it('should create a new user if this is not an update', function () {
    createController()
    httpBackend.flush()

    scope.user.should.be.ok()
  })

  it('should run validateFormUsers() for any validation errors - ngErrors.hasErrors -> TRUE', function () {
    createController()
    httpBackend.flush()

    // set update true - test password confirmation
    scope.update = true

    scope.user.firstname = ''
    scope.user.surname = ''
    scope.user.msisdn = '2712'
    scope.user.groups = []
    scope.temp.password = 'password'

    scope.validateFormUsers()
    scope.ngError.should.have.property('hasErrors', true)
    scope.ngError.should.have.property('firstname', true)
    scope.ngError.should.have.property('surname', true)
    scope.ngError.should.have.property('msisdn', true)
    scope.ngError.should.have.property('groups', true)
    scope.ngError.should.have.property('passwordConfirm', true)
  })

  it('should run validateFormUsers() for any validation errors - ngErrors.hasErrors -> FALSE', function () {
    createController()
    httpBackend.flush()

    // set update true - test password confirmation
    scope.update = true

    scope.user.email = 'new@user.com'
    scope.user.firstname = 'John'
    scope.user.surname = 'Doe'
    scope.user.msisdn = '27123456789'
    scope.user.groups = ['group1', 'group2']
    scope.temp.password = 'password'
    scope.temp.passwordConfirm = 'password'

    scope.validateFormUsers()
    scope.ngError.should.have.property('hasErrors', false)
  })

  it('should run submitFormUsers() and check any validation errors - FALSE - should not save the record', function () {
    createController()
    httpBackend.flush()

    scope.user.firstname = ''
    scope.user.surname = ''
    scope.user.msisdn = '2712'
    scope.user.groups = []

    scope.submitFormUsers()
    scope.ngError.should.have.property('hasErrors', true)
    scope.ngError.should.have.property('firstname', true)
    scope.ngError.should.have.property('surname', true)
    scope.ngError.should.have.property('msisdn', true)
    scope.ngError.should.have.property('groups', true)
  })

  it('should run submitFormUsers() and check any validation errors - TRUE - Should save the record', function () {
    createController()
    httpBackend.flush()

    scope.user.$save = sinon.spy()

    // update is false so create new user
    scope.update = false

    scope.user.email = 'new@user.com'
    scope.user.firstname = 'John'
    scope.user.surname = 'Doe'
    scope.user.msisdn = '27123456789'
    scope.user.groups = ['group1', 'group2']
    scope.user.dailyReport = true
    scope.user.weeklyReport = true

    scope.submitFormUsers()
    scope.ngError.should.have.property('hasErrors', false)
    scope.user.$save.should.have.been.called()
  })

  it('should run submitFormUsers() and check any validation errors - TRUE - Should update the record', function () {
    createController()
    httpBackend.flush()

    scope.user.$update = sinon.spy()

    // update is false so create new user
    scope.update = true

    scope.user.email = 'new@user.com'
    scope.user.firstname = 'John'
    scope.user.surname = 'Doe'
    scope.user.msisdn = '27987654321'
    scope.user.dailyReport = true
    scope.user.weeklyReport = true
    scope.user.groups = ['group333', 'group444', 'group555']
    scope.temp.password = 'passwordtest'
    scope.temp.passwordConfirm = 'passwordtest'

    scope.submitFormUsers()
    scope.ngError.should.have.property('hasErrors', false)
    scope.user.$update.should.have.been.called()

    scope.user.should.have.property('passwordSalt')
    scope.user.should.have.property('passwordHash')
    scope.user.should.have.property('firstname', 'John')
    scope.user.should.have.property('surname', 'Doe')
    scope.user.should.have.property('dailyReport', true)
    scope.user.should.have.property('weeklyReport', true)
    scope.user.should.have.property('msisdn', '27987654321')
    scope.user.groups.should.have.length(3)
  })

  it('should create two taglist objects', function () {
    createController()
    httpBackend.flush()

    scope.taglistUserRoleOptions.should.have.length(2)

    scope.taglistUserRoleOptions[0].should.equal('admin')
    scope.taglistUserRoleOptions[1].should.equal('limited')
  })
})
