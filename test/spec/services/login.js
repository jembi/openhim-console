'use strict'

describe('Service: login', function () {
  // load the service's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  // instantiate service
  var login, httpBackend
  beforeEach(inject(function (_login_, $httpBackend) {
    login = _login_

    httpBackend = $httpBackend

    httpBackend.when('GET', new RegExp('.*/me')).respond(404)
    
    httpBackend.when('POST', new RegExp('.*/authenticate/local')).respond({
      body: "User Authenticated successfully"
    })

    httpBackend.when('GET', new RegExp('.*/users/.*')).respond({
      __v: 0,
      _id: '539846c240f2eb682ffeca4b',
      email: 'test@user.org',
      firstname: 'test',
      surname: 'test',
      groups: [
        'admin'
      ]
    })
   
    httpBackend.when('GET', new RegExp('.*/logout')).respond(201)
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should login a user and fetch the currently logged in user', function () {
    httpBackend.expectPOST(new RegExp('.*/authenticate/local'))
    httpBackend.expectGET(new RegExp('.*/users/test@user.org'))
    
    login.login('test@user.org', 'test-password', function () {})
    httpBackend.flush()

    var user = login.getLoggedInUser()

    user.should.exist()
    user.should.have.property('email', 'test@user.org')
  })

  it('should logout a user', function () {
    httpBackend.expectGET(new RegExp('.*/logout'))

    login.logout(function () {})
    httpBackend.flush()

    var user = login.getLoggedInUser()
    expect((user === null)).to.be.true()
    expect(login.isLoggedIn()).to.be.false()
  })

  it('should check if a user is currently logged in', function () {
    httpBackend.flush()
    expect(login.isLoggedIn()).to.be.false()

    login.login('test@user.org', 'test-password', function () {})
    httpBackend.flush()

    expect(login.isLoggedIn()).to.be.true()
    
    login.logout(function () {})
    httpBackend.flush()

    expect(login.isLoggedIn()).to.be.false()
  })
})
