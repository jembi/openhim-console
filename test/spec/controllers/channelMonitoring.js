'use strict';
/* jshint expr: true */
/* global sinon: false */

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
      return $controller('TransactionDetailsCtrl', { $scope: scope, $routeParams: { transactionId: '538ed0867962a27d5df259b0' } });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a single transaction to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/transactions/538ed0867962a27d5df259b0'));
    httpBackend.expectGET(new RegExp('.*/channels/5322fe9d8b6add4b2b059dd8'));
    httpBackend.expectGET(new RegExp('.*/clients/5344fe7d8b6add4b2b069dd7'));
    createController();
    httpBackend.flush();
    scope.transactionDetails.name.should.equal('Transaction 1');
    scope.childTransactions.length.should.equal(1);
  });

  it('should attach a single channel object to the scope', function () {
    //httpBackend.expectGET(new RegExp('.*/transactions/538ed0867962a27d5df259b0'));
    //httpBackend.expectGET(new RegExp('.*/channels/5322fe9d8b6add4b2b059dd8'));
    //httpBackend.expectGET(new RegExp('.*/clients/5344fe7d8b6add4b2b069dd7'));
    /*createController();
    httpBackend.flush();

    scope.channel.name.should.equal('Sample JsonStub Channel 1');
    scope.channel.urlPattern.should.equal('sample/api');
    scope.channel.routes.length.should.equal(1);*/
  });

  it('should attach a single client to the scope', function () {
    //httpBackend.expectGET(new RegExp('.*/transactions/538ed0867962a27d5df259b0'));
    //httpBackend.expectGET(new RegExp('.*/channels/5322fe9d8b6add4b2b059dd8'));
    //httpBackend.expectGET(new RegExp('.*/clients/5344fe7d8b6add4b2b069dd7'));
    /*createController();
    httpBackend.flush();

    scope.client.name.should.equal('Test 1');
    scope.client.clientID.should.equal('test1');
    scope.client.clientDomain.should.equal('test1.openhim.org');
    scope.client.roles.length.should.equal(1);*/
  });

});