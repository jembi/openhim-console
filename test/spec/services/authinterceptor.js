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
  var Authinterceptor, location
  beforeEach(inject(function (_Authinterceptor_, $location) {
    Authinterceptor = _Authinterceptor_
    location = $location
  }))

  it('should redirect to login page if not authorised', function () {
    var response = {
      status: 401
    }
    Authinterceptor.responseError(response)
    var currentLocation = location.path();
    currentLocation.should.be.equal('/login')
  })
})
