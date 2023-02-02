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

    httpBackend.when('POST', new RegExp('.*/authenticate/.*')).respond({
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
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should login a user and fetch the currently logged in user', function () {
    httpBackend.expectPOST(new RegExp('.*/authenticate/test@user.org'))
    httpBackend.expectGET(new RegExp('.*/users/test@user.org'))
    login.login('test@user.org', 'test-password', function () {})

    httpBackend.flush()

    var user = login.getLoggedInUser()

    user.should.exist()
    user.should.have.property('email', 'test@user.org')
    user.should.have.property('passwordHash', '7d0d1a30d16f5343e3390fe9ef1dd61539a7f797267e0d2241ed22390dfc9743091244ddb2463df2f1adf6df3c355876ed34c6523f1e8d3b7f16f4b2afc8c160')
  })

  it('should logout a user', function () {
    login.logout()
    var user = login.getLoggedInUser()
    expect((user === null)).to.be.true()
  })

  it('should check if a user is currently logged in', function () {
    expect(login.isLoggedIn()).to.be.false()

    login.login('test@user.org', 'test-password', function () {})
    httpBackend.flush()

    expect(login.isLoggedIn()).to.be.true()
    login.logout()
    expect(login.isLoggedIn()).to.be.false()
  })
})
