'use strict'

describe('Controller: LoginCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  // instantiate service
  // var login, httpBackend
  var scope, login, createController, httpBackend

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _login_, $httpBackend) {
    // reset localStorage session variable
    localStorage.removeItem('consoleSession')

    login = _login_

    httpBackend = $httpBackend

    httpBackend.when('GET', new RegExp('.*/authenticate/test@user.org')).respond({ salt: 'test-salt', ts: new Date().getTime() })

    httpBackend.when('GET', new RegExp('.*/authenticate/root@openhim.org')).respond({ salt: 'test-salt', ts: new Date().getTime() })

    httpBackend.when('GET', new RegExp('.*/authenticate/incorrect@user.org')).respond({})

    httpBackend.when('GET', new RegExp('.*/users/.*')).respond({
      '__v': 0,
      '_id': '539846c240f2eb682ffeca4b',
      'email': 'test@user.org',
      'firstname': 'test',
      'passwordAlgorithm': 'sha512',
      'passwordHash': '7d0d1a30d16f5343e3390fe9ef1dd61539a7f797267e0d2241ed22390dfc9743091244ddb2463df2f1adf6df3c355876ed34c6523f1e8d3b7f16f4b2afc8c160',
      'passwordSalt': 'test-salt',
      'surname': 'test',
      'groups': [ 'admin' ],
      'settings': { 'filter': {'status': 'Successful', 'channel': '5322fe9d8b6add4b2b059dd8', 'limit': '200'},
        'list': {'tabview': 'new'} }
    }, {
      '_id': '349274c136f2eb682aodye4c',
      'email': 'root@openhim.org',
      'firstname': 'Super',
      'surname': 'User',
      'passwordAlgorithm': 'sha512',
      'passwordHash': '943a856bba65aad6c639d5c8d4a11fc8bb7fe9de62ae307aec8cf6ae6c1faab722127964c71db4bdd2ea2cdf60c6e4094dcad54d4522ab2839b65ae98100d0fb',
      'passwordSalt': 'd9bcb40e-ae65-478f-962e-5e5e5e7d0a01',
      'groups': [ 'admin' ],
      'settings': { 'filter': {'status': 'Successful', 'channel': '5322fe9d8b6add4b2b059dd8', 'limit': '200'},
        'list': {'tabview': 'new'} }
    })

    httpBackend.when('PUT', new RegExp('.*/users')).respond('user has been successfully updated')

    createController = function () {
      scope = $rootScope.$new()
      return $controller('LoginCtrl', { $scope: scope })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  // Testing the validateLogin() function
  describe('*validateLogin() tests', function () {
    // check for empty fileds
    it('should return an error message for incomplete fields', function () {
      createController()
      scope.loginEmail = ''
      scope.loginPassword = ''
      scope.validateLogin()
      scope.alerts.login.length.should.equal(1)
    })

    // once all fields supplied, check if user exist based on credentials
    it('should run entire login process and return an error message for incorrect login credentials', function () {
      httpBackend.expectGET(new RegExp('.*/authenticate/incorrect@user.org'))

      createController()

      scope.loginEmail = 'incorrect@user.org'
      scope.loginPassword = 'incorrect-password'
      scope.validateLogin()

      // One error should exist - 'Busy checking login credentials'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('warning')
      scope.alerts.login[0].msg.should.equal('Busy checking your credentials...')

      httpBackend.flush()

      // One error should exist - 'Busy checking login credentials'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('danger')
      scope.alerts.login[0].msg.should.equal('The supplied credentials were incorrect. Please try again')

      // user should not exist if incorrect login credentials
      var user = login.getLoggedInUser()
      user.should.be.empty()
    })

    // process correct credentials and log user and create the session - Testing Complete Process
    it('should run entire login process and login a user and fetch the currently logged in user', function () {
      httpBackend.expectGET(new RegExp('.*/authenticate/test@user.org'))
      httpBackend.expectGET(new RegExp('.*/users/test@user.org'))

      createController()

      // user should be empty before valid login
      var user = login.getLoggedInUser()
      user.should.be.empty()

      scope.loginEmail = 'test@user.org'
      scope.loginPassword = 'test-password'
      scope.validateLogin()

      // One error should exist - 'Busy checking login credentials'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('warning')
      scope.alerts.login[0].msg.should.equal('Busy checking your credentials...')

      httpBackend.flush()

      // user should exist when vald login details supplied
      user = login.getLoggedInUser()

      user.should.exist()
      user.should.have.property('email', 'test@user.org')
      user.should.have.property('passwordHash', '7d0d1a30d16f5343e3390fe9ef1dd61539a7f797267e0d2241ed22390dfc9743091244ddb2463df2f1adf6df3c355876ed34c6523f1e8d3b7f16f4b2afc8c160')
    })
  })

  describe('*resetRootPassword() tests', function () {
    it('should run the resetRootPassword() function return error for not all fields being supplied', function () {
      httpBackend.expectGET(new RegExp('.*/authenticate/root@openhim.org'))
      httpBackend.expectGET(new RegExp('.*/users/root@openhim.org'))

      createController()
      scope.rootPasswordReset.should.equal(false)

      // user should be empty before valid login
      var user = login.getLoggedInUser()
      user.should.be.empty()

      scope.loginEmail = 'root@openhim.org'
      scope.loginPassword = 'openhim-password'
      scope.validateLogin()

      // One error should exist - 'Busy checking login credentials'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('warning')
      scope.alerts.login[0].msg.should.equal('Busy checking your credentials...')

      httpBackend.flush()

      scope.rootPasswordReset.should.equal(true)

      scope.password = 'newpassword'
      scope.passwordConfirm = ''
      scope.resetRootPassword()

      // One error should exist - 'Supply all fields'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('danger')
      scope.alerts.login[0].msg.should.equal('Please provide both password fields')
    })

    it('should run the resetRootPassword() function return error for password not matching', function () {
      httpBackend.expectGET(new RegExp('.*/authenticate/root@openhim.org'))
      httpBackend.expectGET(new RegExp('.*/users/root@openhim.org'))

      createController()
      scope.rootPasswordReset.should.equal(false)

      // user should be empty before valid login
      var user = login.getLoggedInUser()
      user.should.be.empty()

      scope.loginEmail = 'root@openhim.org'
      scope.loginPassword = 'openhim-password'
      scope.validateLogin()

      // One error should exist - 'Busy checking login credentials'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('warning')
      scope.alerts.login[0].msg.should.equal('Busy checking your credentials...')

      httpBackend.flush()

      scope.rootPasswordReset.should.equal(true)

      scope.password = 'newpassword'
      scope.passwordConfirm = 'newpasswordnewpassword'
      scope.resetRootPassword()

      // One error should exist - 'Supply all fields'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('danger')
      scope.alerts.login[0].msg.should.equal('The supplied passwords do not match')
    })

    it('should run the resetRootPassword() function return error for new password being same as default one', function () {
      httpBackend.expectGET(new RegExp('.*/authenticate/root@openhim.org'))
      httpBackend.expectGET(new RegExp('.*/users/root@openhim.org'))

      createController()
      scope.rootPasswordReset.should.equal(false)

      // user should be empty before valid login
      var user = login.getLoggedInUser()
      user.should.to.empty()

      scope.loginEmail = 'root@openhim.org'
      scope.loginPassword = 'openhim-password'
      scope.validateLogin()

      // One error should exist - 'Busy checking login credentials'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('warning')
      scope.alerts.login[0].msg.should.equal('Busy checking your credentials...')

      httpBackend.flush()

      scope.rootPasswordReset.should.equal(true)

      scope.password = 'openhim-password'
      scope.passwordConfirm = 'openhim-password'
      scope.resetRootPassword()

      // One error should exist - 'Supply all fields'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('danger')
      scope.alerts.login[0].msg.should.equal('The supplied password is the same as the current one')
    })

    it('should run the resetRootPassword() function and update the root users password', function () {
      httpBackend.expectGET(new RegExp('.*/authenticate/root@openhim.org'))
      httpBackend.expectGET(new RegExp('.*/users/root@openhim.org'))

      createController()
      scope.rootPasswordReset.should.equal(false)

      // user should be empty before valid login
      var user = login.getLoggedInUser()
      user.should.be.empty()

      scope.loginEmail = 'root@openhim.org'
      scope.loginPassword = 'openhim-password'
      scope.validateLogin()

      // One error should exist - 'Busy checking login credentials'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('warning')
      scope.alerts.login[0].msg.should.equal('Busy checking your credentials...')

      httpBackend.flush()

      scope.rootPasswordReset.should.equal(true)

      scope.password = 'openhim-newpassword'
      scope.passwordConfirm = 'openhim-newpassword'
      scope.resetRootPassword()

      httpBackend.flush()

      var consoleSession = localStorage.getItem('consoleSession')
      consoleSession.should.exist()

      scope.alerts.login.length.should.equal(2)
      scope.alerts.login[0].type.should.equal('success')
      scope.alerts.login[0].msg.should.equal('Root Password Successfully Reset.')
      scope.alerts.login[1].type.should.equal('success')
      scope.alerts.login[1].msg.should.equal("You will be redirected to the 'Transactions' page shortly.")
    })
  })

  // Testing the checkLoginCredentials() function
  describe('*checkLoginCredentials() tests', function () {
    // process the checkLoginCredentials() function - user should be invalid and error thrown
    it('should run the checkLoginCredentials() function and return error with incorrect login details', function () {
      httpBackend.expectGET(new RegExp('.*/authenticate/incorrect@user.org'))
      createController()

      // user should be empty before valid login
      var user = login.getLoggedInUser()
      user.should.be.empty()

      // check if login credentials valid and log the user in - User should not be logged in
      scope.checkLoginCredentials('incorrect@user.org', 'incorrect-password')

      httpBackend.flush()

      // One error should exist - 'Busy checking login credentials'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('danger')
      scope.alerts.login[0].msg.should.equal('The supplied credentials were incorrect. Please try again')

      // user should not exist if incorrect login credentials
      user = login.getLoggedInUser()
      user.should.be.empty()
    })

    // process the checkLoginCredentials() function - user should be valid and logged in - session created
    it('should run the checkLoginCredentials() function and login successfully', function () {
      httpBackend.expectGET(new RegExp('.*/authenticate/test@user.org'))
      httpBackend.expectGET(new RegExp('.*/users/test@user.org'))
      createController()

      // user should be empty before valid login
      var user = login.getLoggedInUser()
      user.should.be.empty()

      // check if login credentials valid and log the user in - create user session
      scope.checkLoginCredentials('test@user.org', 'test-password')

      httpBackend.flush()

      // user should exist when vald login details supplied
      user = login.getLoggedInUser()

      user.should.exist()
      user.should.have.property('email', 'test@user.org')
      user.should.have.property('passwordHash', '7d0d1a30d16f5343e3390fe9ef1dd61539a7f797267e0d2241ed22390dfc9743091244ddb2463df2f1adf6df3c355876ed34c6523f1e8d3b7f16f4b2afc8c160')
    })
  })

  // Testing the createUserSession() function
  describe('*createUserSession() tests', function () {
    // process the createUserSession() function and throw email if not supplied error
    it('should run the createUserSession() function and throw error if email not supplied', function () {
      createController()
      // create the session object to store session data
      var sessionResult = scope.createUserSession('')
      sessionResult.should.equal('No Email supplied!')
    })

    // process the createUserSession() function and throw no user profile found error
    it('should run the createUserSession() function and throw error if user profile not found', function () {
      createController()

      // creeate the session object to store session data
      var sessionResult = scope.createUserSession('incorrect@user.org')
      sessionResult.should.equal('Logged in user could not be found!')

      // user should exist when vald login details supplied
      var user = login.getLoggedInUser()
      user.should.exist()
      user.should.be.empty()
    })

    // process the createUserSession() function and create user session successfully
    it('should run the createUserSession() function and create a user session successfully', function () {
      httpBackend.expectGET(new RegExp('.*/authenticate/test@user.org'))

      createController()
      login.login('test@user.org', 'test-password', function () {
        // user should exist when vald login details supplied
        var user = login.getLoggedInUser()

        // check that user is created
        user.should.exist()
        user.should.have.property('email', 'test@user.org')
        user.should.have.property('passwordHash', '7d0d1a30d16f5343e3390fe9ef1dd61539a7f797267e0d2241ed22390dfc9743091244ddb2463df2f1adf6df3c355876ed34c6523f1e8d3b7f16f4b2afc8c160')

        // creeate the session object to store session data
        scope.createUserSession('test@user.org')

        var consoleSession = localStorage.getItem('consoleSession')
        consoleSession.should.exist()
      })

      httpBackend.flush()
    })
  })
})
