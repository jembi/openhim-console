'use strict'
/* jshint expr: true */
/* global sinon: false */

describe('Controller: AuditDetailsCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend, modalSpy // eslint-disable-line

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $uibModal) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/audits/538ed0867962a27d5df259b0')).respond({
      '_id': '538ed0867962a27d5df259b0',
      'rawMessage': 'This will be the raw ATNA message that gets received to be used as a backup reference',
      'eventIdentification': {
        'eventDateTime': '2015-02-17T15:38:25.282+02:00',
        'eventOutcomeIndicator': '0',
        'eventActionCode': 'R',
        'eventID': { 'code': '222', 'displayName': 'Read', 'codeSystemName': 'DCM' },
        'eventTypeCode': { 'code': 'ITI-9', 'displayName': 'PIX Read', 'codeSystemName': 'IHE Transactions' }
      },
      'activeParticipant': [
        {
          'userID': 'pix|pix',
          'alternativeUserID': '2100',
          'userIsRequestor': 'false',
          'networkAccessPointID': 'localhost',
          'networkAccessPointTypeCode': '1',
          'roleIDCode': { 'code': '110152', 'displayName': 'Destination', 'codeSystemName': 'DCM' }
        }
      ],
      'auditSourceIdentification': { 'auditSourceID': 'openhim' },
      'participantObjectIdentification': [
        {
          'participantObjectID': '975cac30-68e5-11e4-bf2a-04012ce65b02^^^ECID&amp;ECID&amp;ISO',
          'participantObjectTypeCode': '1',
          'participantObjectTypeCodeRole': '1',
          'participantObjectIDTypeCode': { 'code': '2', 'displayName': 'PatientNumber', 'codeSystemName': 'RFC-3881' }
        }
      ]
    })

    $httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({'_id': '539846c240f2eb682ffeca4b', 'email': 'test@user.org', 'firstname': 'test', 'surname': 'test', 'groups': ['admin', 'test', 'other']})

    modalSpy = sinon.spy($uibModal, 'open')

    createController = function () {
      scope = $rootScope.$new()
      return $controller('AuditDetailsCtrl', { $scope: scope, $routeParams: { auditId: '538ed0867962a27d5df259b0' } })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a single audit to the scope', function () {
    createController()
    httpBackend.flush()
    scope.auditDetails.eventIdentification.eventDateTime.should.equal('2015-02-17T15:38:25.282+02:00')
    scope.auditDetails.activeParticipant.length.should.equal(1)
    scope.auditDetails.activeParticipant[0].userID.should.equal('pix|pix')
    scope.auditDetails.auditSourceIdentification.auditSourceID.should.equal('openhim')
    scope.auditDetails.participantObjectIdentification.length.should.equal(1)
  })
})
