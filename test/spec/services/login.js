'use strict';
/* jshint expr: true */

describe('Service: login', function () {

  // load the service's module
  beforeEach(module('openhimWebui2App'));

  // instantiate service
  var login, httpBackend;
  beforeEach(inject(function (_login_, $httpBackend) {
    login = _login_;

    httpBackend = $httpBackend;

    httpBackend.when('GET', new RegExp('.*/authenticate/.*')).respond({
      salt: 'test-salt',
      ts: 'test-ts'
    });
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should login a user and fetch the currently logged in user', function () {
    httpBackend.expectGET(new RegExp('.*/authenticate/test@user.org'));
    login.login('test@user.org', 'test-password', function(){});
    
    httpBackend.flush();

    var user = login.getLoggedInUser();

    user.should.exist;
    user.should.have.property('username', 'test@user.org');
    user.should.have.property('passwordhash', '7d0d1a30d16f5343e3390fe9ef1dd61539a7f797267e0d2241ed22390dfc9743091244ddb2463df2f1adf6df3c355876ed34c6523f1e8d3b7f16f4b2afc8c160');

  });

  it('should logout a user', function () {
    login.logout();
    var user = login.getLoggedInUser();
    (user.username === null).should.be.true;
    (user.passwordhash === null).should.be.true;
  });

  it('should check if a user is currently logged in', function () {
    login.isLoggedIn().should.be.false;

    login.login('test@user.org', 'test-password', function(){});
    httpBackend.flush();

    login.isLoggedIn().should.be.true;
    login.logout();
    login.isLoggedIn().should.be.false;
  });

});
