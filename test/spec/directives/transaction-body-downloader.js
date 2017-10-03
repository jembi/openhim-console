'use strict'

describe('directive: transaction-body-downloader', function () {
  beforeEach(module('openhimConsoleApp'))

  var scope, compileDirective, httpBackend

  beforeEach(inject(function ($compile, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    compileDirective = function (transactionId, path) {
      var _scope = $rootScope.$new()
      var html = '<transaction-body-downloader transaction-id="\'' + transactionId + '\'"' +
        ' path="\'' + path + '\'"></transaction-body-downloader>'
      var directive = $compile(html)(_scope)
      _scope.$digest()
      scope = directive.isolateScope()
      return directive
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
  })

  it('should generate a downloadable blob for a transaction', function (done) {
    httpBackend.expect('GET', new RegExp('.*/transactions/538ed0867962a27d5df2a470')).respond({
      _id: '538ed0867962a27d5df2a470',
      channelID: '5322fe9d8b6add4b2b059dd8',
      clientID: '5344fe7d8b6add4b2b069dd7',
      request: {
        headers: {
          'content-type': 'application/json'
        },
        body: '{"test": "request"}'
      },
      response: {
        headers: {
          'content-type': 'application/json'
        },
        body: '{"test": "response"}'
      }
    })

    compileDirective('538ed0867962a27d5df2a470', 'request')
    scope.downloadHandler = function (blob, filename) {
      blob.type.should.be.equal('application/json')
      filename.should.be.equal('538ed0867962a27d5df2a470_request.json')
      done()
    }
    scope.download()
    httpBackend.flush()
  })

  it('should set the filename extension according to the content type', function (done) {
    httpBackend.expect('GET', new RegExp('.*/transactions/538ed0867962a27d5df2a470')).respond({
      _id: '538ed0867962a27d5df2a470',
      channelID: '5322fe9d8b6add4b2b059dd8',
      clientID: '5344fe7d8b6add4b2b069dd7',
      request: {
        headers: {
          'content-type': 'application/xml'
        },
        body: '<test>request</test>'
      },
      response: {
        headers: {
          'content-type': 'application/xml'
        },
        body: '<test>response</test>'
      }
    })

    compileDirective('538ed0867962a27d5df2a470', 'request')
    scope.downloadHandler = function (blob, filename) {
      blob.type.should.be.equal('application/xml')
      filename.should.be.equal('538ed0867962a27d5df2a470_request.xml')
      done()
    }
    scope.download()
    httpBackend.flush()
  })

  it('should include the body location in the filename', function (done) {
    httpBackend.expect('GET', new RegExp('.*/transactions/538ed0867962a27d5df2a470')).respond({
      _id: '538ed0867962a27d5df2a470',
      channelID: '5322fe9d8b6add4b2b059dd8',
      clientID: '5344fe7d8b6add4b2b069dd7',
      request: {
        headers: {
          'content-type': 'application/json'
        },
        body: '{"test": "request"}'
      },
      response: {
        headers: {
          'content-type': 'application/json'
        },
        body: '{"test": "response"}'
      }
    })

    compileDirective('538ed0867962a27d5df2a470', 'response')
    scope.downloadHandler = function (blob, filename) {
      filename.should.be.equal('538ed0867962a27d5df2a470_response.json')
      done()
    }
    scope.download()
    httpBackend.flush()
  })

  it('should include the body location in the filename for an array (orchestration)', function (done) {
    httpBackend.expect('GET', new RegExp('.*/transactions/538ed0867962a27d5df2a470')).respond({
      _id: '538ed0867962a27d5df2a470',
      channelID: '5322fe9d8b6add4b2b059dd8',
      clientID: '5344fe7d8b6add4b2b069dd7',
      orchestrations: [
        {
          request: {
            headers: {
              'content-type': 'application/xml'
            },
            body: '<test>request</test>'
          }
        },
        {
          request: {
            headers: {
              'content-type': 'application/json'
            },
            body: '{"test": "request"}'
          }
        }
      ]
    })

    compileDirective('538ed0867962a27d5df2a470', 'orchestrations[1].request')
    scope.downloadHandler = function (blob, filename) {
      blob.type.should.be.equal('application/json')
      filename.should.be.equal('538ed0867962a27d5df2a470_orchestrations1Request.json')
      done()
    }
    scope.download()
    httpBackend.flush()
  })
})
