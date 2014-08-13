'use strict';
/* jshint expr: true */

describe('Controller: ChannelMonitoringCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/channels/5322fe9d8b6add4b2b059dd8')).respond({'_id':'5322fe9d8b6add4b2b059dd8', 'name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}]});
    $httpBackend.when('GET', new RegExp('.*/channels?.*parentID=.+')).respond([{'name':'Transaction 5','urlPattern':'sample/api','_id':'5322fe9d8b6add4b2b059dd8', 'parentID': '5322fe9d8b6add4b2b059ff5'}]);

    createController = function() {
      scope = $rootScope.$new();
      return $controller('ChannelMonitoringCtrl', { $scope: scope, $routeParams: { channelId: '5322fe9d8b6add4b2b059dd8' } });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a single channel to the scope', function () {
    //httpBackend.expectGET(new RegExp('.*/channels/5322fe9d8b6add4b2b059dd8'));
    //createController();
    //httpBackend.flush();

    //scope.channel.name.should.equal('Sample JsonStub Channel 1');
  });

});