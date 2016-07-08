'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: UsersCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimConsoleApp'));

  // setup config constant to be used for API server details
  beforeEach(function(){
    module('openhimConsoleApp', function($provide){
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });
    });
  });

  var createController, httpBackend, scope, modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {
    httpBackend = $httpBackend;

    httpBackend.when('GET', new RegExp('config/visualizer.json')).respond({
      'components': [],
      'endpoints': [],
      'color': { 'inactive': '#cccccc', 'active': '#4cae4c', 'error': '#d43f3a', 'text': '#000000' },
      'size': { 'width': 1000, 'height': 400, 'padding': 20 },
      'time': { 'updatePeriod': 200, 'maxSpeed': 5, 'maxTimeout': 5000 }
    });

    $httpBackend.when('GET', new RegExp('.*/users')).respond([{
        'firstname': 'Super',
        'surname': 'User',
        'email': 'super@openhim.org',
        'passwordAlgorithm': 'sample/api',
        'passwordHash': '539aa778930879b01b37ff62',
        'passwordSalt': '79b01b37ff62',
        'groups': ['admin'],
        'settings': {}
      }, {
        'firstname': 'Ordinary',
        'surname': 'User',
        'email': 'normal@openhim.org',
        'passwordAlgorithm': 'sample/api',
        'passwordHash': '539aa778930879b01b37ff62',
        'passwordSalt': '79b01b37ff62',
        'groups': ['limited'],
        'settings': {}
      }
    ]);


    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      {'name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'txViewAcl':['test', 'limited'],'txViewFullAcl':['test'],'txRerunAcl':['test'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}],'_id':'5322fe9d8b6add4b2b059dd8'},
      {'name':'Sample JsonStub Channel 2','urlPattern':'sample/api','allow':['PoC'],'txViewAcl':['limited'],'txViewFullAcl':[],'txRerunAcl':['limited'],'routes':[{'host':'jsonstub.com','port':80}],'_id':'5322fe9d8b6add4b2b059aa3'}
    ]);
    

    modalSpy = sinon.spy($modal, 'open');

    scope = $rootScope.$new();
    createController = function () {
      scope = $rootScope.$new();
      return $controller('UsersCtrl', { $scope: scope });
    };
  }));

  it('should attach a list of users to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/users'));
    createController();
    httpBackend.flush();
    scope.users.length.should.equal(2);

  });

  it('should open a modal to confirm deletion of a user', function () {
    createController();
    httpBackend.flush();

    httpBackend.expectGET('views/confirmModal.html').respond(200, '');
    scope.confirmDelete(scope.users[0]);
    modalSpy.should.be.calledOnce;
    httpBackend.flush();
  });

  it('should open a modal to add a user', function () {
    createController();
    scope.addUser();

    modalSpy.should.be.calledOnce;

    httpBackend.flush();
  });

  it('should open a modal to edit a user', function () {
    createController();
    scope.editUser();

    modalSpy.should.be.calledOnce;

    httpBackend.flush();
  });


  it('should attached a usersChannelsMatrix object to the scope', function () {
    createController();
    httpBackend.flush();

    scope.usersChannelsMatrix.should.have.property('channels');
    scope.usersChannelsMatrix.channels.length.should.equal(2);
    scope.usersChannelsMatrix.should.have.property('users');
    scope.usersChannelsMatrix.users.length.should.equal(2);

    scope.usersChannelsMatrix.users[0].user.email.should.equal('super@openhim.org');
    scope.usersChannelsMatrix.users[0].allowedChannels.length.should.equal(2);
    scope.usersChannelsMatrix.users[0].allowedChannelsBody.length.should.equal(2);
    scope.usersChannelsMatrix.users[0].allowedChannelsRerun.length.should.equal(2);

    scope.usersChannelsMatrix.users[1].user.email.should.equal('normal@openhim.org');
    scope.usersChannelsMatrix.users[1].allowedChannels.length.should.equal(2);
    scope.usersChannelsMatrix.users[1].allowedChannelsBody.length.should.equal(0);
    scope.usersChannelsMatrix.users[1].allowedChannelsRerun.length.should.equal(1);
  });

});
