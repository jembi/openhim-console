'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: AuditsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimConsoleApp'));

  // setup config constant to be used for API server details
  beforeEach(function(){
    module('openhimConsoleApp', function($provide){
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });
    });
  });

  var scope, createController, httpBackend, modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/audits-filter-options')).respond(
      {'eventType':[{ 'code': 'ITI-9', 'displayName': 'PIX Read', 'codeSystemName': 'IHE Transactions' }],
      'eventID':[{ 'code': '222', 'displayName': 'Read', 'codeSystemName': 'DCM' }],
      'activeParticipantRoleID':[{ 'code': '110152', 'displayName': 'Destination', 'codeSystemName': 'DCM' }],
      'participantObjectIDTypeCode':[{ 'code': '2', 'displayName': 'PatientNumber', 'codeSystemName': 'RFC-3881' }],
      'auditSourceID':['openhim']}
    );

    $httpBackend.when('GET', new RegExp('.*/audits')).respond([
      {
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
      }, {
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
      }
    ]);


    

    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      {'name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'txRerunAcl':['test'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}],'_id':'5322fe9d8b6add4b2b059dd8'},
      {'name':'Sample JsonStub Channel 2','urlPattern':'sample/api','allow':['PoC'],'txRerunAcl':['testing'],'routes':[{'host':'jsonstub.com','port':80}],'_id':'5322fe9d8b6add4b2b059aa3'}
    ]);

    modalSpy = sinon.spy($modal, 'open');

    createController = function() {
      scope = $rootScope.$new();
      return $controller('AuditsCtrl', { $scope: scope });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a list of transactions to the scope', function () {
    createController();
    httpBackend.flush();
    scope.audits.length.should.equal(2);
    scope.auditsFilterOptions.eventType.length.should.equal(1);
    scope.auditsFilterOptions.eventID.length.should.equal(1);
    scope.auditsFilterOptions.activeParticipantRoleID.length.should.equal(1);
    scope.auditsFilterOptions.participantObjectIDTypeCode.length.should.equal(1);
    scope.auditsFilterOptions.auditSourceID.length.should.equal(1);
  });

  it('should check that the user prefered filters are set', function () {
    createController();
    httpBackend.flush();

    // the consoleSession object is setup with user profile in 'login.js'
    scope.settings.filter.limit.should.equal(10);
    scope.settings.list.tabview.should.equal('new');
  });

});