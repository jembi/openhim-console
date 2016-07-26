'use strict';
/* jshint expr: true */

describe('Controller: VisualizerCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimConsoleApp'));

  // setup config constant to be used for API server details
  beforeEach(function(){
    module('openhimConsoleApp', function($provide){
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });
    });
  });

  var scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/users/.*')).respond({
        'firstname': 'Super',
        'surname': 'User',
        'email': 'super@openhim.org',
        'passwordAlgorithm': 'sample/api',
        'passwordHash': '539aa778930879b01b37ff62',
        'passwordSalt': '79b01b37ff62',
        'groups': ['admin'],
        'settings': {
          'visualizer': {
            'components': [
              {
                'eventType': 'primary',
                'eventName': 'OpenHIM Mediator FHIR Proxy Route',
                'display': 'FHIR Server'
              },
              {
                'eventType': 'primary',
                'eventName': 'echo',
                'display': 'Echo'
              }
            ],
            'color': {
              'inactive': '#c8cacf',
              'active': '#10e057',
              'error': '#a84b5c',
              'text': '#4a4254'
            },
            'size': {
              'responsive': true,
              'width': 1000,
              'height': 400,
              'padding': 20
            },
            'time': {
              'updatePeriod': 200,
              'maxSpeed': 5,
              'maxTimeout': 5000,
              'minDisplayPeriod': 500
            },
            'channels': [
              {
                'eventType': 'channel',
                'eventName': 'FHIR Proxy',
                'display': 'FHIR Proxy'
              },
              {
                'eventType': 'channel',
                'eventName': 'Echo',
                'display': 'Echo'
              }
            ],
            'mediators': [
              {
                'mediator': 'urn:mediator:fhir-proxy',
                'name': 'OpenHIM Mediator FHIR Proxy',
                'display': 'OpenHIM Mediator FHIR Proxy'
              },
              {
                'mediator': 'urn:mediator:shell-script',
                'name': 'OpenHIM Shell Script Mediator',
                'display': 'OpenHIM Shell Script Mediator'
              }
            ]
          }
        }
    });

    $httpBackend.when('GET', new RegExp('.*/heartbeat')).respond({ 'now': Date.now() });

    createController = function() {
      scope = $rootScope.$new();
      return $controller('VisualizerCtrl', { $scope: scope });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should add visualizer settings to the scope', function () {
    createController();
    httpBackend.flush();

    expect(scope.visualizerSettings).to.deep.equal({
      'components': [
        {
          'eventType': 'primary',
          'eventName': 'OpenHIM Mediator FHIR Proxy Route',
          'display': 'FHIR Server'
        },
        {
          'eventType': 'primary',
          'eventName': 'echo',
          'display': 'Echo'
        }
      ],
      'channels': [
        {
          'eventType': 'channel',
          'eventName': 'FHIR Proxy',
          'display': 'FHIR Proxy'
        },
        {
          'eventType': 'channel',
          'eventName': 'Echo',
          'display': 'Echo'
        }
      ],
      'mediators': [
        {
          'mediator': 'urn:mediator:fhir-proxy',
          'name': 'OpenHIM Mediator FHIR Proxy',
          'display': 'OpenHIM Mediator FHIR Proxy'
        },
        {
          'mediator': 'urn:mediator:shell-script',
          'name': 'OpenHIM Shell Script Mediator',
          'display': 'OpenHIM Shell Script Mediator'
        }
      ],
      'visResponsive': true,
      'visW': 1000,
      'visH': 400,
      'pad': 20,
      'inactiveColor': '#c8cacf',
      'activeColor': '#10e057',
      'errorColor': '#a84b5c',
      'textColor': '#4a4254',
      'updatePeriod': 200,
      'minDisplayPeriod': 500,
      'speed': 0,
      'maxSpeed': 5,
      'maxTimeout': 5000
    });
  });

});
