'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: TransactionsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  // setup config constant to be used for API server details
  beforeEach(function(){
    module('openhimWebui2App', function($provide){
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });
    });
  });

  var scope, createController, httpBackend, modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/transactions')).respond([
      {'name':'Transaction 1','urlPattern':'sample/api','_id':'5322fe9d8b6add4b2b059ff5'},
      {'name':'Transaction 2','urlPattern':'sample/api','_id':'5322fe9d8b6add4b2b059ff6'}
    ]);

    $httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({'_id': '539846c240f2eb682ffeca4b', 'email': 'test@user.org', 'firstname': 'test', 'surname': 'test', 'groups': ['admin', 'test', 'other']});

    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      {'name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'txRerunAcl':['test'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}],'_id':'5322fe9d8b6add4b2b059dd8'},
      {'name':'Sample JsonStub Channel 2','urlPattern':'sample/api','allow':['PoC'],'txRerunAcl':['testing'],'routes':[{'host':'jsonstub.com','port':80}],'_id':'5322fe9d8b6add4b2b059aa3'}
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
    createController();
    httpBackend.flush();
    scope.transactions.length.should.equal(2);
  });

  it('should check rerun permissions for admin user', function () {
    createController();
    httpBackend.flush();

    scope.channels.length.should.equal(2);
    scope.channels[0].should.have.property('name', 'Sample JsonStub Channel 1');
    scope.channels[1].should.have.property('name', 'Sample JsonStub Channel 2');
    scope.channelsMap.should.have.property('5322fe9d8b6add4b2b059dd8');
    scope.channelsMap.should.have.property('5322fe9d8b6add4b2b059aa3');
    scope.channelsMap['5322fe9d8b6add4b2b059dd8'].should.have.property('name', 'Sample JsonStub Channel 1');
    scope.channelsMap['5322fe9d8b6add4b2b059aa3'].should.have.property('name', 'Sample JsonStub Channel 2');
    scope.channelsMap['5322fe9d8b6add4b2b059dd8'].should.not.have.property('rerun');
    scope.channelsMap['5322fe9d8b6add4b2b059aa3'].should.not.have.property('rerun');
    scope.should.have.property('rerunAllowedAdmin', true);
  });

  it('should check that the user prefered filters are set', function () {
    createController();
    httpBackend.flush();

    // the consoleSession object is setup with user profile in 'login.js'
    scope.settings.filter.limit.should.equal('200');
    scope.settings.filter.status.should.equal('Successful');
    scope.settings.filter.channel.should.equal('5322fe9d8b6add4b2b059dd8');
    scope.settings.list.tabview.should.equal('new');
  });

});