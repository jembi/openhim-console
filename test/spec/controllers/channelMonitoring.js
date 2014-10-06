'use strict';
/* jshint expr: true */
/* global moment: false */

describe('Controller: ChannelMonitoringCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {

    httpBackend = $httpBackend;

    var statusData = [{ completed: 2, completedWErrors: 0, failed: 3, processing: 0, successful: 16 }];

    var timeLoadData = [{ 'load': 34, 'avgResp': 2881.91, 'timestamp': moment().subtract(6, 'd').format('YYYY-MM-DD') },
                        { 'load': 73, 'avgResp': 1313.57, 'timestamp': moment().subtract(5, 'd').format('YYYY-MM-DD') },
                        { 'load': 17, 'avgResp': 3761.57, 'timestamp': moment().subtract(4, 'd').format('YYYY-MM-DD') },
                        { 'load': 72, 'avgResp': 3545.57, 'timestamp': moment().subtract(3, 'd').format('YYYY-MM-DD') },
                        { 'load': 45, 'avgResp': 1233.57, 'timestamp': moment().subtract(2, 'd').format('YYYY-MM-DD') },
                        { 'load': 47, 'avgResp': 4564.57, 'timestamp': moment().subtract(1, 'd').format('YYYY-MM-DD') },
                        { 'load': 4, 'avgResp': 3553.34, 'timestamp': moment().format('YYYY-MM-DD') }];

    $httpBackend.when('GET', new RegExp('.*/channels/5322fe9d8b6add4b2b059dd8')).respond({'_id':'5322fe9d8b6add4b2b059dd8', 'name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}]});
    $httpBackend.when('GET', new RegExp('.*/metrics/status/5322fe9d8b6add4b2b059dd8?.*.')).respond( statusData );
    $httpBackend.when('GET', new RegExp('.*/metrics/day/5322fe9d8b6add4b2b059dd8?.*.')).respond( timeLoadData );


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
    httpBackend.expectGET(new RegExp('.*/channels/5322fe9d8b6add4b2b059dd8'));
    createController();
    httpBackend.flush();
    scope.channel.name.should.equal('Sample JsonStub Channel 1');
  });






  it('should run getStatusMetrics() and set the statusDonutData graph object', function () {
    createController();
    scope.getStatusMetrics();
    httpBackend.flush();

    scope.statusDonutData.should.have.property('data');
    scope.statusDonutData.data.length.should.equal(3);
    scope.statusDonutData.should.have.property('colors');
    scope.statusDonutData.colors.length.should.equal(3);
    scope.statusDonutData.data[0].should.have.property('label', 'Failed');
    scope.statusDonutData.data[0].should.have.property('value', '14.29');
    scope.statusDonutData.data[1].should.have.property('label', 'Completed');
    scope.statusDonutData.data[1].should.have.property('value', '9.52');
    scope.statusDonutData.data[2].should.have.property('label', 'Successful');
    scope.statusDonutData.data[2].should.have.property('value', '76.19');
    

    scope.statusBarData.should.have.property('data');
    scope.statusBarData.data.length.should.equal(3);
    scope.statusBarData.should.have.property('xkey', 'label');
    scope.statusBarData.should.have.property('ykeys');
    scope.statusBarData.ykeys[0].should.equal('value');
    scope.statusBarData.should.have.property('labels');
    scope.statusBarData.labels[0].should.equal('Total');
    scope.statusBarData.data[0].should.have.property('label', 'Failed');
    scope.statusBarData.data[0].should.have.property('value', 3);
    scope.statusBarData.data[1].should.have.property('label', 'Completed');
    scope.statusBarData.data[1].should.have.property('value', 2);
    scope.statusBarData.data[2].should.have.property('label', 'Successful');
    scope.statusBarData.data[2].should.have.property('value', 16);
    
    scope.channel.name.should.equal('Sample JsonStub Channel 1');
  });


  it('should run getLoadMetrics() and set the transactionLoadData graph object', function () {
    createController();
    scope.getLoadMetrics();
    httpBackend.flush();

    scope.transactionLoadData.should.have.property('data');
    scope.transactionLoadData.data.length.should.equal(7);
    scope.transactionLoadData.should.have.property('xkey', 'date');
    scope.transactionLoadData.should.have.property('ykeys');
    scope.transactionLoadData.ykeys[0].should.equal('value');
    scope.transactionLoadData.should.have.property('labels');
    scope.transactionLoadData.labels[0].should.equal('Load');
    scope.transactionLoadData.should.have.property('postunits', '');

    scope.transactionLoadData.data[0].should.have.property('date');
    scope.transactionLoadData.data[0].should.have.property('value', 34);
    scope.transactionLoadData.data[1].should.have.property('date');
    scope.transactionLoadData.data[1].should.have.property('value', 73);
    scope.transactionLoadData.data[2].should.have.property('date');
    scope.transactionLoadData.data[2].should.have.property('value', 17);
    scope.transactionLoadData.data[3].should.have.property('date');
    scope.transactionLoadData.data[3].should.have.property('value', 72);
    scope.transactionLoadData.data[4].should.have.property('date');
    scope.transactionLoadData.data[4].should.have.property('value', 45);
    scope.transactionLoadData.data[5].should.have.property('date');
    scope.transactionLoadData.data[5].should.have.property('value', 47);
    scope.transactionLoadData.data[6].should.have.property('date');
    scope.transactionLoadData.data[6].should.have.property('value', 4);

    
    scope.channel.name.should.equal('Sample JsonStub Channel 1');
  });

  it('should run getLoadMetrics() and set the transactionTimeData graph object', function () {
    httpBackend.expectGET(new RegExp('.*/metrics/status/5322fe9d8b6add4b2b059dd8'));
    createController();
    scope.getLoadMetrics();
    httpBackend.flush();

    scope.transactionTimeData.should.have.property('data');
    scope.transactionTimeData.data.length.should.equal(7);
    scope.transactionTimeData.should.have.property('xkey', 'date');
    scope.transactionTimeData.should.have.property('ykeys');
    scope.transactionTimeData.ykeys[0].should.equal('value');
    scope.transactionTimeData.should.have.property('labels');
    scope.transactionTimeData.labels[0].should.equal('Load');
    scope.transactionTimeData.should.have.property('postunits', ' ms');

    scope.transactionTimeData.data[0].should.have.property('date');
    scope.transactionTimeData.data[0].should.have.property('value', '2881.91');
    scope.transactionTimeData.data[1].should.have.property('date');
    scope.transactionTimeData.data[1].should.have.property('value', '1313.57');
    scope.transactionTimeData.data[2].should.have.property('date');
    scope.transactionTimeData.data[2].should.have.property('value', '3761.57');
    scope.transactionTimeData.data[3].should.have.property('date');
    scope.transactionTimeData.data[3].should.have.property('value', '3545.57');
    scope.transactionTimeData.data[4].should.have.property('date');
    scope.transactionTimeData.data[4].should.have.property('value', '1233.57');
    scope.transactionTimeData.data[5].should.have.property('date');
    scope.transactionTimeData.data[5].should.have.property('value', '4564.57');
    scope.transactionTimeData.data[6].should.have.property('date');
    scope.transactionTimeData.data[6].should.have.property('value', '3553.34');

    
    scope.channel.name.should.equal('Sample JsonStub Channel 1');
  });


});