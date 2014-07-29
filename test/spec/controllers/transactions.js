'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: TransactionsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend, modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/transactions')).respond([
      {'name':'Transaction 1','urlPattern':'sample/api','_id':'5322fe9d8b6add4b2b059ff5'},
      {'name':'Transaction 2','urlPattern':'sample/api','_id':'5322fe9d8b6add4b2b059ff6'}
    ]);

    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      {'name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}],'_id':'5322fe9d8b6add4b2b059dd8'},
      {'name':'Sample JsonStub Channel 2','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80}],'_id':'5322fe9d8b6add4b2b059aa3'}
    ]);

    modalSpy = sinon.spy($modal, 'open');

    createController = function() {
      scope = $rootScope.$new();
      return $controller('TransactionsCtrl', { $scope: scope });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a list of transactions to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/transactions'));
    createController();
    httpBackend.flush();
    scope.transactions.length.should.equal(2);
    scope.channels.length.should.equal(2);
    scope.channels[0].should.have.property('name', 'Sample JsonStub Channel 1');
    scope.channels[1].should.have.property('name', 'Sample JsonStub Channel 2');
    scope.channelsMap.length.should.equal(2);
    scope.channelsMap.should.have.property('5322fe9d8b6add4b2b059dd8');
    scope.channelsMap.should.have.property('5322fe9d8b6add4b2b059aa3');
  });

});