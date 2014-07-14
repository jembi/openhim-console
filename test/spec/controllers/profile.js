'use strict';
/* global sinon:false */
/* jshint expr: true */

describe('Controller: ProfileCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend,modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope,$httpBackend, $modal) {

    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/authenticate/test@openhim.org')).respond('false');
    $httpBackend.when('GET', new RegExp('.*/authenticate/root@openhim.org')).respond({
      username: 'test@user.org',
      passwordSalt: 'test-salt',
      firstname: 'test',
      surname: 'test'
    });

    $httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({
      '__v': 0,
      '_id': '539846c240f2eb682ffeca4b',
      'email': 'test@user.org',
      'firstname': 'test',
      'passwordAlgorithm': 'sha512',
      'passwordHash': '7d0d1a30d16f5343e3390fe9ef1dd61539a7f797267e0d2241ed22390dfc9743091244ddb2463df2f1adf6df3c355876ed34c6523f1e8d3b7f16f4b2afc8c160',
      'passwordSalt': 'test-salt',
      'surname': 'test',
      'groups': [
        'admin'
      ]
    });

    modalSpy = sinon.spy($modal, 'open');

    createController = function() {
      var user = {
        $save: sinon.spy(),
        $update: sinon.spy()
      };
      console.log('called create controller');
      return $controller('ProfileCtrl', {
        $scope: scope,
        user: user
      });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it("calls the original function", function () {
    var callback = sinon.spy();
    var proxy = (callback);

    proxy();

    assert(callback.called);
  });

  it('should update an a users profile', function () {
     console.log('here')
  });

});