'use strict'
/* global sinon: false */

describe('Controller: ContactGroupsCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend, modalSpy

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $uibModal) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/groups')).respond([
      { group: 'Group 1', users: [{ user: 'User 1', method: 'sms', maxAlerts: 'no max' }] },
      { group: 'Group 2', users: [{ user: 'User 22', method: 'email', maxAlerts: 'no max' }] },
      { group: 'Group 3', users: [{ user: 'User 333', method: 'email', maxAlerts: '1 per hour' }] },
      { group: 'Group 4', users: [{ user: 'User 4444', method: 'sms', maxAlerts: '1 per day' }] }
    ])

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { firstname: 'User1', lastname: 'User1111', email: 'user1@email.com' },
      { firstname: 'User22', lastname: 'User2222', email: 'user2@email.com' },
      { firstname: 'User333', lastname: 'User3333', email: 'user3@email.com' },
      { firstname: 'User4444', lastname: 'User4444', email: 'user4@email.com' }
    ])

    modalSpy = sinon.spy($uibModal, 'open')

    createController = function () {
      scope = $rootScope.$new()
      return $controller('ContactGroupsCtrl', { $scope: scope })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a list of contact groups to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/groups'))
    createController()
    httpBackend.flush()
    scope.contactGroups.length.should.equal(4)
  })

  it('should open a modal to confirm deletion of a client', function () {
    createController()
    httpBackend.flush()

    scope.confirmDelete(scope.contactGroups[0])
    modalSpy.should.have.been.calledOnce()
  })

  it('should open a modal to add a contact group', function () {
    createController()
    httpBackend.expectGET(new RegExp('.*/users'))
    scope.addContactGroup()
    modalSpy.should.have.been.calledOnce()

    httpBackend.flush()
  })

  it('should open a modal to edit a contact group', function () {
    createController()
    httpBackend.expectGET(new RegExp('.*/users'))
    scope.editContactGroup()
    modalSpy.should.have.been.calledOnce()
    httpBackend.flush()
  })
})
