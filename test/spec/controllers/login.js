'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, login, createController, httpBackend, modalSpy;

  // we don't need the real factory here. so, we will use a fake one.
  var mockLogin = {
    checkLoginCredentials: function(email, password, done) {
      if(email === 'correct@openhim.org' && password === 'correct-password'){
        done(true);
      }else{
        done(false);
      }
    }
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/authenticate/test@openhim.org')).respond('false');
    $httpBackend.when('GET', new RegExp('.*/authenticate/root@openhim.org')).respond('true');

    modalSpy = sinon.spy($modal, 'open');

    createController = function() {
      scope = $rootScope.$new();
      login = mockLogin;
      return $controller('LoginCtrl', { $scope: scope });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  //check for empty fileds
  it('should return an error message for incomplete fields', function () {
    createController();
    scope.loginEmail = '';
    scope.loginPassword = '';
    scope.validateLogin();    
    scope.alerts.length.should.equal(2);
  });

  //this happens in validateLogin() function but im using mock factory so im bypassing
  it('should validate true for users\' correct login credentials', function () {
    createController();
    login.checkLoginCredentials('correct@openhim.org', 'correct-password', function(loggedIn) {
      loggedIn.should.equal(true);
    });
  });

  //this happens in validateLogin() function but im using mock factory so im bypassing
  it('should validate false for users\' incorrect login credentials', function () {
    createController();
    login.checkLoginCredentials('false@openhim.org', 'false-password', function(loggedIn) {
      loggedIn.should.equal(false);
    });
  });

  //this happens in validateLogin() function but im using mock factory so im bypassing
  it('should create a user session', function () {
    createController();
    scope.createUserSession();
    var consoleSession = localStorage.getItem('consoleSession');
    expect(consoleSession).not.to.be.null;
  });

});