'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: MediatorsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimConsoleApp'));

  // setup config constant to be used for API server details
  beforeEach(function(){
    module('openhimConsoleApp', function($provide){
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });
    });
  });

  var scope, createController, httpBackend, modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/mediators')).respond([
      {
        'urn': 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE',
        'version': '0.0.1',
        'name': 'Test 1 Mediator',
        'description': 'Test 1 Description',
        'defaultChannelConfig': [
          {
            'name': 'Mediator Channel 1',
            'urlPattern': '/channel1',
            'routes': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }],
            'allow': [ 'xdlab' ],
            'type': 'http'
          }
        ],
        'endpoints': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }]
      },
      {
        'urn': 'EEEEEEEE-DDDD-CCCC-BBBB-AAAAAAAAAAAA',
        'version': '0.1.2',
        'name': 'Test 2 Mediator',
        'description': 'Test 2 Description',
        'defaultChannelConfig': [
          {
            'name': 'Mediator Channel 2',
            'urlPattern': '/channnel2',
            'routes': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }],
            'allow': [ 'xdlab' ],
            'type': 'http'
          }
        ],
        'endpoints': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }, { 'name': 'Route 2', 'host': 'localhost2', 'port': '3333', 'primary': false, 'type': 'http' }]
      }
    ]);

    modalSpy = sinon.spy($modal, 'open');

    createController = function() {
      scope = $rootScope.$new();
      return $controller('MediatorsCtrl', { $scope: scope });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a list of mediators to the scope', function () {
    createController();
    httpBackend.flush();
    scope.mediators.length.should.equal(2);

    scope.mediators[0].urn.should.equal('AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE');
    scope.mediators[0].name.should.equal('Test 1 Mediator');
    scope.mediators[0].description.should.equal('Test 1 Description');
    scope.mediators[0].version.should.equal('0.0.1');
    scope.mediators[0].endpoints.length.should.equal(1);

    scope.mediators[1].urn.should.equal('EEEEEEEE-DDDD-CCCC-BBBB-AAAAAAAAAAAA');
    scope.mediators[1].name.should.equal('Test 2 Mediator');
    scope.mediators[1].description.should.equal('Test 2 Description');
    scope.mediators[1].version.should.equal('0.1.2');
    scope.mediators[1].endpoints.length.should.equal(2);
  });

});