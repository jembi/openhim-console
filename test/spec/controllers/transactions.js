'use strict';
/* jshint expr: true */
/* global sinon: false */
/* global moment:false */

describe('Controller: TransactionsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimConsoleApp'));

  // setup config constant to be used for API server details
  beforeEach(function(){
    module('openhimConsoleApp', function($provide){
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });
    });
  });

  var scope, createController, httpBackend, modalSpy, timeout;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal, $timeout) {

    httpBackend = $httpBackend;
    timeout = $timeout;

    
    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      {'_id':'5322fe9d8b6add4b2b059dd8','status': 'enabled','name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'txRerunAcl':['test'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}]},
      {'_id':'5322fe9d8b6add4b2b059aa3','status': 'deleted','name':'Sample JsonStub Channel 2','urlPattern':'sample/api','allow':['PoC'],'txRerunAcl':['testing'],'routes':[{'host':'jsonstub.com','port':80}]}
    ]);

    $httpBackend.when('GET', new RegExp('.*/clients')).respond([
      {clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'},
      {clientID: 'test2', clientDomain: 'test2.openhim.org', name: 'Test 2', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'}
    ]);


    

    $httpBackend.when('GET', new RegExp('.*/transactions\\?(filterLimit|filterPage)')).respond([
      {
        '_id' : '550936d307756ef72b525111',
        'status' : 'Successful',
        'clientID' : '5506aed5348ac60d23840a9e',
        'channelID' : '550933dbbc9814c82b12fd16',
        'request' : { 'path' : '/path/successful', 'headers' : { }, 'querystring' : 'test=testing', 'body' : 'Successful', 'method' : 'GET', 'timestamp' : '2015-03-18T08:26:59.417Z' },
        'response' : { 'timestamp' : '2015-03-18T08:26:59.430Z', 'body' : 'Body', 'headers' : {  }, 'status' : 200 }
      }, {
        '_id' : '660936d307756ef72b525222',
        'status' : 'Successful',
        'clientID' : '5506aed5348ac60d23840a9e',
        'channelID' : '550933dbbc9814c82b12fd16',
        'request' : { 'path' : '/path/successful/successful', 'headers' : { }, 'querystring' : '', 'body' : 'Successful Successful', 'method' : 'GET', 'timestamp' : '2015-03-18T08:26:59.417Z' },
        'response' : { 'timestamp' : '2015-03-18T08:26:59.430Z', 'body' : 'Body', 'headers' : {  }, 'status' : 200 }
      }, {
        '_id' : '770936d307756ef72b525333',
        'status' : 'Processing',
        'clientID' : '5506aed5348ac60d23840a9e',
        'channelID' : '550933dbbc9814c82b12fd16',
        'request' : { 'path' : '/path/failed', 'headers' : { }, 'querystring' : 'test=world', 'body' : 'Failed', 'method' : 'GET', 'timestamp' : '2015-03-18T08:26:59.417Z' },
      }, {
        '_id' : '880936d307756ef72b525444',
        'status' : 'Failed',
        'clientID' : '5506aed5348ac60d23840a9e',
        'channelID' : '550933dbbc9814c82b12fd16',
        'request' : { 'path' : '/path/failed', 'headers' : { }, 'querystring' : '', 'body' : 'Failed', 'method' : 'GET', 'timestamp' : '2015-03-18T08:26:59.417Z' },
        'response' : { 'timestamp' : '2015-03-18T08:26:59.430Z', 'body' : 'Body', 'headers' : {  }, 'status' : 500 }
      }
    ]);

    $httpBackend.when('GET', new RegExp('.*/visualizer/sync')).respond({ 'now': Date.now() });


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
    scope.transactions.length.should.equal(4);
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
    scope.channelsMap['5322fe9d8b6add4b2b059dd8'].should.have.property('rerun', true);
    scope.channelsMap['5322fe9d8b6add4b2b059aa3'].should.have.property('rerun', false);
    scope.should.have.property('rerunAllowedAdmin', true);
  });

  it('should check that the user prefered filters are set', function () {
    createController();
    httpBackend.flush();

    // the consoleSession object is setup with user profile in 'login.js'
    scope.settings.filter.limit.should.equal('200');
    scope.filters.transaction.status.should.equal('Successful');
    scope.filters.transaction.channel.should.equal('5322fe9d8b6add4b2b059dd8');
    scope.settings.list.tabview.should.equal('new');
  });

  it('should check filters are sent to the API', function () {
    createController();
    httpBackend.flush();

    var startDate = '2015-03-09T00:00:00+00:00';
    var endDate = '2015-03-09T00:00:00+00:00';

    scope.settings.filter.startDate = moment(startDate).format();
    scope.settings.filter.endDate = moment(endDate).format();

    // search for transaction filters
    scope.filters.transaction.status = 'Successful';
    scope.filters.transaction.channel = '5322fe9d8b6add4b2b059dd8';
    scope.filters.transaction.statusCode = '2xx';
    scope.filters.transaction.path = '/path';
    scope.filters.transaction.wasRerun = 'yes';
    scope.filters.route.statusCode = '2xx';
    scope.filters.orchestration.statusCode = '2xx';

    var filters = scope.returnFilters();

    // filter object that gets sent through the API for query filtering
    filters.filters['request.timestamp'].should.equal('{"$gte":"'+moment(startDate).format()+'","$lte":"'+moment(endDate).endOf('day').format()+'"}');
    filters.filters.status.should.equal('Successful');
    filters.filters.channelID.should.equal('5322fe9d8b6add4b2b059dd8');
    filters.filters['response.status'].should.equal('2xx');
    filters.filters['request.path'].should.equal('/path');
    filters.filters['childIDs.0'].should.equal('{"$exists":true}');
    filters.filters['routes.response.status'].should.equal('2xx');
    filters.filters['orchestrations.response.status'].should.equal('2xx');

  });

  it('should prepend new transactions to the scope', function () {
    createController();
    httpBackend.flush();

    var originalLength = scope.transactions.length;

    httpBackend.when('GET', new RegExp('.*/transactions')).respond([
      {
        '_id' : '550936d307756ef72b525555',
        'status' : 'Successful',
        'clientID' : '5506aed5348ac60d23840a9e',
        'channelID' : '550933dbbc9814c82b12fd16',
        'request' : { 'path' : '/path/successful', 'headers' : { }, 'querystring' : 'test=testing', 'body' : 'Successful', 'method' : 'GET', 'timestamp' : '2015-07-15T15:26:59.417Z' },
        'response' : { 'timestamp' : '2015-07-15T15:26:59.430Z', 'body' : 'Body', 'headers' : {  }, 'status' : 200 }
      }
    ]);

    scope.pollForLatest();
    httpBackend.flush();
    timeout.flush();

    scope.transactions.length.should.equal(originalLength + 1);
    scope.transactions[0]._id.should.equal('550936d307756ef72b525555');
  });

  it('should update "Processing" transactions', function () {
    createController();
    httpBackend.flush();

    //did it load correctly...
    scope.transactions[2]._id.should.equal('770936d307756ef72b525333');
    scope.transactions[2].status.should.equal('Processing');

    httpBackend.when('GET', new RegExp('.*/transactions/770936d307756ef72b525333')).respond(
      {
        '_id' : '770936d307756ef72b525333',
        'status' : 'Failed',
        'clientID' : '5506aed5348ac60d23840a9e',
        'channelID' : '550933dbbc9814c82b12fd16',
        'request' : { 'path' : '/path/failed', 'headers' : { }, 'querystring' : 'test=world', 'body' : 'Failed', 'method' : 'GET', 'timestamp' : '2015-03-18T08:26:59.417Z' },
        'response' : { 'timestamp' : '2015-03-18T08:26:59.430Z', 'body' : 'Body', 'headers' : {  }, 'status' : 500 }
      }
    );

    scope.pollForProcessingUpdates();
    httpBackend.flush();
    timeout.flush();

    //only status should change, position in array must be the same
    scope.transactions[2]._id.should.equal('770936d307756ef72b525333');
    scope.transactions[2].status.should.equal('Failed');
  });

});
