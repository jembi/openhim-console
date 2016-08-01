'use strict';
/* jshint expr: true */

describe('Controller: ExportImportCtrl', function () {

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
    
    $httpBackend.when('GET', new RegExp('.*/metadata')).respond([{
      'Channels': [
        {'name':'Sample JsonStub Channel 1','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80,'primary':true}],'_id':'5322fe9d8b6add4b2b059ff5'},
        {'name':'Sample JsonStub Channel 2','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80}],'_id':'5322fe9d8b6add4b2b059ff6'},
        {'name':'Sample JsonStub Channel 3','urlPattern':'sample/api','allow':['PoC'],'routes':[{'host':'jsonstub.com','port':80}],'_id':'5322fe9d8b6add4b33333333','status':'deleted'}
      ],
      'Clients': [
        {_id:'5322fe9d8b6add4b2b059ff6', clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'},
        {_id:'4567fe9d8b6addd83l559ff8', clientID: 'test2', clientDomain: 'test2.openhim.org', name: 'Test 2', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'}
      ],
      'Users': [
        { _id:'6380fe9d8b6addd83l559fs7', 'firstname': 'Super', 'surname': 'User', 'email': 'super@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['admin'] },
        { _id:'1569fe9d8b6addd83l559fd3', 'firstname': 'Ordinary', 'surname': 'User', 'email': 'normal@openim.org', 'passwordAlgorithm': 'sample/api', 'passwordHash': '539aa778930879b01b37ff62', 'passwordSalt': '79b01b37ff62', 'groups': ['limited'] }
      ],
      'ContactGroups': [
        { _id:'5555fe9d8b6addd83l559sf6', 'group': 'Group 1', 'users': [ {'user': 'User 1', 'method': 'sms', 'maxAlerts': 'no max'}, {'user': 'User 2', 'method': 'email', 'maxAlerts': '1 per day'}, {'user': 'User 3', 'method': 'email', 'maxAlerts': '1 per hour'} ] },
        { _id:'2335fe9d8b6addd83l559hu8', 'group': 'Group 2', 'users': [ {'user': 'User 4', 'method': 'email', 'maxAlerts': 'no max'} ] },
      ],
      'Mediators': [
        { _id:'4444fe9d8b6addd83l5595555', 'urn': 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE', 'version': '0.0.1','name': 'Test 1 Mediator','description': 'Test 1 Description','defaultChannelConfig': [{ 'name': 'Mediator Channel 1', 'urlPattern': '/channel1', 'routes': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }], 'allow': [ 'xdlab' ], 'type': 'http' }],'endpoints': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }]},
        { _id:'1233fe9d8b6addd83l55tty6','urn': 'EEEEEEEE-DDDD-CCCC-BBBB-AAAAAAAAAAAA','version': '0.1.2','name': 'Test 2 Mediator','description': 'Test 2 Description','defaultChannelConfig': [{ 'name': 'Mediator Channel 2', 'urlPattern': '/channnel2', 'routes': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }], 'allow': [ 'xdlab' ], 'type': 'http' }],'endpoints': [{ 'name': 'Route', 'host': 'localhost', 'port': '2222', 'primary': true, 'type': 'http' }, { 'name': 'Route 2', 'host': 'localhost2', 'port': '3333', 'primary': false, 'type': 'http' }]}
      ]
    }]);
      
      
    httpBackend.when('PUT', new RegExp('.*/metadata')).respond({
      'successes': [
        {'model': 'Clients','record': {_id:'5322fe9d8b6add4b2b059ff6', clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'},'status': 'Successful','message': 'Successfully inserted Clients with name'}
      ],
      'errors': [
        {'model': 'Clients','record': {_id:'5322fe9d8b6add4b2b059ff6', clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'},'status': 'Error','message': 'Successfully inserted Clients with name'}
      ]
    });
    
    
    httpBackend.when('POST', new RegExp('.*/metadata')).respond({
      'successes': [
        {'model': 'Clients','record': {_id:'5322fe9d8b6add4b2b059ff6', clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'},'status': 'Successful','message': 'Successfully inserted Clients with name'}
      ],
      'errors': [
        {'model': 'Clients','record': {_id:'5322fe9d8b6add4b2b059ff6', clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234'},'status': 'Error','message': 'Successfully inserted Clients with name'}
      ]
    });

    createController = function() {
      scope = $rootScope.$new();
      return $controller('ExportImportCtrl', { $scope: scope });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a list of collections to the scope', function () {
    createController();
    httpBackend.flush();

    scope.exportCollections.Users.length.should.equal(2);
    scope.exportCollections.Clients.length.should.equal(2);
    scope.exportCollections.Channels.length.should.equal(3);
    scope.exportCollections.Mediators.length.should.equal(2);
    scope.exportCollections.ContactGroups.length.should.equal(2);

    scope.exportSettings.removeIds.should.equal(true);

    scope.selectedExports.Users.should.equal( scope.exportCollections.Users );
    scope.selectedExports.Clients.should.equal( scope.exportCollections.Clients );
    scope.selectedExports.Channels.should.equal( scope.exportCollections.Channels );
    scope.selectedExports.Mediators.should.equal( scope.exportCollections.Mediators );
    scope.selectedExports.ContactGroups.should.equal( scope.exportCollections.ContactGroups );

    scope.showRecordOptions.Users.should.equal(false);
    scope.showRecordOptions.Clients.should.equal(false);
    scope.showRecordOptions.Channels.should.equal(false);
    scope.showRecordOptions.Mediators.should.equal(false);
    scope.showRecordOptions.ContactGroups.should.equal(false);

  });

  it('should execute toggleCollectionExportSelection() and remove/add collection from/to selectedExports', function () {
    createController();
    httpBackend.flush();

    scope.selectedExports.Users.length.should.equal( 2 );
    scope.selectedExports.Clients.length.should.equal( 2 );
    scope.selectedExports.Channels.length.should.equal( 3 );
    scope.selectedExports.Mediators.length.should.equal( 2 );
    scope.selectedExports.ContactGroups.length.should.equal( 2 );

    scope.showRecordOptions.Users.should.equal(false);
    scope.showRecordOptions.Clients.should.equal(false);
    scope.showRecordOptions.Channels.should.equal(false);
    scope.showRecordOptions.Mediators.should.equal(false);
    scope.showRecordOptions.ContactGroups.should.equal(false);

    // do the check collecion function
    scope.toggleCollectionExportSelection( 'Users', scope.exportCollections.Users );
    scope.toggleCollectionExportSelection( 'Channels', scope.exportCollections.Channels );
    scope.toggleCollectionExportSelection( 'ContactGroups', scope.exportCollections.ContactGroups );

    scope.selectedExports.Users.length.should.equal( 0 );
    scope.selectedExports.Clients.length.should.equal( 2 );
    scope.selectedExports.Channels.length.should.equal( 0 );
    scope.selectedExports.Mediators.length.should.equal( 2 );
    scope.selectedExports.ContactGroups.length.should.equal( 0 );

    scope.showRecordOptions.Users.should.equal(true);
    scope.showRecordOptions.Clients.should.equal(false);
    scope.showRecordOptions.Channels.should.equal(true);
    scope.showRecordOptions.Mediators.should.equal(false);
    scope.showRecordOptions.ContactGroups.should.equal(true);


  });

  it('should execute toggleRecordExportSelection() and remove/add record from/to selectedExports', function () {
    createController();
    httpBackend.flush();

    // do the check collecion function to show all records
    scope.toggleCollectionExportSelection( 'Users', scope.exportCollections.Users );
    scope.toggleCollectionExportSelection( 'Clients', scope.exportCollections.Clients );
    scope.toggleCollectionExportSelection( 'Channels', scope.exportCollections.Channels );
    scope.toggleCollectionExportSelection( 'Mediators', scope.exportCollections.Mediators );
    scope.toggleCollectionExportSelection( 'ContactGroups', scope.exportCollections.ContactGroups );

    // do the check record function
    scope.toggleRecordExportSelection( 'Users', scope.exportCollections.Users[0] );
    scope.toggleRecordExportSelection( 'Users', scope.exportCollections.Users[1] );
    scope.toggleRecordExportSelection( 'Channels', scope.exportCollections.Channels[0] );
    scope.toggleRecordExportSelection( 'Channels', scope.exportCollections.Channels[1] );
    scope.toggleRecordExportSelection( 'Channels', scope.exportCollections.Channels[3] );
    scope.toggleRecordExportSelection( 'ContactGroups', scope.exportCollections.ContactGroups[0] );

    scope.selectedExports.Users.length.should.equal( 2 );
    scope.selectedExports.Clients.length.should.equal( 0 );
    scope.selectedExports.Channels.length.should.equal( 3 );
    scope.selectedExports.Mediators.length.should.equal( 0 );
    scope.selectedExports.ContactGroups.length.should.equal( 1 );

  });

  it('should execute removeProperties() and remove _id from object', function () {
    createController();
    httpBackend.flush();

    scope.selectedExports.Users[0].should.have.property('_id');
    scope.selectedExports.Clients[0].should.have.property('_id');
    scope.selectedExports.Channels[0].should.have.property('_id');
    scope.selectedExports.Mediators[0].should.have.property('_id');
    scope.selectedExports.ContactGroups[0].should.have.property('_id');

    var transformedObject = scope.removeProperties( scope.selectedExports );

    transformedObject.Users[0].should.not.have.property('_id');
    transformedObject.Users[1].should.not.have.property('_id');
    transformedObject.Clients[0].should.not.have.property('_id');
    transformedObject.Clients[1].should.not.have.property('_id');
    transformedObject.Channels[0].should.not.have.property('_id');
    transformedObject.Channels[1].should.not.have.property('_id');
    transformedObject.Channels[2].should.not.have.property('_id');
    transformedObject.Mediators[0].should.not.have.property('_id');
    transformedObject.Mediators[1].should.not.have.property('_id');
    transformedObject.ContactGroups[0].should.not.have.property('_id');
    transformedObject.ContactGroups[1].should.not.have.property('_id');

  });

  it('should execute createExportFile() and add a blob download link', function () {
    createController();
    httpBackend.flush();

    scope.selectedExports.Users.length.should.equal( 2 );
    scope.selectedExports.Clients.length.should.equal( 2 );
    scope.selectedExports.Channels.length.should.equal( 3 );
    scope.selectedExports.Mediators.length.should.equal( 2 );
    scope.selectedExports.ContactGroups.length.should.equal( 2 );

    scope.createExportFile( scope.selectedExports );

    expect(scope.downloadLink.indexOf('blob:http://localhost:8080/')).to.be.above(-1);
  });

  // it('should execute runImportFile() and import the data', function () {
  //   createController();
  //   httpBackend.flush();

  //   var importData = {
  //     Users: scope.selectedExports.Users,
  //     Clients: scope.selectedExports.Clients,
  //     Channels: scope.selectedExports.Channels,
  //     Mediators: scope.selectedExports.Mediators,
  //     ContactGroups: scope.selectedExports.ContactGroups
  //   };

  //   importData.Users[0].should.have.property('_id', '6380fe9d8b6addd83l559fs7');
  //   importData.Users[0].should.have.property('firstname', 'Super');
  //   importData.Users[0].should.have.property('surname', 'User');
  //   importData.Users[0].should.have.property('email', 'super@openim.org');

  //   importData.Channels[2].should.have.property('_id', '5322fe9d8b6add4b33333333');
  //   importData.Channels[2].should.have.property('name', 'Sample JsonStub Channel 3');
  //   importData.Channels[2].should.have.property('urlPattern', 'sample/api');

  //   // lets change some data in our data object before doing the import
  //   importData.Users[0].firstname = 'ImportFirtname';
  //   importData.Users[0].surname = 'ImportSurname';
  //   importData.Users[0].email = 'importemail.openim.org';
  //   importData.Channels[2].name = 'Import Channel';
  //   importData.Channels[2].urlPattern = '/import/channel';

  //   // execute the import function
  //   scope.runImportFile( JSON.stringify( importData ) );

  //   // verify dat has been imported and updated successfully
  //   scope.exportCollections.Users[0].should.have.property('_id', '6380fe9d8b6addd83l559fs7');
  //   scope.exportCollections.Users[0].should.have.property('firstname', 'ImportFirtname');
  //   scope.exportCollections.Users[0].should.have.property('surname', 'ImportSurname');
  //   scope.exportCollections.Users[0].should.have.property('email', 'importemail.openim.org');

  //   scope.exportCollections.Channels[2].should.have.property('_id', '5322fe9d8b6add4b33333333');
  //   scope.exportCollections.Channels[2].should.have.property('name', 'Import Channel');
  //   scope.exportCollections.Channels[2].should.have.property('urlPattern', '/import/channel');

  //   httpBackend.flush();

  // });

});
