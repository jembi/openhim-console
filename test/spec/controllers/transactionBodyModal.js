'use strict'
/* jshint expr: true */
/* global sinon: false */

describe('Controller: TransactionBodyModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy', defaultLengthOfBodyToDisplay: 100 })
    })
  })

  var scope, createController, httpBackend, responseBody // eslint-disable-line

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend
    responseBody = '<The fetched body>'

    $httpBackend.when('GET', new RegExp('.*/transactions/548ed0867962a27d5df259b0/bodies/12345')).respond(responseBody, {'Content-Range': 'bytes 0-10/11'})

    const bodyData = {
      bodyRangeProperties: {
        start: 0,
        end: 5,
        bodyLength: 8,
        partial: true
      },
      bodyId: '12345',
      headers: {
        'Content-Type': 'text/plain'
      },
      transactionId: '548ed0867962a27d5df259b0'
    }
    createController = function (body=null) {
      if (body) bodyData.content = 'The body'

      scope = $rootScope.$new()

      return $controller('TransactionsBodyModalCtrl', { $scope: scope, $uibModalInstance: sinon.spy(), bodyData })
    }
  }))

  it('should attach the body and its range properties', function () {
    const body = 'The body'
    createController(body)

    scope.bodyData.content.should.equal(body)
    scope.should.have.property('partialBody')
    scope.should.have.property('bodyStart')
    scope.should.have.property('bodyEnd')
    scope.should.have.property('bodyLength')
  })

  it('should attach function for retrieving bodies', function () {
    createController()

    scope.should.have.property('retrieveBodyData')

    scope.retrieveBodyData()
    httpBackend.flush()

    scope.bodyData.content.should.equal(responseBody)
    scope.should.have.property('partialBody')
    scope.should.have.property('bodyStart')
    scope.should.have.property('bodyEnd')
    scope.should.have.property('bodyLength')
  })
})
