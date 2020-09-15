'use strict'
/* global sinon:false */

describe('Controller: ChannelsModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  var scope, createController, createControllerRoutes, httpBackend

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { firstname: 'Super', surname: 'User', email: 'super@openim.org', passwordAlgorithm: 'sample/api', passwordHash: '539aa778930879b01b37ff62', passwordSalt: '79b01b37ff62', groups: ['admin'] },
      { firstname: 'Ordinary', surname: 'User', email: 'normal@openim.org', passwordAlgorithm: 'sample/api', passwordHash: '539aa778930879b01b37ff62', passwordSalt: '79b01b37ff62', groups: ['limited'] }
    ])

    $httpBackend.when('GET', new RegExp('.*/groups')).respond([
      { group: 'Group 1', users: [{ user: 'User 1', method: 'sms', maxAlerts: 'no max' }, { user: 'User 2', method: 'email', maxAlerts: '1 per day' }, { user: 'User 3', method: 'email', maxAlerts: '1 per hour' }] },
      { group: 'Group 2', users: [{ user: 'User 4', method: 'email', maxAlerts: 'no max' }] }
    ])

    // http request used in routes controller
    $httpBackend.when('GET', new RegExp('.*/mediators')).respond([
      {
        urn: 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE',
        version: '0.0.1',
        name: 'Test 1 Mediator',
        description: 'Test 1 Description',
        defaultChannelConfig: [
          { name: 'Mediator Channel 1', urlPattern: '/channel1', routes: [{ name: 'Route 1', host: 'localhost', port: '1111', primary: true, type: 'http' }], allow: ['xdlab'], type: 'http' }
        ],
        endpoints: [{ name: 'Route 1', host: 'localhost', port: '1111', primary: true, type: 'http' }]
      }, {
        urn: 'EEEEEEEE-DDDD-CCCC-BBBB-AAAAAAAAAAAA',
        version: '0.1.2',
        name: 'Test 2 Mediator',
        description: 'Test 2 Description',
        defaultChannelConfig: [
          { name: 'Mediator Channel 2', urlPattern: '/channnel2', routes: [{ name: 'Route', host: 'localhost', port: '2222', primary: true, type: 'http' }], allow: ['xdlab'], type: 'http' }
        ],
        endpoints: [{ name: 'Route', host: 'localhost', port: '2222', primary: true, type: 'http' }, { name: 'Route 2', host: 'localhost2', port: '3333', primary: false, type: 'http' }]
      }
    ])

    // http request used in routes controller
    $httpBackend.when('GET', new RegExp('.*/keystore/ca')).respond([
      { country: 'US', state: 'Missouri', locality: 'St. Louis', organization: 'Mallinckrodt Institute of Radiology', organizationUnit: 'Electronic Radiology Lab', commonName: 'MIR2014-16', emailAddress: 'moultonr@mir.wustl.edu', data: '-----FAKE CERTIFICATE DATA-----', _id: '54e1ca5afa069b5a7b938c4f', validity: { start: '2014-10-09T13:15:28.000Z', end: '2016-11-29T13:15:28.000Z' } },
      { country: 'ZA', state: 'KZN', locality: 'Durban', organization: 'Jembi Health Systems NPC', organizationUnit: 'eHealth', commonName: 'openhim', emailAddress: 'ryan@jembi.org', data: '-----FAKE CERTIFICATE DATA-----', _id: '54e1ca5afa069b5a7b938c50', validity: { start: '2014-11-25T12:52:21.000Z', end: '2016-10-30T12:52:21.000Z' } }
    ])

    $httpBackend.when('GET', new RegExp('.*/channels/.+/audits$')).respond([])
    $httpBackend.when('GET', new RegExp('.*/channels/.+')).respond({})

    scope = $rootScope.$new()
    var modalInstance = sinon.spy()

    createController = function (channel, channelDuplicate) {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        channel: channel,
        channelDuplicate: channelDuplicate,
        tab: null
      })
    }
    createControllerRoutes = function () {
      return $controller('channelRoutesCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        channel: null
      })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should fetch channel data from the API when updating', function () {
    httpBackend.expect('GET', new RegExp('.*/channels/.+'))
    createController({ _id: 'test' })
    httpBackend.flush()
  })

  it('should create a new channel if this is not an update', function () {
    createController()
    httpBackend.flush()

    scope.channel.should.be.ok()
  })

  it('should create a duplicate channel from an existing channel', function () {
    createController(null, 'test')
    httpBackend.flush()

    scope.channel.should.be.ok()
    scope.channel.should.not.have.property('_id')
    scope.channel.should.not.have.property('name')
  })

  it('should run validateFormChannels() for any validation errors - ngErrors.hasErrors -> TRUE', function () {
    createController()
    // set child route controller for broadcast response
    createControllerRoutes()
    httpBackend.flush()

    scope.channel.type = 'http'
    scope.channel.authType = 'private'
    scope.matching.showRequestMatching = true
    scope.channel.name = ''
    scope.channel.urlPattern = ''
    scope.channel.allow = []
    scope.matching.contentMatching = 'XML matching'
    scope.channel.matchContentXpath = ''
    scope.channel.matchContentValue = ''
    scope.channel.routes = []

    // run the validate
    scope.validateFormChannels()

    scope.ngError.should.have.property('name', true)
    scope.ngError.should.have.property('urlPattern', true)
    scope.ngError.should.have.property('allow', true)
    scope.ngError.should.have.property('matchContentXpath', true)
    scope.ngError.should.have.property('matchContentXpath', true)
    scope.ngError.should.have.property('hasRouteWarnings', true)
  })

  it('should run validateFormChannels() for any validation errors - ngErrors.hasErrors -> FALSE', function () {
    createController()
    httpBackend.flush()

    scope.channel.name = 'ChannelName'
    scope.channel.urlPattern = 'sample/api'
    scope.channel.allow = ['allow1', 'allow2']
    scope.matching.contentMatching = 'XML matching'
    scope.channel.matchContentXpath = 'XPath'
    scope.channel.matchContentValue = 'Value'
    scope.channel.routes = [{ name: 'testRoute', host: 'localhost', port: '80', path: '/sample/api', primary: true }]

    // run the validate
    scope.validateFormChannels()
    scope.ngError.should.have.property('hasErrors', false)
  })

  it('should run submitFormChannels() and check any validation errors - FALSE - should not save the record', function () {
    createController()
    // set child route controller for broadcast response
    createControllerRoutes()
    httpBackend.flush()

    scope.channel.type = 'http'
    scope.channel.authType = 'private'
    scope.matching.showRequestMatching = true
    scope.channel.name = ''
    scope.channel.urlPattern = ''
    scope.channel.allow = []
    scope.matching.contentMatching = 'XML matching'
    scope.channel.matchContentXpath = ''
    scope.channel.matchContentValue = ''
    scope.channel.routes = []

    // run the submit
    scope.submitFormChannels()
    scope.ngError.should.have.property('name', true)
    scope.ngError.should.have.property('urlPattern', true)
    scope.ngError.should.have.property('allow', true)
    scope.ngError.should.have.property('matchContentXpath', true)
    scope.ngError.should.have.property('matchContentXpath', true)
    scope.ngError.should.have.property('hasRouteWarnings', true)
  })

  it('should run submitFormChannels() and check any validation errors - TRUE - Should save the record', function () {
    createController()
    httpBackend.flush()

    scope.channel.$save = sinon.spy()

    // update is false so create new channel
    scope.update = false

    scope.channel.name = 'ChannelName'
    scope.channel.urlPattern = 'sample/api'
    scope.channel.allow = ['allow1', 'allow2']
    scope.matching.contentMatching = 'XML matching'
    scope.channel.matchContentXpath = 'XPath'
    scope.channel.matchContentValue = 'Value'
    scope.channel.routes = [{ name: 'testRoute', host: 'localhost', port: '80', path: '/sample/api', primary: true }]
    // run the submit
    scope.submitFormChannels()
    scope.ngError.should.have.property('hasErrors', false)

    scope.channel.$save.should.have.been.called()
  })

  it('should run submitFormChannels() and add the regex delimiters to the URL Pattern', function () {
    createController()
    httpBackend.flush()

    scope.channel.$save = sinon.spy()

    // update is false so create new channel
    scope.update = false

    scope.channel.name = 'ChannelName'
    scope.channel.urlPattern = 'sample/api'
    scope.urlPattern.regex = true
    scope.channel.allow = ['allow1', 'allow2']
    scope.matching.contentMatching = 'XML matching'
    scope.channel.matchContentXpath = 'XPath'
    scope.channel.matchContentValue = 'Value'
    scope.channel.routes = [{ name: 'testRoute', host: 'localhost', port: '80', path: '/sample/api', primary: true }]
    // run the submit
    scope.submitFormChannels()
    scope.ngError.should.have.property('hasErrors', false)
    scope.channel.should.have.property('urlPattern', '^sample/api$')
    scope.channel.$save.should.have.been.called()
  })

  it('should run submitFormChannels() and check any validation errors - TRUE - Should create the record', function () {
    createController()
    httpBackend.flush()

    scope.channel.$save = sinon.spy()

    // update is false so create new channel
    scope.update = false
    scope.channel.type = 'http'
    scope.channel.name = 'ChannelName'
    scope.channel.urlPattern = 'sample/api'
    scope.channel.routes = [{ name: 'testRoute', host: 'localhost', port: '80', path: '/sample/api', primary: true }]
    // run the submit
    scope.submitFormChannels()
    scope.ngError.should.have.property('hasErrors', false)
    scope.channel.should.have.property('methods')
    scope.channel.methods.length.should.eql(9)
    // default http methods should have been saved if none specified
    scope.channel.methods.should.eql([
      'GET',
      'POST',
      'DELETE',
      'PUT',
      'OPTIONS',
      'HEAD',
      'TRACE',
      'CONNECT',
      'PATCH'
    ])
    scope.channel.$save.should.have.been.called()
  })

  it('should run submitFormChannels() and check any validation errors - TRUE - Should not update the record', function () {
    createController()
    httpBackend.flush()

    scope.channel.$update = sinon.spy()
    scope.update = true
    scope.channel.type = 'http'

    scope.methods = {
      GET: false,
      POST: false,
      DELETE: false,
      PUT: false,
      OPTIONS: false,
      HEAD: false,
      TRACE: false,
      CONNECT: false,
      PATCH: false
    }
    scope.channel.authType = 'private'
    scope.matching.showRequestMatching = true
    scope.channel.name = 'ChannelName'
    scope.channel.urlPattern = 'sample/api'
    scope.channel.routes = [{ name: 'testRoute', host: 'localhost', port: '80', path: '/sample/api', primary: true }]

    // run the submit
    scope.submitFormChannels()
    scope.ngError.should.have.property('hasErrors', true)
  })

  it('should run submitFormChannels() and check any validation errors - TRUE - Should update the record', function () {
    createController()
    httpBackend.flush()
    scope.channel.$update = sinon.spy()
    scope.update = true
    scope.channel.type = 'http'
    scope.methods = {
      GET: true,
      POST: false,
      DELETE: false,
      PUT: false,
      OPTIONS: false,
      HEAD: false,
      TRACE: false,
      CONNECT: false,
      PATCH: false
    }
    scope.channel.authType = 'private'
    scope.matching.showRequestMatching = true
    scope.channel.name = 'ChannelName'
    scope.channel.urlPattern = 'sample/api'
    scope.urlPattern.regex = false
    scope.channel.allow = ['allow1', 'allow2']
    scope.matching.contentMatching = 'XML matching'
    scope.channel.matchContentXpath = 'XPath'
    scope.channel.matchContentValue = 'Value'
    scope.channel.routes = [{ name: 'testRoute', host: 'localhost', port: '80', path: '/sample/api', primary: true }]

    // run the submit
    scope.submitFormChannels()
    scope.ngError.should.have.property('hasErrors', false)
    scope.channel.$update.should.have.been.called()

    scope.channel.should.have.property('name', 'ChannelName')
    scope.channel.should.have.property('methods')
    scope.channel.methods.length.should.eql(1)
    // only GET http method should be saved
    scope.channel.methods[0].should.eql('GET')
    scope.channel.should.have.property('urlPattern', 'sample/api')
    scope.channel.should.have.property('matchContentXpath', 'XPath')
    scope.channel.should.have.property('matchContentValue', 'Value')
    scope.channel.allow.should.have.length(2)
    scope.channel.routes.should.have.length(1)
  })
})

