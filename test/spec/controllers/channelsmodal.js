'use strict';
/* global sinon:false */
/* jshint expr: true */

describe('Controller: ChannelsmodalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    var modalInstance = sinon.spy();

    createController = function () {
      var channel;
      channel = {
        $save: sinon.spy(),
        $update: sinon.spy()
      };
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        channel: channel
      });
    };
  }));

  it('should create a new channel if this is not an update', function () {
    createController();
    scope.channel.should.be.ok;
  });

  it('should add a new route to the channel', function () {
    createController(true);
    var newRoute = {
      name: 'Test route',
      path: '/test/path',
      host: 'localhost',
      port: '9999'
    };
    scope.newRoute = newRoute;
    scope.addRoute(newRoute);
    scope.channel.routes.should.have.length(1);
    scope.channel.routes[0].should.have.property('name', 'Test route');
    scope.channel.routes[0].should.have.property('path', '/test/path');
    scope.channel.routes[0].should.have.property('host', 'localhost');
    scope.channel.routes[0].should.have.property('port', '9999');
    // ensure new route is reset
    scope.newRoute.should.have.property('name', null);
    scope.newRoute.should.have.property('path', null);
    scope.newRoute.should.have.property('host', null);
    scope.newRoute.should.have.property('port', null);
  });

  it('should edit an existing route', function () {
    createController(true);
    var routeToEdit = {
        name: 'Test Route 2',
        path: '/test/path2',
        host: 'localhost',
        port: '9988'
      };
    scope.channel.routes = [
      {
        name: 'Test Route 1',
        path: '/test/path',
        host: 'localhost',
        port: '9999'
      },
      routeToEdit
    ];

    scope.editRoute(1, routeToEdit);
    scope.channel.routes.should.have.length(1);
    scope.channel.routes[0].should.have.property('name', 'Test Route 1');
    scope.newRoute.should.eql(routeToEdit);
  });

  it('should remove an existing route', function () {
    createController(true);
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

  it('should return true if there are multiple primary routes', function () {
    createController(true);
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

  it('should run submitFormChannels() and check any validation errors - TRUE - Should update the record', function () {
    createController();

    // update is false so create new channel
    scope.update = true;

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
    scope.channel.$update.should.be.called;
    

    scope.channel.should.have.property('name', 'ChannelName');
    scope.channel.should.have.property('urlPattern', 'sample/api');
    scope.channel.should.have.property('matchContentXpath', 'XPath');
    scope.channel.should.have.property('matchContentValue', 'Value');
    scope.channel.allow.should.have.length(2);
    scope.channel.routes.should.have.length(1);
  });






});
