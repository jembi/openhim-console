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

    createController = function (withChannel) {
      var channel;
      if (withChannel) {
        channel = {
          $save: sinon.spy(),
          $update: sinon.spy()
        };
      }
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

  it('should save a new channel', function () {
    createController();
    sinon.spy(scope.channel, '$save');
    scope.saveOrUpdate(scope.channel);
    scope.channel.$save.should.be.called;
  });

  it('should set a channel to be updated if one is supplied', function () {
    createController(true);
    scope.channel.should.be.ok;
  });

  it('should update an existing channel', function () {
    createController(true);
    scope.saveOrUpdate(scope.channel);
    scope.channel.$update.should.be.called;
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

});