describe('Controller: channelBasicInfoCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))
  var scope, createController, createControllerParent

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new()

    var modalInstance = sinon.spy()
    createControllerParent = function (channel, channelDuplicate) {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        channel: channel,
        channelDuplicate: channelDuplicate,
        tab: null
      })
    }
    createController = function () {
      return $controller('channelBasicInfoCtrl', {
        $scope: scope
      })
    }
  }))

  it('should set default Basic Info variables - Update is False', function () {
    createControllerParent()
    scope.update = false

    createController()
    scope.channel.should.be.ok()

    scope.channel.type.should.equal('http')
    scope.channel.authType.should.equal('private')
    scope.channel.status.should.equal('enabled')
  })
})

describe('Controller: channelRequestMatchingCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))
  var scope, createController, createControllerParent, q

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new()
    q = $q

    var modalInstance = sinon.spy()
    createControllerParent = function (channel) {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        channel: channel,
        channelDuplicate: null,
        tab: null
      })
    }
    createController = function () {
      return $controller('channelRequestMatchingCtrl', {
        $scope: scope
      })
    }
  }))

  it('should transform urlPattern accordingly if regex - remove regex additions for input display - Update is True', function () {
    var defer = q.defer()
    defer.resolve()
    createControllerParent({ _id: 'test', $promise: defer.promise })

    defer.promise.then(function () {
      scope.channel.urlPattern = '^/example/path$'

      createController()
      scope.channel.should.be.ok()

      scope.channel.urlPattern.should.equal('/example/path')
    })
  })

  it('should set default radio button for Content Matching (JSON matching) - Update is True', function () {
    var defer = q.defer()
    defer.resolve()
    createControllerParent({ _id: 'test', $promise: defer.promise })

    defer.promise.then(function () {
      // set macthContentJson variable to enable JSON matching radio button
      scope.channel.matchContentJson = 'JSONMatchingVar'
      scope.channel.matchContentValue = 'JSONMatchingValue'
      createController()

      scope.channel.should.be.ok()
      scope.matching.contentMatching.should.equal('JSON matching')
    })
  })
})

