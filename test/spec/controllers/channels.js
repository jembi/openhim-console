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

  it('should remove a channel', function () {
    createController();
    httpBackend.flush();

    httpBackend.expectDELETE(new RegExp('.*/channels/Sample%20JsonStub%20Channel%201')).respond(200, '');
    scope.removeChannel(scope.channels[0]);
    httpBackend.flush();
  });

  it('should open a modal to add a channel', function () {
    createController();

    scope.addChannel();

    modalSpy.should.be.calledWith({
        templateUrl: 'views/channelsmodal.html',
        controller: 'ChannelsModalCtrl'
      });

    httpBackend.flush();
  });
});
