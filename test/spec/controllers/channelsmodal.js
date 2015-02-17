'use strict';
/* global sinon:false */
/* jshint expr: true */

describe('Controller: ChannelsmodalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('config/default.json')).respond({ 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });

    $httpBackend.when('GET', new RegExp('.*/clients')).respond([
      {clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test', 'testing2'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'},
      {clientID: 'test2', clientDomain: 'test2.openhim.org', name: 'Test 2', roles: ['test', 'testing again'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'}
    ]);

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { 'firstname': 'Super', 'surname': 'User', 'email': 'super@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['admin'] },
      { 'firstname': 'Ordinary', 'surname': 'User', 'email': 'normal@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['limited'] }
    ]);

    $httpBackend.when('GET', new RegExp('.*/groups')).respond([
      { 'group': 'Group 1', 'users': [ {'user': 'User 1', 'method': 'sms', 'maxAlerts': 'no max'}, {'user': 'User 2', 'method': 'email', 'maxAlerts': '1 per day'}, {'user': 'User 3', 'method': 'email', 'maxAlerts': '1 per hour'} ] },
      { 'group': 'Group 2', 'users': [ {'user': 'User 4', 'method': 'email', 'maxAlerts': 'no max'} ] },
    ]);

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

    $httpBackend.when('GET', new RegExp('.*/keystore/ca')).respond([
      { 'country': 'US', 'state': 'Missouri', 'locality': 'St. Louis', 'organization': 'Mallinckrodt Institute of Radiology', 'organizationUnit': 'Electronic Radiology Lab', 'commonName': 'MIR2014-16', 'emailAddress': 'moultonr@mir.wustl.edu', 'data': '-----FAKE CERTIFICATE DATA-----', '_id': '54e1ca5afa069b5a7b938c4f', 'validity': { 'start': '2014-10-09T13:15:28.000Z', 'end': '2016-11-29T13:15:28.000Z' }},
      { 'country': 'ZA', 'state': 'KZN', 'locality': 'Durban', 'organization': 'Jembi Health Systems NPC', 'organizationUnit': 'eHealth', 'commonName': 'openhim', 'emailAddress': 'ryan@jembi.org', 'data': '-----FAKE CERTIFICATE DATA-----', '_id': '54e1ca5afa069b5a7b938c50', 'validity': { 'start': '2014-11-25T12:52:21.000Z', 'end': '2016-10-30T12:52:21.000Z' }}
    ]);

    scope = $rootScope.$new();
    var modalInstance = sinon.spy();


    createController = function () {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        channel: null
      });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should create a new channel if this is not an update', function () {
    createController();
    httpBackend.flush();

    scope.channel.should.be.ok;
  });

  it('should add a new route to the channel', function () {
    createController(true);
    httpBackend.flush();

    scope.channel.routes = [];
    scope.channel.routes.should.have.length(0);

    scope.addRoute();
    scope.channel.routes.should.have.length(1);
    scope.channel.routes[0].should.have.property('name', '');
    scope.channel.routes[0].should.have.property('path', '');
    scope.channel.routes[0].should.have.property('host', '');
    scope.channel.routes[0].should.have.property('port', '');

  });

  
  it('should add a new Mediator route to the channel (selected from dropdown)', function () {
    
    createController();
    httpBackend.flush();

    scope.channel.routes = [];
    scope.channel.routes.should.have.length(0);

    scope.mediator = {};
    // the seelcted mediator from the dropdown
    scope.mediator.route = { 'name': 'WC XD-LAB Mediator - WC XD-LAB Mediator',
                              'route': { 'host': 'localhost',
                                          'name': 'WC XD-LAB Mediator',
                                          'port': '8148',
                                          'type': 'http' } };

    // run function to populate newRoute with mediator route details
    scope.addRoute('mediator');

    scope.channel.routes[0].should.have.property('type', 'http');
    scope.channel.routes[0].should.have.property('secured', false);
    scope.channel.routes[0].should.have.property('name', 'WC XD-LAB Mediator');
    scope.channel.routes[0].should.have.property('host', 'localhost');
    scope.channel.routes[0].should.have.property('port', '8148');
    
  });


  it('should remove an existing route', function () {
    createController(true);
    httpBackend.flush();

    scope.channel.routes = [
      {
        name: 'Test Route 1',
        path: '/test/path',
        host: 'localhost',
        port: '9999'
      },
      {
        name: 'Test Route 2',
        path: '/test/path2',
        host: 'localhost',
        port: '9988'
      }
    ];

    scope.removeRoute(1);
    scope.channel.routes.should.have.length(1);
    scope.channel.routes[0].should.have.property('name', 'Test Route 1');
  });


  it('should run removeIncompleteRoutes() and remove all incomplete routes', function () {
    createController(true);
    httpBackend.flush();

    // start with 10 routes
    scope.channel.routes = [{ name: '', path: '/test/path', host: '', port: '' },
      { name: 'Test Route 2', path: '/test/path2', host: 'localhost', port: '2222' },
      { name: '', path: '/test/path3', host: 'localhost', port: '3333' },
      { name: 'Test Route 4', path: '/test/path4', host: 'localhost', port: '4444' },
      { name: 'Test Route 5', path: '/test/path5', host: 'localhost', port: '5555' },
      { name: 'Test Route 6', path: '/test/path6', host: '', port: '6666' },
      { name: 'Test Route 7', path: '/test/path7', host: 'localhost', port: '7777' },
      { name: 'Test Route 8', path: '/test/path7', host: 'localhost', port: '' },
      { name: 'Test Route 9', path: '/test/path7', host: '', port: '' },
      { name: 'Test Route 10', path: '/test/path7', host: 'localhost', port: '1010' }
    ];
    scope.channel.routes.should.have.length(10);

    scope.removeIncompleteRoutes();
    scope.channel.routes.should.have.length(5);

    scope.channel.routes[0].should.have.property('name', 'Test Route 2');
    scope.channel.routes[0].should.have.property('port', '2222');
    scope.channel.routes[1].should.have.property('name', 'Test Route 4');
    scope.channel.routes[1].should.have.property('port', '4444');
    scope.channel.routes[2].should.have.property('name', 'Test Route 5');
    scope.channel.routes[2].should.have.property('port', '5555');
    scope.channel.routes[3].should.have.property('name', 'Test Route 7');
    scope.channel.routes[3].should.have.property('port', '7777');
    scope.channel.routes[4].should.have.property('name', 'Test Route 10');
    scope.channel.routes[4].should.have.property('port', '1010');
  });


  it('should return true if there are multiple primary routes', function () {
    createController(true);
    httpBackend.flush();

    scope.channel.routes = [
      {
        name: 'Test Route 1',
        path: '/test/path',
        host: 'localhost',
        port: '9999',
        primary: true
      },
      {
        name: 'Test Route 2',
        path: '/test/path2',
        host: 'localhost',
        port: '9988'
      },
      {
        name: 'Test Route 3',
        path: '/test/path3',
        host: 'localhost',
        port: '9988',
        primary: true
      }
    ];
    scope.multiplePrimaries().should.be.true;
  });

  it('should return false if there is only one primary route', function () {
    createController(true);
    httpBackend.flush();

    scope.channel.routes = [
      {
        name: 'Test Route 1',
        path: '/test/path',
        host: 'localhost',
        port: '9999'
      },
      {
        name: 'Test Route 2',
        path: '/test/path2',
        host: 'localhost',
        port: '9988'
      },
      {
        name: 'Test Route 3',
        path: '/test/path3',
        host: 'localhost',
        port: '9988',
        primary: true
      }
    ];
    scope.multiplePrimaries().should.be.false;
  });



  it('should run validateFormChannels() for any validation errors - ngErrors.hasErrors -> TRUE', function () {
    createController();
    httpBackend.flush();

    scope.channel.name = '';
    scope.channel.urlPattern = '';
    scope.channel.allow = [];
    scope.matching.contentMatching = 'XML matching';
    scope.channel.matchContentXpath = '';
    scope.channel.matchContentValue = '';
    scope.channel.routes = [];


    // run the validate
    scope.validateFormChannels();
    scope.ngError.should.have.property('name', true);
    scope.ngError.should.have.property('urlPattern', true);
    scope.ngError.should.have.property('allow', true);
    scope.ngError.should.have.property('matchContentXpath', true);
    scope.ngError.should.have.property('matchContentXpath', true);
    scope.ngError.should.have.property('hasRouteWarnings', true);
  });

  it('should run validateFormChannels() for any validation errors - ngErrors.hasErrors -> FALSE', function () {
    createController();
    httpBackend.flush();

    scope.channel.name = 'ChannelName';
    scope.channel.urlPattern = 'sample/api';
    scope.channel.allow = ['allow1', 'allow2'];
    scope.matching.contentMatching = 'XML matching';
    scope.channel.matchContentXpath = 'XPath';
    scope.channel.matchContentValue = 'Value';
    scope.channel.routes = [{'name': 'testRoute', 'host': 'localhost', 'port': '80', 'path': '/sample/api', 'primary': true}];

    // run the validate
    scope.validateFormChannels();
    scope.ngError.should.have.property('hasErrors', false);
  });

  it('should run submitFormChannels() and check any validation errors - FALSE - should not save the record', function () {
    createController();
    httpBackend.flush();

    scope.channel.name = '';
    scope.channel.urlPattern = '';
    scope.channel.allow = [];
    scope.matching.contentMatching = 'XML matching';
    scope.channel.matchContentXpath = '';
    scope.channel.matchContentValue = '';
    scope.channel.routes = [];

    // run the submit
    scope.submitFormChannels();
    scope.ngError.should.have.property('name', true);
    scope.ngError.should.have.property('urlPattern', true);
    scope.ngError.should.have.property('allow', true);
    scope.ngError.should.have.property('matchContentXpath', true);
    scope.ngError.should.have.property('matchContentXpath', true);
    scope.ngError.should.have.property('hasRouteWarnings', true);
  });

  it('should run submitFormChannels() and check any validation errors - TRUE - Should save the record', function () {
    createController();
    httpBackend.flush();

    scope.channel.$save = sinon.spy();

    // update is false so create new channel
    scope.update = false;

    scope.channel.name = 'ChannelName';
    scope.channel.urlPattern = 'sample/api';
    scope.channel.allow = ['allow1', 'allow2'];
    scope.matching.contentMatching = 'XML matching';
    scope.channel.matchContentXpath = 'XPath';
    scope.channel.matchContentValue = 'Value';
    scope.channel.routes = [{'name': 'testRoute', 'host': 'localhost', 'port': '80', 'path': '/sample/api', 'primary': true}];
    // run the submit
    scope.submitFormChannels();
    scope.ngError.should.have.property('hasErrors', false);

    scope.channel.$save.should.be.called;
  });


  it('should run submitFormChannels() and add the regex delimiters to the URL Pattern', function () {
    createController();
    httpBackend.flush();

    scope.channel.$save = sinon.spy();

    // update is false so create new channel
    scope.update = false;

    scope.channel.name = 'ChannelName';
    scope.channel.urlPattern = 'sample/api';
    scope.urlPattern.regex = true;
    scope.channel.allow = ['allow1', 'allow2'];
    scope.matching.contentMatching = 'XML matching';
    scope.channel.matchContentXpath = 'XPath';
    scope.channel.matchContentValue = 'Value';
    scope.channel.routes = [{'name': 'testRoute', 'host': 'localhost', 'port': '80', 'path': '/sample/api', 'primary': true}];
    // run the submit
    scope.submitFormChannels();
    scope.ngError.should.have.property('hasErrors', false);
    scope.channel.should.have.property('urlPattern', '^sample/api$');
    scope.channel.$save.should.be.called;
  });


  it('should run submitFormChannels() and check any validation errors - TRUE - Should update the record', function () {
    createController();
    httpBackend.flush();

    scope.channel.$update = sinon.spy();

    // update is false so create new channel
    scope.update = true;

    scope.channel.name = 'ChannelName';
    scope.channel.urlPattern = 'sample/api';
    scope.urlPattern.regex = false;
    scope.channel.allow = ['allow1', 'allow2'];
    scope.matching.contentMatching = 'XML matching';
    scope.channel.matchContentXpath = 'XPath';
    scope.channel.matchContentValue = 'Value';
    scope.channel.routes = [{'name': 'testRoute', 'host': 'localhost', 'port': '80', 'path': '/sample/api', 'primary': true}];

    // run the submit
    scope.submitFormChannels();
    scope.ngError.should.have.property('hasErrors', false);
    scope.channel.$update.should.be.called;
    

    scope.channel.should.have.property('name', 'ChannelName');
    scope.channel.should.have.property('urlPattern', 'sample/api');
    scope.channel.should.have.property('matchContentXpath', 'XPath');
    scope.channel.should.have.property('matchContentValue', 'Value');
    scope.channel.allow.should.have.length(2);
    scope.channel.routes.should.have.length(1);
  });


  it('should create two taglist objects', function () {
    createController();
    httpBackend.flush();

    scope.taglistClientRoleOptions.should.have.length(5);
    scope.taglistUserRoleOptions.should.have.length(2);
    
    scope.taglistClientRoleOptions[0].should.equal('test1');
    scope.taglistClientRoleOptions[2].should.equal('testing2');
    scope.taglistClientRoleOptions[4].should.equal('testing again');

    scope.taglistUserRoleOptions[0].should.equal('admin');
    scope.taglistUserRoleOptions[1].should.equal('limited');
    
  });


});
