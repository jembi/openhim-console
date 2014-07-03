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
      username: 'root@openhim.org',
      passwordSalt: 'password-salt',
      firstname: 'First Name',
      surname: 'surname'
    });

    $httpBackend.when('GET', new RegExp('.*/users/root@openhim.org')).respond({
      username: 'root@openhim.org',
      passwordSalt: 'password-salt',
      firstname: 'First Name',
      surname: 'surname'
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
//    httpBackend.verifyNoOutstandingExpectation();
//    httpBackend.verifyNoOutstandingRequest();
  });

  it("calls the original function", function () {
    var callback = sinon.spy();
    var proxy = (callback);

    proxy();

    assert(callback.called);
  });

  it('should update an a users profile', function () {
    createController();
    //scope.save();
    console.log('username: ' + scope.user.firstname)
   // scope.user.$update.should.be.called;
  });

});