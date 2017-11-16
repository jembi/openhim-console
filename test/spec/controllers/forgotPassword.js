'use strict'

describe('Controller: ForgotPasswordCtrl', function () {
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

    $httpBackend.when('GET', new RegExp('.*/authenticate/fake@email.com')).respond(404)
    $httpBackend.when('GET', new RegExp('.*/authenticate/test@test.com')).respond({ salt: 'test-salt', ts: 'test-ts' })
    $httpBackend.when('GET', new RegExp('.*/password-reset-request/test@test.com')).respond('Successfully set user token/expiry for password reset.')

    createController = function () {
      scope = $rootScope.$new()
      return $controller('ForgotPasswordCtrl', { $scope: scope })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should test that the controller loaded', function () {
    createController()
    scope.should.have.property('userEmail', '')
    scope.should.have.property('showFormCtrl', true)
  })

  it('should submit the form and return error for no email supplied', function () {
    createController()
    scope.should.have.property('userEmail', '')
    scope.should.have.property('showFormCtrl', true)

    scope.submitRequest()

    scope.alerts.should.have.property('forgotPassword')
    scope.alerts.forgotPassword[0].should.have.property('type', 'danger')
    scope.alerts.forgotPassword[0].should.have.property('msg', 'Please provide your email address')
  })

  it('should submit the form and return error for trying to reset "root@openhim.org"', function () {
    createController()

    scope.userEmail = 'root@openhim.org'
    scope.submitRequest()

    scope.alerts.should.have.property('forgotPassword')
    scope.alerts.forgotPassword[0].should.have.property('type', 'danger')
    scope.alerts.forgotPassword[0].should.have.property('msg', 'Cannot reset password for "root@openhim.org"')
  })

  it('should submit the form and return error for trying to reset an invalid email', function () {
    createController()

    scope.userEmail = 'fake@email.com'
    scope.submitRequest()

    scope.alerts.should.have.property('forgotPassword')
    scope.alerts.forgotPassword[0].should.have.property('type', 'warning')
    scope.alerts.forgotPassword[0].should.have.property('msg', 'Busy checking your credentials...')

    httpBackend.flush()

    scope.alerts.forgotPassword[0].should.have.property('type', 'danger')
    scope.alerts.forgotPassword[0].should.have.property('msg', 'Could not authenticate email address')
  })

  it('should submit the form and send a reset email to the user', function () {
    createController()

    scope.userEmail = 'test@test.com'
    scope.submitRequest()

    scope.alerts.should.have.property('forgotPassword')
    scope.alerts.forgotPassword[0].should.have.property('type', 'warning')
    scope.alerts.forgotPassword[0].should.have.property('msg', 'Busy checking your credentials...')

    httpBackend.flush()

    scope.alerts.forgotPassword[0].should.have.property('type', 'info')
    scope.alerts.forgotPassword[0].should.have.property('msg', 'Password reset email has been sent...')
  })
})
