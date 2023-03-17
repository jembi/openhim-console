'use strict'
/* global sinon:false */

describe('Controller: ContactGroupsModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/users$')).respond([])

    scope = $rootScope.$new()
    var modalInstance = sinon.spy()

    createController = function () {
      var contactGroup = {
        $save: sinon.spy(),
        $update: sinon.spy(),
        _id: '553516b69fdbfc281db58efd'
      }

      $httpBackend.when('GET', new RegExp('.*/groups/.+')).respond(contactGroup)

      return $controller('ContactGroupsModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        contactGroup: contactGroup
      })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should fetch contact group data from the API when updating', function () {
    httpBackend.expect('GET', new RegExp('.*/groups/.+'))
    createController()
    httpBackend.flush()
  })

  it('should create a new contact group if this is not an update', function () {
    createController()
    httpBackend.flush()
    scope.contactGroup.should.be.ok()
  })

  it('should run validateFormContactGroups() for any validation errors - ngErrors.hasErrors -> TRUE', function () {
    createController()
    httpBackend.flush()

    scope.contactGroup.group = ''
    scope.contactGroup.users = ''

    // run the validate
    scope.validateFormContactGroups()
    scope.ngError.should.have.property('hasErrors', true)
    scope.ngError.should.have.property('group', true)
    scope.ngError.should.have.property('users', true)
  })

  it('should run validateFormContactGroups() for any validation errors - ngErrors.hasErrors -> FALSE', function () {
    createController()
    httpBackend.flush()

    scope.contactGroup.group = 'Group 1'
    scope.contactGroup.users = [{ user: 'User 1', method: 'sms', maxAlerts: 'no max' }, { user: 'User 22', method: 'email', maxAlerts: '1 per day' }]

    // run the validate
    scope.validateFormContactGroups()
    scope.ngError.should.have.property('hasErrors', false)
  })

  it('should run submitFormContactGroups() and check any validation errors - FALSE - should not save the record', function () {
    createController()
    httpBackend.flush()

    scope.contactGroup.group = ''
    scope.contactGroup.users = ''

    // run the submit
    scope.submitFormContactGroups()
    scope.ngError.should.have.property('hasErrors', true)
    scope.ngError.should.have.property('group', true)
    scope.ngError.should.have.property('users', true)
  })

  it('should run submitFormContactGroups() and check any validation errors - TRUE - Should save the record', function () {
    createController()
    httpBackend.flush()

    // update is false so create new contact group
    scope.update = false

    scope.contactGroup.group = 'Group 1'
    scope.contactGroup.users = [{ user: 'User 1', method: 'sms', maxAlerts: 'no max' }, { user: 'User 22', method: 'email', maxAlerts: '1 per day' }]

    // run the submit
    scope.submitFormContactGroups()
    scope.ngError.should.have.property('hasErrors', false)
    scope.contactGroup.$save.should.have.been.called()
  })

  it('should run submitFormContactGroups() and check any validation errors - TRUE - Should update the record', function () {
    createController()
    httpBackend.flush()

    // update is false so create new contact group
    scope.update = true

    scope.contactGroup.group = 'Group 1'
    scope.contactGroup.users = [{ user: 'User 1', method: 'sms', maxAlerts: 'no max' }, { user: 'User 22', method: 'email', maxAlerts: '1 per day' }]

    // run the submit
    scope.submitFormContactGroups()
    scope.ngError.should.have.property('hasErrors', false)
    scope.contactGroup.$update.should.have.been.called()

    scope.contactGroup.should.have.property('group', 'Group 1')
    scope.contactGroup.should.have.property('users')
    scope.contactGroup.users.should.have.length(2)
  })
})
