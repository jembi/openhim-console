'use strict'
/* global sinon: false */

describe('Controller: TransactionsAddReqResModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy', defaultLengthOfBodyToDisplay: 100 })
    })
  })

  var scope, createController, modalInstance, record, channel, httpBackend

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/transactions/538ed0867962a27d5df259b0/bodies/12345')).respond('<body>', {'Content-Range': 'bytes 0-10/11'})

    $httpBackend.when('GET', new RegExp('.*/transactions/538ed0867962a27d5df259b0')).respond({ _id: '5322fe9d8b6add4b2b059ff5', name: 'Transaction 1', urlPattern: 'sample/api', channelID: '5322fe9d8b6add4b2b059dd8', clientID: '5344fe7d8b6add4b2b069dd7', request: {
      headers: {
        'Content-Type': 'text/plain'
      }, bodyId: '12345' },
      response: {
        headers: {
          'Content-Type': 'text/plain'
        }, bodyId: '12345'
      }
    })
    createController = function (requestBody=null, responseBody=null) {
      record = {
        name: 'second',
        _id: '538ed0867962a27d5df259b0',
        response: {
          headers: {'Content-Type': 'text/plain'},
          status: 301,
          bodyId: '12345',
          timestamp: '2014-08-04T10:15:46.007Z'
        },
        request: {
          headers: {'Content-Type': 'text/plain'},
          path: '/',
          querystring: '',
          method: 'GET',
          bodyId: '12345'
        }
      }

      if (requestBody) record.request.body = requestBody
      if (responseBody) record.response.body = responseBody

      channel = {
        type: 'http'
      }

      scope = $rootScope.$new()
      modalInstance = sinon.spy()
      return $controller('TransactionsAddReqResModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        record: record,
        channel: channel,
        transactionId: record._id,
        recordType: 'routes',
        bodyRangeProperties: {
          response: {
            start: 0,
            end: 10,
            bodyLength: 14,
            partial: true
          },
          request: {
            start: 0,
            end: 10,
            bodyLength: 14,
            partial: true
          }
        },
        index: 0
      })
    }
  }))

  it('should attach a single record object to the scope', function () {
    createController()

    scope.record.name.should.equal('second')
    scope.record.response.status.should.equal(301)
    scope.record.request.method.should.equal('GET')
  })

  it('should attach the channel object to the scope', function () {
    createController()

    scope.channel.type.should.equal('http')
  })

  it('should attach the record response and request body to the scope', function () {
    createController()
    httpBackend.flush()

    scope.record.response.body.should.equal('<body>')
    scope.record.request.body.should.equal('<body>')
  })

  it('should attach the record\'s response and request body flags', function () {
    createController()
    httpBackend.flush()

    scope.should.have.property('recordRequestBodyStart')
    scope.should.have.property('recordResponseBodyStart')
    scope.should.have.property('recordRequestBodyEnd')
    scope.should.have.property('recordResponseBodyEnd')
    scope.should.have.property('recordRequestBodyLength')
    scope.should.have.property('recordResponseBodyLength')
    scope.should.have.property('partialRecordResponseBody')
    scope.should.have.property('partialRecordRequestBody')
  })

  it('should attach the record\'s response and request body and properties when they already exist (no api call to retrieve)', function () {
    createController('The request body', 'The response body')

    scope.record.response.body.should.equal('The response body')
    scope.record.request.body.should.equal('The request body')

    scope.should.have.property('recordRequestBodyStart')
    scope.should.have.property('recordResponseBodyStart')
    scope.should.have.property('recordRequestBodyEnd')
    scope.should.have.property('recordResponseBodyEnd')
    scope.should.have.property('recordRequestBodyLength')
    scope.should.have.property('recordResponseBodyLength')
    scope.should.have.property('partialRecordResponseBody')
    scope.should.have.property('partialRecordRequestBody')
  })
})