describe('Controller: channelUserAccessCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))
  var scope, createController, createControllerParent, httpBackend

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend
    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { firstname: 'Super', surname: 'User', email: 'super@openim.org', passwordAlgorithm: 'sample/api', passwordHash: '539aa778930879b01b37ff62', passwordSalt: '79b01b37ff62', groups: ['admin'] },
      { firstname: 'Ordinary', surname: 'User', email: 'normal@openim.org', passwordAlgorithm: 'sample/api', passwordHash: '539aa778930879b01b37ff62', passwordSalt: '79b01b37ff62', groups: ['limited', 'tester'] }
    ])
    $httpBackend.when('GET', new RegExp('.*/clients')).respond([
      { clientID: 'test1', clientDomain: 'test1.openhim.org', name: 'Test 1', roles: ['test', 'testing2'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234' },
      { clientID: 'test2', clientDomain: 'test2.openhim.org', name: 'Test 2', roles: ['test', 'testing again'], passwordAlgorithm: 'sha512', passwordHash: '1234', passwordSalt: '1234' }
    ])

    scope = $rootScope.$new()

    var modalInstance = sinon.spy()
    createControllerParent = function () {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        channel: null,
        channelDuplicate: null,
        tab: null
      })
    }
    createController = function () {
      return $controller('channelUserAccessCtrl', {
        $scope: scope
      })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should create a taglist array for User Roles Groups', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    scope.channel.should.be.ok()

    // Each unique role
    scope.taglistUserRoleOptions.length.should.equal(3)
  })
})

