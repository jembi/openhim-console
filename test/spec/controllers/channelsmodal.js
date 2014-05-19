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

});
