'use strict';
/* global sinon:false */
/* jshint expr: true */

describe('Controller: ChannelsModalCtrl', function () {
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
          { 'name': 'Mediator Channel 1', 'urlPattern': '/channel1', 'routes': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }], 'allow': [ 'xdlab' ], 'type': 'http' }
        ],
        'endpoints': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }]
      }, {
        'urn': 'EEEEEEEE-DDDD-CCCC-BBBB-AAAAAAAAAAAA',
        'version': '0.1.2',
        'name': 'Test 2 Mediator',
        'description': 'Test 2 Description',
        'defaultChannelConfig': [
          { 'name': 'Mediator Channel 2', 'urlPattern': '/channnel2', 'routes': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }], 'allow': [ 'xdlab' ], 'type': 'http' }
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

});














describe('Controller: channelBasicInfoCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'));
  var scope, createController, createControllerParent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    var modalInstance = sinon.spy();
    createControllerParent = function () {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        channel: null
      });
    };
    createController = function () {
      return $controller('channelBasicInfoCtrl', {
        $scope: scope
      });
    };

  }));

  it('should create a new channel if this is not an update', function () {
    createControllerParent();
    createController();
    scope.channel.should.be.ok;
  });
});


describe('Controller: channelAccessControlCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'));
  var scope, createController, createControllerParent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    var modalInstance = sinon.spy();
    createControllerParent = function () {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        channel: null
      });
    };
    createController = function () {
      return $controller('channelAccessControlCtrl', {
        $scope: scope
      });
    };
  }));

  it('should create a new channel if this is not an update', function () {
    createControllerParent();
    createController();
    scope.channel.should.be.ok;
  });
});


describe('Controller: channelContentMatchingCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'));
  var scope, createController, createControllerParent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    var modalInstance = sinon.spy();
    createControllerParent = function () {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        channel: null
      });
    };
    createController = function () {
      return $controller('channelContentMatchingCtrl', {
        $scope: scope
      });
    };
  }));

  it('should create a new channel if this is not an update', function () {
    createControllerParent();
    createController();
    scope.channel.should.be.ok;
  });
});


describe('Controller: channelRoutesCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'));
  var scope, createController, createControllerParent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    var modalInstance = sinon.spy();
    createControllerParent = function () {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        channel: null
      });
    };
    createController = function () {
      return $controller('channelRoutesCtrl', {
        $scope: scope
      });
    };
  }));

  it('should create a new channel if this is not an update', function () {
    createControllerParent();
    createController();
    scope.channel.should.be.ok;
  });
});


describe('Controller: channelAlersCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'));
  var scope, createController, createControllerParent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    var modalInstance = sinon.spy();
    createControllerParent = function () {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        channel: null
      });
    };
    createController = function () {
      return $controller('channelAlersCtrl', {
        $scope: scope
      });
    };
  }));

  it('should create a new channel if this is not an update', function () {
    createControllerParent();
    createController();
    scope.channel.should.be.ok;
  });
});


describe('Controller: channelSettingsCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'));
  var scope, createController, createControllerParent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    var modalInstance = sinon.spy();
    createControllerParent = function () {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        channel: null
      });
    };
    createController = function () {
      return $controller('channelSettingsCtrl', {
        $scope: scope
      });
    };
  }));

  it('should create a new channel if this is not an update', function () {
    createControllerParent();
    createController();
    scope.channel.should.be.ok;
  });
});

















  



