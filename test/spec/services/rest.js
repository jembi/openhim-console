'use strict'

describe('Service: Api', function () {
  // load the service's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  // instantiate service
  var Api
  beforeEach(inject(function (_Api_) {
    Api = _Api_
  }))

  it('should define an Api service', function () {
    Api.should.be.ok()
  })
})
