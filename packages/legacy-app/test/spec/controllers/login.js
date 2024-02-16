'use strict'

describe('Controller: LoginCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy', "ssoEnabled": true, keyCloakUrl: "http://urlExample:9088", keyCloakRealm: "exampleRealm", keyCloakClientId: "exampleID" })
    })
  })

  // instantiate service
  // var login, httpBackend
  var scope, login, createController, httpBackend, keycloak, window

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _login_, $httpBackend, _keycloak_, $window) {
    // reset localStorage session variable
    localStorage.removeItem('consoleSession')

    login = _login_

    window = $window

    keycloak = _keycloak_

    // Override function to prevent page reload
    keycloak.keycloakInstance = {
      init: () => {},
      login: () => {},
      logout: () => {}
    }

    httpBackend = $httpBackend

    httpBackend.when('GET', new RegExp('.*/users/.*')).respond({
      __v: 0,
      _id: '539846c240f2eb682ffeca4b',
      email: 'test@user.org',
      firstname: 'test',
      surname: 'test',
      groups: ['admin'],
      settings: {
        filter: { status: 'Successful', channel: '5322fe9d8b6add4b2b059dd8', limit: '200' },
        list: { tabview: 'new' }
      }
    }, {
      _id: '349274c136f2eb682aodye4c',
      email: 'root@openhim.org',
      firstname: 'Super',
      surname: 'User',
      groups: ['admin'],
      settings: {
        filter: { status: 'Successful', channel: '5322fe9d8b6add4b2b059dd8', limit: '200' },
        list: { tabview: 'new' }
      }
    })

    httpBackend.when('PUT', new RegExp('.*/users')).respond('user has been successfully updated')
    httpBackend.when('GET', new RegExp('.*/logout')).respond(200)

    createController = function (options = {}) {
      let config = {ssoEnabled: true}

      if(!options.ssoEnabled) {
        config.ssoEnabled = false
      }
      if(options.window) {
        $window = options.window
      }

      httpBackend.when('GET', new RegExp('.*/me')).respond(404)
      httpBackend.flush()

      scope = $rootScope.$new()
      return $controller('LoginCtrl', { $scope: scope, config, keycloak, $window})
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
      scope.alerts.login[0].type.should.equal('danger')
      scope.alerts.login[0].msg.should.equal('Please provide your login credentials')
    })

    // once all fields supplied, check if user exist based on credentials
    it('should run entire login process and return an error message for incorrect login credentials', function () {
      httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond(401)

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
      httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond(201)

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
    })
  })

  describe('*resetRootPassword() tests', function () {
    it('should run the resetRootPassword() function return error for not all fields being supplied', function () {
      httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond(201)

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
      httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond(201)

      createController()
      scope.rootPasswordReset.should.equal(false)

      // user should be empty before valid login
      var user = login.getLoggedInUser()
      user.should.be.empty()

      scope.loginEmail = 'root@openhim.org'
      scope.loginPassword = 'openhim-password'
      scope.validateLogin()

      httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond(401)

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
      httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond(201)

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
      httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond(201)

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
      httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond(401)
      createController()

      // user should be empty before valid login
      var user = login.getLoggedInUser()
      user.should.be.empty()

      // check if login credentials valid and log the user in - User should not be logged in
      scope.checkLoginCredentials('incorrect@user.org', 'incorrect-password')

      httpBackend.flush()

      // One error should exist - 'The supplied credentials were incorrect. Please try again'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('danger')
      scope.alerts.login[0].msg.should.equal('The supplied credentials were incorrect. Please try again')

      // user should not exist if incorrect login credentials
      user = login.getLoggedInUser()
      user.should.be.empty()
    })

    it('should run the checkLoginCredentials() function and return error with server errors (< 100 code status)', function () {
      // Trigger a server issue
      httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond(80)
      createController()

      // user should be empty before valid login
      var user = login.getLoggedInUser()
      user.should.be.empty()

      // check if login credentials valid and log the user in - User should not be logged in
      scope.checkLoginCredentials('incorrect@user.org', 'incorrect-password')

      httpBackend.flush()

      scope.coreConnectionError.should.equal(true)

      // user should not exist if there is a server error
      user = login.getLoggedInUser()
      user.should.be.empty()
    })

    // process the checkLoginCredentials() function - user should be valid and logged in - session created
    it('should run the checkLoginCredentials() function and login successfully', function () {
      httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond(201)

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
      httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond(201)

      createController()
      login.login('test@user.org', 'test-password', function () {
        // user should exist when vald login details supplied
        var user = login.getLoggedInUser()

        // check that user is created
        user.should.exist()
        user.should.have.property('email', 'test@user.org')

        // creeate the session object to store session data
        scope.createUserSession('test@user.org')

        var consoleSession = localStorage.getItem('consoleSession')
        consoleSession.should.exist()
      })

      httpBackend.flush()
    })
  })

  // Testing the signInWithKeyCloak() function
  describe('*signInWithKeyCloak() tests', function () {
    it('should init keycloak if ssoEnabled config is set to true', function () {
      createController({ ssoEnabled: true })
      scope.signInWithKeyCloak()

      scope.alerts.should.not.have.property("login")
    })

    it('should login after getting the redirected url', function () {
      httpBackend.when('POST', new RegExp('.*/authenticate/openid')).respond({ user: {
        __v: 0,
        _id: '539846c240f2eb682ffeca4b',
        email: 'test@user.org',
        firstname: 'test',
        surname: 'test',
        groups: ['admin'],
        provider: 'keycloak',
        settings: {
          filter: { status: 'Successful', channel: '5322fe9d8b6add4b2b059dd8', limit: '200' },
          list: { tabview: 'new' }
        }
    }})

      let window = {}

      window.location = { hash: "#!/login#state=x&session_state=x&code=x"}
  
      const expectedSession = {
        sessionUser: 'test@user.org',
        sessionUserGroups: ['admin'],
        sessionProvider: "keycloak",
        sessionUserSettings:  {
          filter: { status: 'Successful', channel: '5322fe9d8b6add4b2b059dd8', limit: '200' },
          list: { tabview: 'new' }
        }
      }

      createController({ ssoEnabled: true, window })
      httpBackend.flush()
      
      const consoleSession = JSON.parse(localStorage.getItem('consoleSession'))

      expectedSession.sessionUser.should.equal(consoleSession.sessionUser)
      expectedSession.sessionProvider.should.equal(consoleSession.sessionProvider)
      expectedSession.sessionUserGroups[0].should.equal(consoleSession.sessionUserGroups[0])
      expectedSession.sessionUserSettings.should.deep.equal(consoleSession.sessionUserSettings)

      // user should exist
      var user = login.getLoggedInUser()
      user.should.exist()
      user.should.have.property('email', 'test@user.org')
    })

    it('should return an error message if login failed after getting the redirected url', function () {
      httpBackend.when('POST', new RegExp('.*/authenticate/openid')).respond(401)

      let window = {}
      
      window.location = { hash: "#!/login#state=x&session_state=x&code=x"}

      createController({ ssoEnabled: true, window })
      httpBackend.flush()


      // One error should exist - 'The supplied credentials were incorrect. Please try again'
      scope.alerts.login.length.should.equal(1)
      scope.alerts.login[0].type.should.equal('danger')
      scope.alerts.login[0].msg.should.equal('Sign-in with Keycloak failed. Please try again')

      // user should not exist if incorrect login credentials
      var user = login.getLoggedInUser()
      user.should.be.empty()
    })

    it('should return an server error if login failed after getting the redirected url (<100 status code)', function () {
      httpBackend.when('POST', new RegExp('.*/authenticate/openid')).respond(90)

      let window = {}
      
      window.location = { hash: "#!/login#state=x&session_state=x&code=x"}

      createController({ ssoEnabled: true, window })
      httpBackend.flush()

      scope.coreConnectionError.should.equal(true)

      // user should not exist if incorrect login credentials
      var user = login.getLoggedInUser()
      user.should.be.empty()
    })
  })

  // Testing the Logout functionnality
  describe('*Logout() tests', function () {
    // Logout of a local login
    it('should logout when local provider and remove session', function () {
      const sessionExample = {
        sessionID: "sessionId", 
        sessionUser: "test@test.org",
        sessionUserGroups: [],
        sessionProvider: "local"
      }
      localStorage.setItem('consoleSession', sessionExample)

      let window = {}
      window.location = { hash: '#/logout'}

      createController({ ssoEnabled: true, window })
      httpBackend.flush()

      const consoleSession = localStorage.getItem('consoleSession')
      expect(consoleSession === null).to.be.true()
    })
  })
})
