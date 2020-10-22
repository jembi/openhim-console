'use strict'
/* global sinon: false */
/* global moment:false */

describe('Controller: TransactionsCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend, modalSpy // eslint-disable-line

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $uibModal) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/channels')).respond([
      { _id: '5322fe9d8b6add4b2b059dd8', status: 'enabled', name: 'Sample JsonStub Channel 1', urlPattern: 'sample/api', allow: ['PoC'], txRerunAcl: ['test'], routes: [{ host: 'jsonstub.com', port: 80, primary: true }] },
      { _id: '5322fe9d8b6add4b2b059aa3', status: 'deleted', name: 'Sample JsonStub Channel 2', urlPattern: 'sample/api', allow: ['PoC'], txRerunAcl: ['testing'], routes: [{ host: 'jsonstub.com', port: 80 }] }
    ])

    $httpBackend.when('GET', new RegExp('.*/clients')).respond([
      { clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234' },
      { clientID: 'test2', clientDomain: 'test2.openhim.org', name: 'Test 2', roles: ['test'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234' }
    ])

    $httpBackend.when('GET', new RegExp('.*/users/*')).respond({
      _id: '349274c136f2eb682aodye4c',
      email: 'root@openhim.org',
      firstname: 'Super',
      surname: 'User',
      passwordAlgorithm: 'sha512',
      passwordHash: '943a856bba65aad6c639d5c8d4a11fc8bb7fe9de62ae307aec8cf6ae6c1faab722127964c71db4bdd2ea2cdf60c6e4094dcad54d4522ab2839b65ae98100d0fb',
      passwordSalt: 'd9bcb40e-ae65-478f-962e-5e5e5e7d0a01',
      groups: ['admin'],
      settings: {
        filter: {
          endDate: '2016-08-17',
          startDate: '2016-08-16',
          orchestration: {},
          route: {},
          transaction: {
            status: 'Failed',
            wasRerun: 'yes'
          },
          limit: 70
        },
        list: { tabview: 'new' }
      }
    })

    $httpBackend.when('PUT', new RegExp('.*/users/*')).respond()

    $httpBackend.when('GET', new RegExp('.*/transactions\\?(filterLimit|filterPage)')).respond([
      {
        _id: '550936d307756ef72b525111',
        status: 'Successful',
        clientID: '5506aed5348ac60d23840a9e',
        channelID: '550933dbbc9814c82b12fd16',
        request: { path: '/path/successful', headers: {}, querystring: 'test=testing', body: 'Successful', method: 'GET', timestamp: '2015-03-18T08:26:59.417Z' },
        response: { timestamp: '2015-03-18T08:26:59.430Z', body: 'Body', headers: {}, status: 200 }
      }, {
        _id: '660936d307756ef72b525222',
        status: 'Successful',
        clientID: '5506aed5348ac60d23840a9e',
        channelID: '550933dbbc9814c82b12fd16',
        request: { path: '/path/successful/successful', headers: {}, querystring: '', body: 'Successful Successful', method: 'GET', timestamp: '2015-03-18T08:26:59.417Z' },
        response: { timestamp: '2015-03-18T08:26:59.430Z', body: 'Body', headers: {}, status: 200 }
      }, {
        _id: '770936d307756ef72b525333',
        status: 'Processing',
        clientID: '5506aed5348ac60d23840a9e',
        channelID: '550933dbbc9814c82b12fd16',
        request: { path: '/path/failed', headers: {}, querystring: 'test=world', body: 'Failed', method: 'GET', timestamp: '2015-03-18T08:26:59.417Z' }
      }, {
        _id: '880936d307756ef72b525444',
        status: 'Failed',
        clientID: '5506aed5348ac60d23840a9e',
        channelID: '550933dbbc9814c82b12fd16',
        request: { path: '/path/failed', headers: {}, querystring: '', body: 'Failed', method: 'GET', timestamp: '2015-03-18T08:26:59.417Z' },
        response: { timestamp: '2015-03-18T08:26:59.430Z', body: 'Body', headers: {}, status: 500 }
      }
    ])

    $httpBackend.when('GET', new RegExp('.*/heartbeat')).respond({ now: Date.now() })

    modalSpy = sinon.spy($uibModal, 'open')

    createController = function () {
      scope = $rootScope.$new()
      return $controller('TransactionsCtrl', { $scope: scope })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should attach a list of transactions to the scope', function () {
    createController()
    httpBackend.flush()
    scope.transactions.length.should.equal(4)
  })

  it('should check rerun permissions for admin user', function () {
    createController()
    httpBackend.flush()

    scope.channels.length.should.equal(2)
    scope.channels[0].should.have.property('name', 'Sample JsonStub Channel 1')
    scope.channels[1].should.have.property('name', 'Sample JsonStub Channel 2')
    scope.channelsMap.should.have.property('5322fe9d8b6add4b2b059dd8')
    scope.channelsMap.should.have.property('5322fe9d8b6add4b2b059aa3')
    scope.channelsMap['5322fe9d8b6add4b2b059dd8'].should.have.property('name', 'Sample JsonStub Channel 1')
    scope.channelsMap['5322fe9d8b6add4b2b059aa3'].should.have.property('name', 'Sample JsonStub Channel 2')
    scope.channelsMap['5322fe9d8b6add4b2b059dd8'].should.have.property('rerun', true)
    scope.channelsMap['5322fe9d8b6add4b2b059aa3'].should.have.property('rerun', false)
    scope.should.have.property('rerunAllowedAdmin', true)
  })

  it('should check that the user persisted filters are set', function () {
    createController()
    httpBackend.flush()

    // the consoleSession object is setup with user profile in 'login.js'
    scope.settings.filter.limit.should.equal(200)
    scope.settings.list.tabview.should.equal('new')
  })

  it('should clear filters and apply to the session', function () {
    createController()

    scope.clearFilters()
    httpBackend.flush()

    scope.bulkRerunActive.should.equal(false)
    scope.bulkRerun.should.equal(false)
    scope.settings.filter.limit.should.equal(20)
    scope.settings.filter.startDate.should.equal('')
    scope.settings.filter.endDate.should.equal('')
    scope.settings.filter.orchestration.should.be.empty()
    scope.settings.filter.route.should.be.empty()
    scope.settings.filter.transaction.wasRerun.should.equal('dont-filter')
    scope.settings.list.tabview.should.equal('same')
    scope.settings.list.autoupdate.should.equal(true)
    scope.advancedFilters.isCollapsed.should.equal(true)

    var consoleSession = localStorage.getItem('consoleSession')
    consoleSession = JSON.parse(consoleSession)
    consoleSession.sessionUserSettings.filter.limit.should.equal(20)
    consoleSession.sessionUserSettings.filter.transaction.wasRerun.should.equal('dont-filter')
  })

  it("should apply user's default settings to the session", function () {
    createController()

    scope.applyDefaultFilters()
    httpBackend.flush()

    scope.settings.filter.limit.should.equal(70)
    scope.settings.filter.startDate.should.equal('2016-08-16')
    scope.settings.filter.endDate.should.equal('2016-08-17')
    scope.settings.filter.orchestration.should.be.empty()
    scope.settings.filter.route.should.be.empty()
    scope.settings.filter.transaction.wasRerun.should.equal('yes')
    scope.settings.filter.transaction.status.should.equal('Failed')

    var consoleSession = localStorage.getItem('consoleSession')
    consoleSession = JSON.parse(consoleSession)
    consoleSession.sessionUserSettings.filter.limit.should.equal(70)
    consoleSession.sessionUserSettings.filter.startDate.should.equal('2016-08-16')
    consoleSession.sessionUserSettings.filter.endDate.should.equal('2016-08-17')
    consoleSession.sessionUserSettings.filter.transaction.wasRerun.should.equal('yes')
    consoleSession.sessionUserSettings.filter.transaction.status.should.equal('Failed')

    // clear dates for polling tests
    scope.clearFilters()
    httpBackend.flush()
  })

  it('should save user default filters to the API', function () {
    createController()
    httpBackend.flush()

    scope.settings.filter.limit = 293

    scope.persistUserFiltersToDatabase()

    httpBackend.expectPUT(new RegExp('.*/users/root@openhim.org'))
    httpBackend.flush()

    scope.settings.filter.limit.should.equal(293)
  })

  it('should check filters are sent to the API', function () {
    createController()
    httpBackend.flush()

    var startDate = '2015-03-09T00:00:00+00:00'
    var endDate = '2015-03-09T00:00:00+00:00'

    scope.settings.filter.startDate = moment(startDate).format()
    scope.settings.filter.endDate = moment(endDate).format()

    // search for transaction filters
    scope.settings.filter.transaction.status = 'Successful'
    scope.settings.filter.transaction.channel = '5322fe9d8b6add4b2b059dd8'
    scope.settings.filter.transaction.statusCode = '2xx'
    scope.settings.filter.transaction.path = '/path'
    scope.settings.filter.transaction.wasRerun = 'yes'
    scope.settings.filter.route.statusCode = '2xx'
    scope.settings.filter.orchestration.statusCode = '2xx'

    var filters = scope.returnFilters()

    // filter object that gets sent through the API for query filtering
    filters.filters['request.timestamp'].should.equal('{"$gte":"' + moment(startDate).format() + '","$lte":"' + moment(endDate).format() + '"}')
    filters.filters.status.should.equal('Successful')
    filters.filters.channelID.should.equal('5322fe9d8b6add4b2b059dd8')
    filters.filters['response.status'].should.equal('2xx')
    filters.filters['request.path'].should.equal('/path')
    filters.filters.childIDs.should.equal('{"$exists":true,"$ne":[]}')
    filters.filters['routes.response.status'].should.equal('2xx')
    filters.filters['orchestrations.response.status'].should.equal('2xx')
  })

  it('should check filters are sent to the API when rerun is set to no', function () {
    createController()
    httpBackend.flush()

    var startDate = '2015-03-09T00:00:00+00:00'
    var endDate = '2015-03-09T00:00:00+00:00'

    scope.settings.filter.startDate = moment(startDate).format()
    scope.settings.filter.endDate = moment(endDate).format()

    // search for transaction filters
    scope.settings.filter.transaction.wasRerun = 'no'
    scope.settings.filter.route.statusCode = '2xx'
    scope.settings.filter.orchestration.statusCode = '2xx'

    var filters = scope.returnFilters()

    // filter object that gets sent through the API for query filtering
    filters.filters['request.timestamp'].should.equal('{"$gte":"' + moment(startDate).format() + '","$lte":"' + moment(endDate).format() + '"}')
    filters.filters.childIDs.should.equal('{"$eq":[]}')
    filters.filters['routes.response.status'].should.equal('2xx')
    filters.filters['orchestrations.response.status'].should.equal('2xx')
  })

  it('should prepend new transactions to the scope', function () {
    createController()
    httpBackend.flush()

    var originalLength = scope.transactions.length

    httpBackend.when('GET', new RegExp('.*/transactions')).respond([
      {
        _id: '59a010234c3c346c24d01f6e',
        status: 'Successful',
        clientID: '5506aed5348ac60d23840a9e',
        channelID: '550933dbbc9814c82b12fd16',
        request: { path: '/path/successful', headers: {}, querystring: 'test=testing', body: 'Successful', method: 'GET', timestamp: '2017-08-25T11:55:38.953Z' },
        response: { timestamp: '2017-08-25T11:56:38.953Z', body: 'Body', headers: {}, status: 200 }
      },
      {
        _id: '550936d307756ef72b525555',
        status: 'Successful',
        clientID: '5506aed5348ac60d23840a9e',
        channelID: '550933dbbc9814c82b12fd16',
        request: { path: '/path/successful', headers: {}, querystring: 'test=testing', body: 'Successful', method: 'GET', timestamp: '2015-07-15T15:26:59.417Z' },
        response: { timestamp: '2015-07-15T15:26:59.430Z', body: 'Body', headers: {}, status: 200 }
      }
    ])

    scope.pollForLatest()
    httpBackend.flush()

    scope.transactions.length.should.equal(originalLength + 2)
    scope.transactions[0]._id.should.equal('59a010234c3c346c24d01f6e')
    scope.transactions[1]._id.should.equal('550936d307756ef72b525555')
  })

  it('should update "Processing" transactions', function () {
    createController()
    httpBackend.flush()

    // did it load correctly...
    scope.transactions[2]._id.should.equal('770936d307756ef72b525333')
    scope.transactions[2].status.should.equal('Processing')

    httpBackend.when('GET', new RegExp('.*/transactions/770936d307756ef72b525333')).respond(
      {
        _id: '770936d307756ef72b525333',
        status: 'Failed',
        clientID: '5506aed5348ac60d23840a9e',
        channelID: '550933dbbc9814c82b12fd16',
        request: { path: '/path/failed', headers: {}, querystring: 'test=world', body: 'Failed', method: 'GET', timestamp: '2015-03-18T08:26:59.417Z' },
        response: { timestamp: '2015-03-18T08:26:59.430Z', body: 'Body', headers: {}, status: 500 }
      }
    )

    scope.pollForProcessingUpdates()
    httpBackend.flush()

    // only status should change, position in array must be the same
    scope.transactions[2]._id.should.equal('770936d307756ef72b525333')
    scope.transactions[2].status.should.equal('Failed')
  })

  it('should check rerun permissions (non admin user should have permission on enabled channel)', function () {
    // Change the userGroups from admin. The userGroups are stored in a session upon login.
    // They are used to determine if a user can rerun a channel's transactions
    var session = localStorage.getItem('consoleSession')
    localStorage.removeItem('consoleSession')
    session = JSON.parse(session)
    session.sessionUserGroups = ['test1', 'test', 'test2', 'test2']
    localStorage.setItem('consoleSession', JSON.stringify(session))

    createController()
    httpBackend.flush()

    scope.channelsMap['5322fe9d8b6add4b2b059dd8'].should.have.property('rerun', true)
    scope.channelsMap['5322fe9d8b6add4b2b059aa3'].should.have.property('rerun', false)
  })

  it('should check rerun permissions (non admin user should not have permission on enabled channel)', function () {
    // Change the userGroups from admin. The userGroups are stored in a session upon login.
    // They are used to determine if a user can rerun a channel's transactions
    var session = localStorage.getItem('consoleSession')
    localStorage.removeItem('consoleSession')
    session = JSON.parse(session)
    session.sessionUserGroups = ['test1', 'test2', 'test3', 'test4']
    localStorage.setItem('consoleSession', JSON.stringify(session))

    createController()
    httpBackend.flush()

    scope.channelsMap['5322fe9d8b6add4b2b059dd8'].should.have.property('rerun', false)
    scope.channelsMap['5322fe9d8b6add4b2b059aa3'].should.have.property('rerun', false)
  })
})
