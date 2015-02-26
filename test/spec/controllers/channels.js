'use strict';
/* jshint expr: true */
/* global sinon: false */
/* global moment: false */

describe('Controller: ChannelsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend, modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('config/default.json')).respond({ 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });

    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      {'name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}],'_id':'5322fe9d8b6add4b2b059ff5'},
      {'name':'Sample JsonStub Channel 2','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80}],'_id':'5322fe9d8b6add4b2b059ff6'},
      {'name':'Sample JsonStub Channel 3','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80}],'_id':'5322fe9d8b6add4b33333333','status':'deleted'}
    ]);

    $httpBackend.when('GET', new RegExp('.*/clients')).respond([
      {clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'},
      {clientID: 'test2', clientDomain: 'test2.openhim.org', name: 'Test 2', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'}
    ]);

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { 'firstname': 'Super', 'surname': 'User', 'email': 'super@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['admin'] },
      { 'firstname': 'Ordinary', 'surname': 'User', 'email': 'normal@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['limited'] }
    ]);

    $httpBackend.when('GET', new RegExp('.*/groups')).respond([
      { 'group': 'Group 1', 'users': [ {'user': 'User 1', 'method': 'sms', 'maxAlerts': 'no max'}, {'user': 'User 2', 'method': 'email', 'maxAlerts': '1 per day'}, {'user': 'User 3', 'method': 'email', 'maxAlerts': '1 per hour'} ] },
      { 'group': 'Group 2', 'users': [ {'user': 'User 4', 'method': 'email', 'maxAlerts': 'no max'} ] },
    ]);

    $httpBackend.when('GET', new RegExp('.*/mediators')).respond([
      {
        'urn': 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE',
        'version': '0.0.1',
        'name': 'Test 1 Mediator',
        'description': 'Test 1 Description',
        'defaultChannelConfig': [
          {
            'name': 'Mediator Channel 1',
            'urlPattern': '/channel1',
            'routes': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }],
            'allow': [ 'xdlab' ],
            'type': 'http'
          }
        ],
        'endpoints': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }]
      },
      {
        'urn': 'EEEEEEEE-DDDD-CCCC-BBBB-AAAAAAAAAAAA',
        'version': '0.1.2',
        'name': 'Test 2 Mediator',
        'description': 'Test 2 Description',
        'defaultChannelConfig': [
          {
            'name': 'Mediator Channel 2',
            'urlPattern': '/channnel2',
            'routes': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }],
            'allow': [ 'xdlab' ],
            'type': 'http'
          }
        ],
        'endpoints': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }, { 'name': 'Route 2', 'host': 'localhost2', 'port': '3333', 'primary': false, 'type': 'http' }]
      }
    ]);

    $httpBackend.when('GET', new RegExp('.*/keystore/ca')).respond([
      { 'country': 'US', 'state': 'Missouri', 'locality': 'St. Louis', 'organization': 'Mallinckrodt Institute of Radiology', 'organizationUnit': 'Electronic Radiology Lab', 'commonName': 'MIR2014-16', 'emailAddress': 'moultonr@mir.wustl.edu', 'data': '-----FAKE CERTIFICATE DATA-----', '_id': '54e1ca5afa069b5a7b938c4f', 'validity': { 'start': '2014-10-09T13:15:28.000Z', 'end': '2016-11-29T13:15:28.000Z' }},
      { 'country': 'ZA', 'state': 'KZN', 'locality': 'Durban', 'organization': 'Jembi Health Systems NPC', 'organizationUnit': 'eHealth', 'commonName': 'openhim', 'emailAddress': 'ryan@jembi.org', 'data': '-----FAKE CERTIFICATE DATA-----', '_id': '54e1ca5afa069b5a7b938c50', 'validity': { 'start': '2014-11-25T12:52:21.000Z', 'end': '2016-10-30T12:52:21.000Z' }}
    ]);

    var timeLoadData = [{ 'load': 34, 'avgResp': 2881.91, 'timestamp': moment().subtract(6, 'd').format('YYYY-MM-DD') },
                        { 'load': 73, 'avgResp': 1313.57, 'timestamp': moment().subtract(5, 'd').format('YYYY-MM-DD') },
                        { 'load': 17, 'avgResp': 3761.57, 'timestamp': moment().subtract(4, 'd').format('YYYY-MM-DD') },
                        { 'load': 72, 'avgResp': 3545.57, 'timestamp': moment().subtract(3, 'd').format('YYYY-MM-DD') },
                        { 'load': 45, 'avgResp': 1233.57, 'timestamp': moment().subtract(2, 'd').format('YYYY-MM-DD') },
                        { 'load': 47, 'avgResp': 4564.57, 'timestamp': moment().subtract(1, 'd').format('YYYY-MM-DD') },
                        { 'load': 4, 'avgResp': 3553.34, 'timestamp': moment().format('YYYY-MM-DD') }];
    $httpBackend.when('GET', new RegExp('.*/metrics/day/.*.')).respond( timeLoadData );

    modalSpy = sinon.spy($modal, 'open');

    createController = function() {
      scope = $rootScope.$new();
      return $controller('ChannelsCtrl', { $scope: scope });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a list of channels to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/channels'));
    createController();
    httpBackend.flush();
    scope.channels.length.should.equal(3);
  });

  it('should open a modal to confirm deletion of a channel', function () {
    createController();
    httpBackend.flush();

    httpBackend.expectGET('views/confirmModal.html').respond(200, '');
    scope.confirmDelete(scope.channels[0]);
    modalSpy.should.be.calledOnce;
    httpBackend.flush();
  });

  it('should open a modal to confirm restoration of a deleted channel', function () {
    createController();
    httpBackend.flush();

    httpBackend.expectGET('views/confirmModal.html').respond(200, '');
    scope.confirmRestore(scope.channels[2]);
    modalSpy.should.be.calledOnce;
    httpBackend.flush();
  });

  it('should open a modal to add a channel', function () {
    createController();
    scope.addChannel();

    modalSpy.should.be.calledOnce;
    httpBackend.flush();
  });

  it('should open a modal to edit a channel', function () {
    createController();
    scope.editChannel();

    modalSpy.should.be.calledOnce;
    httpBackend.flush();
  });
});