describe('Controller: channelDataControlCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))
  var scope, createController, createControllerParent

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new()

    var modalInstance = sinon.spy()
    createControllerParent = function () {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        channel: null,
        channelDuplicate: null,
        tab: null
      })
    }
    createController = function () {
      return $controller('channelDataControlCtrl', {
        $scope: scope
      })
    }
  }))

  it('should set default request/reponse body settings - Update is false', function () {
    createControllerParent()
    scope.update = false
    createController()

    scope.channel.should.be.ok()
    scope.channel.requestBody.should.equal(true)
    scope.channel.responseBody.should.equal(true)
  })

  // URL Rewriting tests still to be written
})

describe('Controller: channelRoutesCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))
  var scope, createController, createControllerParent, httpBackend

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend
    // http request used in main parent controller
    $httpBackend.when('GET', new RegExp('.*/users')).respond([
      { firstname: 'Super', surname: 'User', email: 'super@openim.org', passwordAlgorithm: 'sample/api', passwordHash: '539aa778930879b01b37ff62', passwordSalt: '79b01b37ff62', groups: ['admin'] },
      { firstname: 'Ordinary', surname: 'User', email: 'normal@openim.org', passwordAlgorithm: 'sample/api', passwordHash: '539aa778930879b01b37ff62', passwordSalt: '79b01b37ff62', groups: ['limited'] }
    ])

    $httpBackend.when('GET', new RegExp('.*/mediators')).respond([
      {
        urn: 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE',
        version: '0.0.1',
        name: 'Test 1 Mediator',
        description: 'Test 1 Description',
        defaultChannelConfig: [
          { name: 'Mediator Channel 1', urlPattern: '/channel1', routes: [{ name: 'Route 1', host: 'localhost', port: '1111', primary: true, type: 'http' }], allow: ['xdlab'], type: 'http' }
        ],
        endpoints: [{ name: 'Route 1', host: 'localhost', port: 1111, primary: false, type: 'http' }]
      }, {
        urn: 'EEEEEEEE-DDDD-CCCC-BBBB-AAAAAAAAAAAA',
        version: '0.1.2',
        name: 'Test 2 Mediator',
        description: 'Test 2 Description',
        defaultChannelConfig: [
          { name: 'Mediator Channel 2', urlPattern: '/channnel2', routes: [{ name: 'Route', host: 'localhost', port: '2222', primary: true, type: 'http' }], allow: ['xdlab'], type: 'http' }
        ],
        endpoints: [{ name: 'Route', host: 'localhost', port: '2222', primary: false, type: 'http' }, { name: 'Route 2', host: 'localhost2', port: '3333', primary: false, type: 'http' }]
      }
    ])

    $httpBackend.when('GET', new RegExp('.*/keystore/ca')).respond([
      { country: 'US', state: 'Missouri', locality: 'St. Louis', organization: 'Mallinckrodt Institute of Radiology', organizationUnit: 'Electronic Radiology Lab', commonName: 'MIR2014-16', emailAddress: 'moultonr@mir.wustl.edu', data: '-----FAKE CERTIFICATE DATA-----', _id: '54e1ca5afa069b5a7b938c4f', validity: { start: '2014-10-09T13:15:28.000Z', end: '2016-11-29T13:15:28.000Z' } },
      { country: 'ZA', state: 'KZN', locality: 'Durban', organization: 'Jembi Health Systems NPC', organizationUnit: 'eHealth', commonName: 'openhim', emailAddress: 'ryan@jembi.org', data: '-----FAKE CERTIFICATE DATA-----', _id: '54e1ca5afa069b5a7b938c50', validity: { start: '2014-11-25T12:52:21.000Z', end: '2016-10-30T12:52:21.000Z' } }
    ])

    scope = $rootScope.$new()

    var modalInstance = sinon.spy()
    createControllerParent = function () {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        channel: null,
        channelDuplicate: null,
        tab: null
      })
    }
    createController = function () {
      return $controller('channelRoutesCtrl', {
        $scope: scope
      })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should create Mediators and TrustedCerts objects', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    scope.channel.should.be.ok()

    scope.mediatorRoutes.length.should.equal(3)
    scope.trustedCerts.length.should.equal(2)
  })

  it('should reset route errors', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    scope.ngErrorRoute = { hasErrors: true, name: true, host: true }

    // reset route erros
    scope.resetRouteErrors()

    scope.ngErrorRoute.should.not.have.property('hasErrors')
    scope.ngErrorRoute.should.not.have.property('name')
    scope.ngErrorRoute.should.not.have.property('host')
  })

  it('should validateFormRoutes() and return errors - FAILED', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    scope.newRoute = {}
    scope.newRoute.name = ''
    scope.newRoute.host = ''
    scope.newRoute.port = 'qwerty'

    // reset route erros
    scope.validateFormRoutes()

    scope.ngErrorRoute.should.have.property('hasErrors', true)
    scope.ngErrorRoute.should.have.property('name', true)
    scope.ngErrorRoute.should.have.property('host', true)
    scope.ngErrorRoute.should.have.property('port', true)
    scope.ngErrorRoute.should.have.property('portError', 'Only numbers allowed!')
  })

  it('should saveRoute() and return errors - FAILED', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    scope.newRoute = {}
    scope.newRoute.name = ''
    scope.newRoute.host = ''
    scope.newRoute.port = 'qwerty'

    // reset route erros
    scope.saveRoute()

    scope.ngErrorRoute.should.have.property('hasErrors', true)
    scope.ngErrorRoute.should.have.property('name', true)
    scope.ngErrorRoute.should.have.property('host', true)
    scope.ngErrorRoute.should.have.property('port', true)
    scope.ngErrorRoute.should.have.property('portError', 'Only numbers allowed!')
  })

  it('should saveRoute() and return NO errors - SUCCESS', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    scope.channel.routes.length.should.equal(0)

    scope.newRoute = {}
    scope.newRoute.name = 'New Route'
    scope.newRoute.host = 'localhost'
    scope.newRoute.port = '1234'

    // reset route erros
    scope.saveRoute()
    scope.channel.routes.length.should.equal(1)
  })

  it('should run addEditRoute() to edit an existing route', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    var route = [{
      name: 'Test Route',
      secured: false,
      host: 'localhost',
      port: '1234',
      path: '/path',
      pathTransform: '',
      primary: false,
      username: '',
      password: '',
      type: 'http'
    }]
    scope.channel.routes.push(route)
    scope.channel.routes.should.have.length(1)

    scope.addEditRoute('edit', route, 0)

    scope.newRoute[0].should.have.property('name', 'Test Route')
    scope.newRoute[0].should.have.property('secured', false)
    scope.newRoute[0].should.have.property('host', 'localhost')
    scope.newRoute[0].should.have.property('port', '1234')
    scope.newRoute[0].should.have.property('path', '/path')
    scope.newRoute[0].should.have.property('pathTransform', '')
    scope.newRoute[0].should.have.property('primary', false)
    scope.newRoute[0].should.have.property('username', '')
    scope.newRoute[0].should.have.property('password', '')
    scope.newRoute[0].should.have.property('type', 'http')
  })

  it('should run addRouteFromMediator to add a mediator to the channel.routes', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    scope.channel.routes.should.have.length(0)
    scope.selected.mediatorRoute = scope.mediatorRoutes[0]

    scope.addRouteFromMediator()

    scope.channel.routes.should.have.length(1)
    scope.channel.routes[0].should.have.property('name', 'Route 1')
    scope.channel.routes[0].should.have.property('host', 'localhost')
    scope.channel.routes[0].should.have.property('port', 1111)
    // orginally route primary set to false - First mediator channel.route option automatically set primary = true
    scope.channel.routes[0].should.have.property('primary', true)
    scope.channel.routes[0].should.have.property('type', 'http')
  })

  it('should remove an existing route', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    scope.channel.routes = [
      {
        name: 'Test Route 1',
        path: '/test/path',
        host: 'localhost',
        port: '9999'
      },
      {
        name: 'Test Route 2',
        path: '/test/path2',
        host: 'localhost',
        port: '9988'
      }
    ]

    scope.removeRoute(1)
    scope.channel.routes.should.have.length(1)
    scope.channel.routes[0].should.have.property('name', 'Test Route 1')
  })

  it('should return true if there are multiple primary routes', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    scope.channel.routes = [
      {
        name: 'Test Route 1',
        path: '/test/path',
        host: 'localhost',
        port: '9999',
        primary: true
      },
      {
        name: 'Test Route 2',
        path: '/test/path2',
        host: 'localhost',
        port: '9988'
      },
      {
        name: 'Test Route 3',
        path: '/test/path3',
        host: 'localhost',
        port: '9988',
        primary: true
      }
    ]
    expect(scope.multiplePrimaries()).to.be.true()
  })

  it('should return false if there is enabled primary route and multiple disabled primary routes', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    scope.channel.routes = [
      {
        name: 'Test Route 1',
        path: '/test/path',
        host: 'localhost',
        port: '9999',
        primary: true
      },
      {
        name: 'Test Route 2',
        path: '/test/path2',
        host: 'localhost',
        port: '9988'
      },
      {
        name: 'Test Route 3',
        path: '/test/path3',
        host: 'localhost',
        port: '9988',
        primary: true,
        status: 'disabled'
      }
    ]
    expect(scope.multiplePrimaries()).to.be.false()
  })

  it('should return false if there is only one primary route', function () {
    createControllerParent()
    createController()
    httpBackend.flush()

    scope.channel.routes = [
      {
        name: 'Test Route 1',
        path: '/test/path',
        host: 'localhost',
        port: '9999'
      },
      {
        name: 'Test Route 2',
        path: '/test/path2',
        host: 'localhost',
        port: '9988'
      },
      {
        name: 'Test Route 3',
        path: '/test/path3',
        host: 'localhost',
        port: '9988',
        primary: true
      }
    ]
    expect(scope.multiplePrimaries()).to.be.false()
  })
})

describe('Controller: channelAlertsCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))
  var scope, createController, createControllerParent

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new()

    var modalInstance = sinon.spy()
    createControllerParent = function () {
      return $controller('ChannelsModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        channel: null,
        channelDuplicate: null,
        tab: null
      })
    }
    createController = function () {
      return $controller('channelAlertsCtrl', {
        $scope: scope
      })
    }
  }))

  it('should create a new channel if this is not an update', function () {
    createControllerParent()
    createController()
    scope.channel.should.be.ok()
    /* STILL NEEDED */
  })
})
