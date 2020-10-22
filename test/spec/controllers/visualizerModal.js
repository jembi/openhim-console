'use strict'
/* global should */

describe('Controller: VisualizerModalCtrl', function () {
  var scope, createController, httpBackend, modalInstance, defaultVisualizerSettings, validSettings

  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  defaultVisualizerSettings = { components: [], channels: [], mediators: [], color: { inactive: '#cccccc', active: '#4cae4c', error: '#d43f3a', text: '#000000' }, size: { responsive: true, width: 1000, height: 400, padding: 20 }, time: { updatePeriod: 200, minDisplayPeriod: 500, maxSpeed: 5, maxTimeout: 5000 } }

  validSettings = { components: [{ eventType: 'primary', eventName: 'echoServer', display: 'test2', $$hashKey: '024' }], channels: [{ eventType: 'channel', eventName: 'TestHello', display: 'TestHello', $$hashKey: '01Q' }], mediators: [{ mediator: 'urn:uuid:a15c3d48-0686-4c9b-b375-f68d2f244a33', name: 'file-queue', display: 'file-queue', $$hashKey: '01S' }], color: { inactive: '#cccccc', active: '#4cae4c', error: '#d43f3a', text: '#000000' }, size: { responsive: true, width: 1000, height: 400, padding: 20 }, time: { updatePeriod: 200, minDisplayPeriod: 500, maxSpeed: 5, maxTimeout: 5000 }, name: 'test1' }

  var selectedChannel = { _id: '57616d194ef4cce71d0e2532', name: 'TestHello', urlPattern: '^/test$', __v: 0, tcpPort: null, tcpHost: null, pollingSchedule: null, matchContentJson: null, matchContentValue: null, matchContentXpath: null, matchContentRegex: null, rewriteUrlsConfig: [], addAutoRewriteRules: true, rewriteUrls: false, status: 'deleted', alerts: [], txRerunAcl: [], txViewFullAcl: [], txViewAcl: [], properties: [], matchContentTypes: [], routes: [{ name: 'TestHello', host: 'localhost', path: '/test', port: 4002, secured: false, primary: true, _id: '57a09d1e1b437e8c17b95e36', forwardAuthHeader: false, status: 'enabled', type: 'http' }], authType: 'public', whitelist: [], allow: [], type: 'http' }

  var selectedMediator = { _id: '572aeeea22997473431c9486', urn: 'urn:uuid:20cbc520-128e-11e6-922a-27f0e7107fa1', version: '0.1.0', name: 'Tutorial Mediator Java', description: 'This is the Java mediator being used in this tutorial', __v: 0, configDefs: [], defaultChannelConfig: [{ urlPattern: '/encounters/.*', name: 'Tutorial Mediator Java', _id: '57a09d1e1b437e8c17b95e41', rewriteUrlsConfig: [], addAutoRewriteRules: true, rewriteUrls: false, status: 'enabled', alerts: [], txRerunAcl: [], txViewFullAcl: [], txViewAcl: [], properties: [], matchContentTypes: [], routes: [{ primary: true, port: 4002, host: 'localhost', name: 'Tutorial Mediator Java Route', _id: '57a09d1e1b437e8c17b95e42', forwardAuthHeader: false, status: 'enabled', type: 'http' }], authType: 'private', whitelist: [], allow: ['tutorialmediatorjava'], type: 'http' }], endpoints: [{ port: 4002, host: 'localhost', name: 'Tutorial Mediator Java Route', _id: '57a09d1e1b437e8c17b95e43', forwardAuthHeader: false, status: 'enabled', type: 'http' }] }

  var channels = [{ _id: '575e80df9d4e61080930adcd', name: 'echoServer', urlPattern: '^/test$', __v: 0, tcpPort: null, tcpHost: null, pollingSchedule: null, matchContentJson: null, matchContentValue: null, matchContentXpath: null, matchContentRegex: null, rewriteUrlsConfig: [], addAutoRewriteRules: true, rewriteUrls: false, status: 'deleted', alerts: [], txRerunAcl: [], txViewFullAcl: [], txViewAcl: [], properties: [], matchContentTypes: [], routes: [{ name: 'echoServer', host: 'localhost', path: '/test', port: 4002, secured: false, primary: true, _id: '57a09d1e1b437e8c17b95e37', forwardAuthHeader: false, status: 'enabled', type: 'http' }], authType: 'public', whitelist: [], allow: [], type: 'http' }, { _id: '575fc1df666be07306b9ae78', name: 'hello world', urlPattern: '^/hello$', __v: 0, tcpPort: null, tcpHost: null, pollingSchedule: null, matchContentJson: null, matchContentValue: null, matchContentXpath: null, matchContentRegex: null, rewriteUrlsConfig: [], addAutoRewriteRules: true, rewriteUrls: false, status: 'deleted', alerts: [], txRerunAcl: [], txViewFullAcl: [], txViewAcl: [], properties: [], matchContentTypes: [], routes: [{ name: 'hello world', host: 'localhost', path: '/hello', port: 4002, secured: false, primary: true, _id: '57a09d1e1b437e8c17b95e38', forwardAuthHeader: false, status: 'enabled', type: 'http' }], authType: 'public', whitelist: [], allow: [], type: 'http' }, { _id: '5767e0ca7400726f06101768', name: 'Hello', urlPattern: '^/hello$', __v: 0, rewriteUrlsConfig: [], addAutoRewriteRules: true, rewriteUrls: false, status: 'enabled', alerts: [], txRerunAcl: [], txViewFullAcl: [], txViewAcl: [], properties: [], matchContentTypes: [], routes: [{ name: 'Hello', host: 'localhost', path: '/hello', port: 4002, secured: false, primary: true, _id: '57a09d1e1b437e8c17b95e3d', forwardAuthHeader: false, status: 'enabled', type: 'http' }], authType: 'private', whitelist: [], allow: ['file-queue'], type: 'http' }]
  channels.push(selectedChannel)

  var component = {
    eventType: 'Primary Route',
    eventName: 'Test1',
    display: 'Test1'
  }

  var mediators = []
  mediators.push(selectedMediator)

  var visualizers = [{
    name: 'Test Visualizer 1',
    components: [
      {
        eventType: 'primary',
        eventName: 'OpenHIM Mediator FHIR Proxy Route',
        display: 'FHIR Server'
      },
      {
        eventType: 'primary',
        eventName: 'echo',
        display: 'Echo'
      }
    ],
    color: {
      inactive: '#c8cacf',
      active: '#10e057',
      error: '#a84b5c',
      text: '#4a4254'
    },
    size: {
      responsive: true,
      width: 1000,
      height: 400,
      padding: 20
    },
    time: {
      updatePeriod: 200,
      maxSpeed: 5,
      maxTimeout: 5000,
      minDisplayPeriod: 500
    },
    channels: [
      {
        eventType: 'channel',
        eventName: 'FHIR Proxy',
        display: 'FHIR Proxy'
      },
      {
        eventType: 'channel',
        eventName: 'Echo',
        display: 'Echo'
      }
    ],
    mediators: [
      {
        mediator: 'urn:mediator:fhir-proxy',
        name: 'OpenHIM Mediator FHIR Proxy',
        display: 'OpenHIM Mediator FHIR Proxy'
      },
      {
        mediator: 'urn:mediator:shell-script',
        name: 'OpenHIM Shell Script Mediator',
        display: 'OpenHIM Shell Script Mediator'
      }
    ]
  },
  {
    name: 'Test Visualizer 2',
    components: [
      {
        eventType: 'primary',
        eventName: 'echo',
        display: 'Echo'
      }
    ],
    color: {
      inactive: '#c8cacf',
      active: '#10e057',
      error: '#a84b5c',
      text: '#4a4254'
    },
    size: {
      responsive: true,
      width: 1000,
      height: 400,
      padding: 20
    },
    time: {
      updatePeriod: 200,
      maxSpeed: 5,
      maxTimeout: 5000,
      minDisplayPeriod: 500
    },
    channels: [
      {
        eventType: 'channel',
        eventName: 'Echo',
        display: 'Echo'
      }
    ],
    mediators: []
  }]

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend

    $httpBackend.when('GET', new RegExp('config/visualizer.json')).respond(defaultVisualizerSettings)

    $httpBackend.when('GET', new RegExp('.*/channels')).respond(channels)

    $httpBackend.when('GET', new RegExp('.*/mediators')).respond(mediators)

    $httpBackend.when('GET', new RegExp('.*/heartbeat')).respond({ now: Date.now() })

    $httpBackend.when('PUT', new RegExp('.*/users/test@user.org')).respond()

    $httpBackend.when('POST', new RegExp('.*/visualizers')).respond(visualizers)

    scope = $rootScope.$new()
    modalInstance = {
      close: function () { return true }
    }

    createController = function (vis, dup) {
      return $controller('VisualizerModalCtrl', {
        $scope: scope,
        $uibModalInstance: modalInstance,
        visualizers: visualizers,
        visualizer: vis,
        duplicate: dup
      })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()

    defaultVisualizerSettings.components = []
    defaultVisualizerSettings.channels = []
    defaultVisualizerSettings.mediators = []
    validSettings.name = 'Test1'
  })

  // Tests go here
  it('should initialize settings for visualizer modal', function () {
    createController(null, null)
    httpBackend.flush()

    expect(scope.visualizer).to.eql(defaultVisualizerSettings)
    expect(JSON.stringify(scope.channels)).to.equal(JSON.stringify(channels))
    expect(JSON.stringify(scope.mediators)).to.equal(JSON.stringify(mediators))
  })

  it('should execute addSelectedChannel() and add channel to settings object', function () {
    createController(null, null)
    httpBackend.flush()

    selectedChannel.name = 'Test1'
    scope.viewModel.addSelectChannel = selectedChannel

    defaultVisualizerSettings.channels.push({ eventType: 'channel', eventName: selectedChannel.name, display: selectedChannel.name })

    scope.addSelectedChannel()

    expect(scope.visualizer).to.eql(defaultVisualizerSettings)
  })

  it('should execute addSelectedMediator() and add mediator to settings object', function () {
    createController(null, null)
    httpBackend.flush()

    selectedMediator.urn = 'urn:uuid:54chj341-128e-11e6-922a-27f0e4376df8'
    scope.viewModel.addSelectMediator = selectedMediator

    defaultVisualizerSettings.mediators.push({ mediator: selectedMediator.urn, name: selectedMediator.name, display: selectedMediator.name })

    scope.addSelectedMediator()
    expect(scope.visualizer).to.eql(defaultVisualizerSettings)
  })

  it('should execute addComponent() and add component to settings object', function () {
    createController(null, null)
    httpBackend.flush()

    scope.viewModel.addComponent = component

    defaultVisualizerSettings.components.push({ eventType: component.eventType, eventName: component.eventName, display: component.display })

    scope.addComponent()
    expect(scope.visualizer).to.eql(defaultVisualizerSettings)
  })

  it('should execute removeChannel() and remove the first channel', function () {
    createController(null, null)
    httpBackend.flush()

    defaultVisualizerSettings.channels.splice(0, 1)

    scope.removeChannel(0)
    expect(scope.visualizer).to.eql(defaultVisualizerSettings)
  })

  it('should execute removeMediator() and remove the first mediator', function () {
    createController(null, null)
    httpBackend.flush()

    defaultVisualizerSettings.mediators.splice(0, 1)

    scope.removeMediator(0)
    expect(scope.visualizer).to.eql(defaultVisualizerSettings)
  })

  it('should execute removeComponents() and remove the first component', function () {
    createController(null, null)
    httpBackend.flush()

    scope.viewModel.addComponent = component
    scope.addComponent()

    scope.removeMediator(0)
    expect(scope.visualizer).to.eql(defaultVisualizerSettings)
  })

  it('should execute validateVisualizer and return TRUE - valid settings', function () {
    createController(null, null)
    httpBackend.flush()

    scope.validateVisualizer(validSettings, function (err) {
      expect(err).not.to.exist()
      expect(scope.ngError.hasErrors).to.be.false()
      expect(scope.ngError.hasNoName).not.to.exist()
      expect(scope.ngError.hasNoComponents).not.to.exist()
      expect(scope.ngError.hasNoChannels).not.to.exist()
      expect(scope.ngError.nameNotUnique).not.to.exist()
    })
  })

  it('should execute validateVisualizer and return FALSE - incomplete settings', function () {
    createController(null, null)
    httpBackend.flush()

    scope.validateVisualizer(defaultVisualizerSettings, function (err) {
      err.should.exist()

      expect(scope.ngError.hasErrors).to.be.true()
      expect(scope.ngError.hasNoName).to.be.true()
      expect(scope.ngError.hasNoComponents).to.be.true()
      expect(scope.ngError.hasNoChannels).to.be.true()
      expect(scope.ngError.nameNotUnique).not.to.exist()
    })
  })

  it('should execute validateVisualizer and return FALSE - throw name already exists error', function () {
    createController(null, null)
    httpBackend.flush()

    validSettings.name = 'Test Visualizer 1'

    scope.validateVisualizer(validSettings, function (err) {
      err.should.exist()
      expect(scope.ngError.hasErrors).to.be.true()
      expect(scope.ngError.nameNotUnique).to.be.true()

      expect(scope.ngError.hasNoName).not.to.exist()
      expect(scope.ngError.hasNoComponents).not.to.exist()
      expect(scope.ngError.hasNoChannels).not.to.exist()
    })
  })

  it('should set update to true when update visualizer is present', function () {
    createController({}, null)
    httpBackend.flush()

    expect(scope.update).to.be.true()
  })

  it('should set update to false when duplicate visualizer is present', function () {
    createController(null, { _id: '123', name: 'Test' })
    httpBackend.flush()

    expect(scope.update).to.be.false()
  })

  it('should delete name and _id from duplicate visualizer', function () {
    var dup = { _id: '123', name: 'Test' }
    createController(null, dup)
    httpBackend.flush()

    should.not.exist(scope.visualizer.name)
    should.not.exist(scope.visualizer._id)
  })

  it('should assign a copy of the visualizer to edit to scope', function () {
    var vis = { _id: '123', name: 'Test' }
    createController(vis, null)
    httpBackend.flush()

    scope.visualizer.should.deep.equal(vis)
    scope.visualizer.should.not.equal(vis)
  })

  it('should assign a copy of the visualizer to duplicate to scope', function () {
    var dup = { test: 'prop' }
    createController(null, dup)
    httpBackend.flush()

    scope.visualizer.should.deep.equal(dup)
    scope.visualizer.should.not.equal(dup)
  })

  it('should execute a PUT request when a visualizer is being updated', function () {
    createController(visualizers[0], null)
    httpBackend.flush()
    scope.visualizer._id = 123

    httpBackend.expectPUT(new RegExp('.*/visualizers/123')).respond(200)
    scope.saveVisualizer()
    httpBackend.flush()
  })

  it('should execute a POST request when a visualizer is being saved', function () {
    createController(null, null)
    httpBackend.flush()
    scope.visualizer = JSON.parse(JSON.stringify(visualizers[0])) // poor mans object copy...
    scope.visualizer.name = 'NewVis'

    httpBackend.expectPOST(new RegExp('.*/visualizers')).respond(201)
    scope.saveVisualizer()
    httpBackend.flush()
  })
})
