'use strict'
/* global sinon: false */

describe('Controller: TransactionsAddReqResModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var scope, createController, modalInstance, record, channel

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    createController = function () {
      record = {
        'name': 'second',
        '_id': '53df5d525b6d133c7de9eb56',
        'response': {
          'status': 301,
          'body': 'this is dummy body content',
          'timestamp': '2014-08-04T10:15:46.007Z'
        },
        'request': {
          'path': '/',
          'querystring': '',
          'method': 'GET'
        }
      }

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
})
