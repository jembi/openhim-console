'use strict';
/* global sinon:false */
/* jshint expr: true */

describe('Controller: SetPasswordCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  // setup config constant to be used for API server details
  beforeEach(function(){
    module('openhimWebui2App', function($provide){
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });
    });
  });

  var scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope,$httpBackend) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/new-user/ngYKZLaHLHgHQCwoEjhcPoJAfLquvmXU')).respond({
      'firstname': 'John',
      'surname': 'Smith',
      'msisdn': '',
      'token': 'ngYKZLaHLHgHQCwoEjhcPoJAfLquvmXU'
    });

    $httpBackend.when('PUT', new RegExp('.*/new-user/ngYKZLaHLHgHQCwoEjhcPoJAfLquvmXU')).respond('Successfully set new user password.');

    createController = function() {
      scope = $rootScope.$new();
      scope.user = {
        $update: sinon.spy()
      };
      return $controller('SetPasswordCtrl', { $scope: scope, $routeParams: { token: 'ngYKZLaHLHgHQCwoEjhcPoJAfLquvmXU' } });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should fetch a new user profile', function () {
    httpBackend.expectGET(new RegExp('.*/new-user/ngYKZLaHLHgHQCwoEjhcPoJAfLquvmXU'));
    createController();
    httpBackend.flush();

    scope.user.should.not.have.property('email');
    scope.user.should.have.property('firstname', 'John');
    scope.user.should.have.property('surname', 'Smith');
    scope.user.should.have.property('msisdn', '');
    scope.user.should.have.property('token', 'ngYKZLaHLHgHQCwoEjhcPoJAfLquvmXU');
  });

  it('should test for all validation and return TRUE - hasErrors', function() {
    createController();

    scope.user.firstname = '';
    scope.user.surname = '';
    scope.user.msisdn = '2712';
    scope.temp.password = 'password';

    // Should check all form validations and create object ngError.hasErrors with value true.
    scope.validateFormSetPassword();
    scope.ngError.should.have.property('hasErrors', true);
    scope.ngError.should.have.property('firstname', true);
    scope.ngError.should.have.property('surname', true);
    scope.ngError.should.have.property('msisdn', true);
    scope.ngError.should.have.property('passwordConfirm', true);

    httpBackend.flush();
  });

  it('should test for all validation and return FALSE - hasErrors', function() {
    createController();

    // Should check all form validations and create object ngError.hasErrors with value true.
    scope.user.firstname = 'John';
    scope.user.surname = 'Smith';
    scope.user.msisdn = '27123456789';
    scope.temp.password = 'password';
    scope.temp.passwordConfirm = 'password';

    scope.validateFormSetPassword();
    scope.ngError.should.have.property('hasErrors', false);

    httpBackend.flush();
  });

  it('should save the user profile with updated details', function() {
    createController();

    scope.user.firstname = 'John';
    scope.user.surname = 'Smith';
    scope.user.msisdn = '27123456789';
    scope.temp.password = 'password';
    scope.temp.passwordConfirm = 'password';

    // Should submit the form with supplied values and save the user with new password salt/hash
    scope.submitFormSetPassword();
    scope.user.$update.should.be.called;
    scope.ngError.should.have.property('hasErrors', false);

    scope.user.should.have.property('passwordSalt' );
    scope.user.should.have.property('passwordHash');
    scope.user.should.have.property('firstname', 'John');
    scope.user.should.have.property('surname', 'Smith');
    scope.user.should.have.property('msisdn', '27123456789');
    
    httpBackend.flush();
  });

});