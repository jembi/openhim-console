'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: UsersCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var createController, httpBackend, scope, modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {
    httpBackend = $httpBackend;

    
    $httpBackend.when('GET', new RegExp('.*/usersChannelsMatrix')).respond({
      'channels': [{ '_id': '5436482f6ad2579b26aa31b3', 'name': 'test2' },
                  { '_id': '5436482f6ad2579b26aa31b4', 'name': 'test3' },
                  { '_id': '5436482f6ad2579b26aa31b2', 'name': 'test' }],
      'users': [{ 'user': 'normal@openhim.org', 'allowedChannels': [ '5436482f6ad2579b26aa31b4', '5436482f6ad2579b26aa31b'] },
                { 'user': 'super@openhim.org', 'allowedChannels': ['5436482f6ad2579b26aa31b', '5436482f6ad2579b26aa31b', '5436482f6ad2579b26aa31b2'] }]
    });


    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      {
        'firstname': 'Super',
        'surname': 'User',
        'email': 'super@openim.org',
        'passwordAlgorithm': 'sample/api',
        'passwordHash': '539aa778930879b01b37ff62',
        'passwordSalt': '79b01b37ff62',
        'groups': ['admin']

      },
      {
        'firstname': 'Ordinary',
        'surname': 'User',
        'email': 'normal@openim.org',
        'passwordAlgorithm': 'sample/api',
        'passwordHash': '539aa778930879b01b37ff62',
        'passwordSalt': '79b01b37ff62',
        'groups': ['limited']
      }
    ]);


    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      {'name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'txRerunAcl':['test'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}],'_id':'5322fe9d8b6add4b2b059dd8'},
      {'name':'Sample JsonStub Channel 2','urlPattern':'sample/api','allow':['PoC'],'txRerunAcl':['testing'],'routes':[{'host':'jsonstub.com','port':80}],'_id':'5322fe9d8b6add4b2b059aa3'}
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

    httpBackend.expectGET('views/deleteConfirmModal.html').respond(200, '');
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
    //httpBackend.expectGET(new RegExp('.*/usersChannelsMatrix'));
    createController();
    httpBackend.flush();

    scope.usersChannelsMatrix.should.have.property('channels');
    scope.usersChannelsMatrix.channels.length.should.equal(3);
    scope.usersChannelsMatrix.should.have.property('users');
    scope.usersChannelsMatrix.users.length.should.equal(2);
    scope.usersChannelsMatrix.users[0].user.should.equal('normal@openhim.org');
    scope.usersChannelsMatrix.users[0].allowedChannels.length.should.equal(2);
    scope.usersChannelsMatrix.users[1].user.should.equal('super@openhim.org');
    scope.usersChannelsMatrix.users[1].allowedChannels.length.should.equal(3);
  });

});
