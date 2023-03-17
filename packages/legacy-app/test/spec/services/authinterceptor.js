'use strict'
/* global CryptoJS: false */

describe('Service: Authinterceptor', function () {
  // load the service's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  // instantiate service
  var Authinterceptor
  beforeEach(inject(function (_Authinterceptor_) {
    Authinterceptor = _Authinterceptor_
  }))

  var u = {
    email: 'test-user',
    passwordHash: 'test-hash',
    timeDiff: new Date().getTime()
  }

  it('should add add authentication details to each request config', function () {
    Authinterceptor.setLoggedInUser(u)

    var config = {}
    config.headers = {}
    config = Authinterceptor.request(config)

    config.headers['auth-username'].should.be.eql(u.email)
    config.headers['auth-ts'].should.exist()
    config.headers['auth-salt'].should.exist()
    config.headers['auth-token'].should.exist()

    var sha512 = CryptoJS.algo.SHA512.create()
    sha512.update(u.passwordHash)
    sha512.update(config.headers['auth-salt'])
    sha512.update(config.headers['auth-ts'])
    var hash = sha512.finalize()

    config.headers['auth-token'].should.eql(hash.toString(CryptoJS.enc.Hex))
  })

  it('should set the logged in user', function () {
    Authinterceptor.setLoggedInUser(u)
    var u2 = Authinterceptor.getLoggedInUser()

    u.should.be.eql(u2)
  })
})
