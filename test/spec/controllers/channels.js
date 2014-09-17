'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: ChannelsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend, modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      {'name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}],'_id':'5322fe9d8b6add4b2b059ff5'},
      {'name':'Sample JsonStub Channel 2','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80}],'_id':'5322fe9d8b6add4b2b059ff6'}
    ]);

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { 'firstname': 'Super', 'surname': 'User', 'email': 'super@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['admin'] },
      { 'firstname': 'Ordinary', 'surname': 'User', 'email': 'normal@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['limited'] }
    ]);

    $httpBackend.when('GET', new RegExp('.*/groups')).respond([
      { 'group': 'Group 1', 'users': [ {'user': 'User 1', 'method': 'sms', 'maxAlerts': 'no max'}, {'user': 'User 2', 'method': 'email', 'maxAlerts': '1 per day'}, {'user': 'User 3', 'method': 'email', 'maxAlerts': '1 per hour'} ] },
      { 'group': 'Group 2', 'users': [ {'user': 'User 4', 'method': 'email', 'maxAlerts': 'no max'} ] },
    ]);

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
    scope.channels.length.should.equal(2);
  });

  it('should open a modal to confirm deletion of a channel', function () {
    createController();
    httpBackend.flush();

    httpBackend.expectGET('views/deleteConfirmModal.html').respond(200, '');
    scope.confirmDelete(scope.channels[0]);
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
