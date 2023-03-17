'use strict'
/* global sinon:false */

describe('Service: Notify', function () {
  // load the service's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  // instantiate service
  var Notify
  var rootScope
  beforeEach(inject(function (_Notify_, $rootScope) {
    Notify = _Notify_
    rootScope = $rootScope
    sinon.spy(rootScope, '$broadcast')
  }))

  it('should broadcast an event', function () {
    Notify.should.be.ok()
    Notify.notify('testEvent')
    rootScope.$broadcast.should.have.been.calledWith('testEvent')
  })
})
