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

    var loadData = [{ 'load': 10, '_id': { 'year': moment().subtract(6, 'd').format('YYYY'), 'month': moment().subtract(6, 'd').format('MM'), 'day': moment().subtract(6, 'd').format('DD') } },
                    { 'load': 25, '_id': { 'year': moment().subtract(5, 'd').format('YYYY'), 'month': moment().subtract(5, 'd').format('MM'), 'day': moment().subtract(5, 'd').format('DD') } },
                    { 'load': 36, '_id': { 'year': moment().subtract(4, 'd').format('YYYY'), 'month': moment().subtract(4, 'd').format('MM'), 'day': moment().subtract(4, 'd').format('DD') } },
                    { 'load': 19, '_id': { 'year': moment().subtract(3, 'd').format('YYYY'), 'month': moment().subtract(3, 'd').format('MM'), 'day': moment().subtract(3, 'd').format('DD') } },
                    { 'load': 15, '_id': { 'year': moment().subtract(2, 'd').format('YYYY'), 'month': moment().subtract(2, 'd').format('MM'), 'day': moment().subtract(2, 'd').format('DD') } },
                    { 'load': 80, '_id': { 'year': moment().subtract(1, 'd').format('YYYY'), 'month': moment().subtract(1, 'd').format('MM'), 'day': moment().subtract(1, 'd').format('DD') } },
                    { 'load': 66, '_id': { 'year': moment().format('YYYY'), 'month': moment().format('MM'), 'day': moment().format('DD') } }]

    $httpBackend.when('GET', new RegExp('.*/channels/5322fe9d8b6add4b2b059dd8')).respond({'_id':'5322fe9d8b6add4b2b059dd8', 'name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}]});
    $httpBackend.when('GET', new RegExp('.*/metrics/day/5322fe9d8b6add4b2b059dd8?.*.')).respond( loadData );


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
    httpBackend.expectGET(new RegExp('.*/metrics/day/5322fe9d8b6add4b2b059dd8'));
    createController();
    httpBackend.flush();

    scope.channel.name.should.equal('Sample JsonStub Channel 1');
    scope.loadTotal.should.equal(251);
  });

});