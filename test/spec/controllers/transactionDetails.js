'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: TransactionDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend, modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/transactions/538ed0867962a27d5df259b0')).respond({'name':'Transaction 1','urlPattern':'sample/api','_id':'5322fe9d8b6add4b2b059ff5'});

    modalSpy = sinon.spy($modal, 'open');

    createController = function() {
      scope = $rootScope.$new();
      return $controller('TransactionDetailsCtrl', { $scope: scope });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a list of transactions to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/transactions/538ed0867962a27d5df259b0'));
    createController();
    httpBackend.flush();
    //scope.transactionDetails.length.should.equal(1);
    console.log(scope.transactions);
  });

});