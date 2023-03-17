'use strict'
/* global sinon:false */

describe('Controller: ProfileCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    httpBackend.when('GET', new RegExp('.*/authenticate/test@user.org')).respond({
      salt: 'test-salt',
      ts: 'test-ts'
    })

    httpBackend.when('GET', new RegExp('config/visualizer.json')).respond({
      components: [],
      channels: [],
      mediators: [],
      color: { inactive: '#cccccc', active: '#4cae4c', error: '#d43f3a', text: '#000000' },
      size: { width: 1000, height: 400, padding: 20 },
      time: { updatePeriod: 200, maxSpeed: 5, minDisplayPeriod: 100, maxTimeout: 5000 }
    })

    $httpBackend.when('GET', new RegExp('.*/mediators')).respond([
      {
        urn: 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE',
        version: '0.0.1',
        name: 'Test 1 Mediator',
        description: 'Test 1 Description',
        defaultChannelConfig: [
          { name: 'Mediator Channel 1', urlPattern: '/channel1', routes: [{ name: 'Route 1', host: 'localhost', port: '1111', primary: true, type: 'http' }], allow: ['xdlab'], type: 'http' }
        ],
        endpoints: [{ name: 'Route 1', host: 'localhost', port: '1111', primary: true, type: 'http' }]
      }, {
        urn: 'EEEEEEEE-DDDD-CCCC-BBBB-AAAAAAAAAAAA',
        version: '0.1.2',
        name: 'Test 2 Mediator',
        description: 'Test 2 Description',
        defaultChannelConfig: [
          { name: 'Mediator Channel 2', urlPattern: '/channnel2', routes: [{ name: 'Route', host: 'localhost', port: '2222', primary: true, type: 'http' }], allow: ['xdlab'], type: 'http' }
        ],
        endpoints: [{ name: 'Route', host: 'localhost', port: '2222', primary: true, type: 'http' }, { name: 'Route 2', host: 'localhost2', port: '3333', primary: false, type: 'http' }]
      }
    ])

    httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({
      __v: 0,
      _id: '539846c240f2eb682ffeca4b',
      email: 'test@user.org',
      firstname: 'test',
      passwordAlgorithm: 'sha512',
      passwordHash: '7d0d1a30d16f5343e3390fe9ef1dd61539a7f797267e0d2241ed22390dfc9743091244ddb2463df2f1adf6df3c355876ed34c6523f1e8d3b7f16f4b2afc8c160',
      passwordSalt: 'test-salt',
      surname: 'test',
      weeklyAlert: true,
      dailyAlert: true,
      groups: [
        'test',
        'other'
      ],
      settings: {}
    })

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { firstname: 'Super', surname: 'User', email: 'super@openim.org', passwordAlgorithm: 'sample/api', passwordHash: '539aa778930879b01b37ff62', passwordSalt: '79b01b37ff62', groups: ['admin'], settings: {} },
      { firstname: 'Ordinary', surname: 'User', email: 'normal@openim.org', passwordAlgorithm: 'sample/api', passwordHash: '539aa778930879b01b37ff62', passwordSalt: '79b01b37ff62', groups: ['limited'], settings: {} }
    ])

    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      { name: 'Sample JsonStub Channel 1', urlPattern: 'sample/api', allow: ['PoC'], txRerunAcl: ['test'], routes: [{ host: 'jsonstub.com', port: 80, primary: true }], _id: '5322fe9d8b6add4b2b059dd8' },
      { name: 'Sample JsonStub Channel 2', urlPattern: 'sample/api', allow: ['PoC'], txRerunAcl: ['testing'], routes: [{ host: 'jsonstub.com', port: 80 }], _id: '5322fe9d8b6add4b2b059aa3' }
    ])

    httpBackend.when('PUT', new RegExp('.*/users')).respond('user has been successfully updated')

    createController = function () {
      scope = $rootScope.$new()
      scope.consoleSession = {}
      scope.consoleSession.sessionUser = 'test@user.org'
      scope.user = {
        $update: sinon.spy()
      }
      return $controller('ProfileCtrl', {
        $scope: scope
      })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should fetch a user profile', function () {
    httpBackend.expectGET(new RegExp('.*/users/test@user.org'))
    createController()
    httpBackend.flush()

    scope.user.should.have.property('email', 'test@user.org')
    scope.user.should.have.property('firstname', 'test')
    scope.user.should.have.property('surname', 'test')
    scope.user.should.have.property('weeklyAlert', true)
    scope.user.should.have.property('dailyAlert', true)
    scope.user.groups.should.have.length(2)
  })

  it('should test for all validation and return TRUE - hasErrors', function () {
    createController()

    // only admin can edit profile groups
    scope.userGroupAdmin = true

    scope.user.firstname = ''
    scope.user.surname = ''
    scope.user.msisdn = '2712'
    scope.user.groups = []
    scope.temp.password = 'password'

    // Should check all form validations and create object ngError.hasErrors with value true.
    scope.validateFormProfile()
    scope.ngError.should.have.property('hasErrors', true)
    scope.ngError.should.have.property('firstname', true)
    scope.ngError.should.have.property('surname', true)
    scope.ngError.should.have.property('msisdn', true)
    scope.ngError.should.have.property('groups', true)
    scope.ngError.should.have.property('passwordConfirm', true)

    httpBackend.flush()
  })

  it('should test for all validation and return FALSE - hasErrors', function () {
    createController()

    // only admin can edit profile groups
    scope.userGroupAdmin = true

    // Should check all form validations and create object ngError.hasErrors with value true.
    scope.user.firstname = 'John'
    scope.user.surname = 'Doe'
    scope.user.msisdn = '27123456789'
    scope.user.groups = ['group1', 'group2']

    scope.validateFormProfile()
    scope.ngError.should.have.property('hasErrors', false)

    httpBackend.flush()
  })

  it('should save the user profile with updated details', function () {
    createController()

    scope.user.email = 'test@user.org'
    scope.user.firstname = 'Jane'
    scope.user.surname = 'Doe'
    scope.user.msisdn = '27123456789'
    scope.user.weeklyAlert = true
    scope.user.dailyAlert = true
    scope.user.groups = ['group1', 'group2']
    scope.temp.password = 'password'
    scope.temp.passwordConfirm = 'password'

    // Should submit the form with supplied values annd save the user with new password salt/hash
    scope.submitFormProfile()
    scope.user.$update.should.have.been.called()
    scope.ngError.should.have.property('hasErrors', false)

    scope.user.should.have.property('passwordSalt')
    scope.user.should.have.property('passwordHash')
    scope.user.should.have.property('firstname', 'Jane')
    scope.user.should.have.property('surname', 'Doe')
    scope.user.should.have.property('weeklyAlert', true)
    scope.user.should.have.property('dailyAlert', true)
    scope.user.should.have.property('msisdn', '27123456789')
    scope.user.groups.should.have.length(2)

    httpBackend.flush()
  })

  it('should create two taglist objects', function () {
    createController()
    httpBackend.flush()

    scope.taglistUserRoleOptions.should.have.length(2)

    scope.taglistUserRoleOptions[0].should.equal('admin')
    scope.taglistUserRoleOptions[1].should.equal('limited')
  })
})
