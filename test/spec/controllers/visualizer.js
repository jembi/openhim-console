'use strict'
/* global sinon: false */

describe('Controller: VisualizerCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'hostPath': '', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend, modal

  var visualizers = [{
    'name': 'Test Visualizer 1',
    'components': [
      {
        'eventType': 'primary',
        'eventName': 'OpenHIM Mediator FHIR Proxy Route',
        'display': 'FHIR Server'
      },
      {
        'eventType': 'primary',
        'eventName': 'echo',
        'display': 'Echo'
      }
    ],
    'color': {
      'inactive': '#c8cacf',
      'active': '#10e057',
      'error': '#a84b5c',
      'text': '#4a4254'
    },
    'size': {
      'responsive': true,
      'width': 1000,
      'height': 400,
      'padding': 20
    },
    'time': {
      'updatePeriod': 200,
      'maxSpeed': 5,
      'maxTimeout': 5000,
      'minDisplayPeriod': 500
    },
    'channels': [
      {
        'eventType': 'channel',
        'eventName': 'FHIR Proxy',
        'display': 'FHIR Proxy'
      },
      {
        'eventType': 'channel',
        'eventName': 'Echo',
        'display': 'Echo'
      }
    ],
    'mediators': [
      {
        'mediator': 'urn:mediator:fhir-proxy',
        'name': 'OpenHIM Mediator FHIR Proxy',
        'display': 'OpenHIM Mediator FHIR Proxy'
      },
      {
        'mediator': 'urn:mediator:shell-script',
        'name': 'OpenHIM Shell Script Mediator',
        'display': 'OpenHIM Shell Script Mediator'
      }
    ]
  },
  {
    'name': 'Test Visualizer 2',
    'components': [
      {
        'eventType': 'primary',
        'eventName': 'echo',
        'display': 'Echo'
      }
    ],
    'color': {
      'inactive': '#c8cacf',
      'active': '#10e057',
      'error': '#a84b5c',
      'text': '#4a4254'
    },
    'size': {
      'responsive': true,
      'width': 1000,
      'height': 400,
      'padding': 20
    },
    'time': {
      'updatePeriod': 200,
      'maxSpeed': 5,
      'maxTimeout': 5000,
      'minDisplayPeriod': 500
    },
    'channels': [
      {
        'eventType': 'channel',
        'eventName': 'Echo',
        'display': 'Echo'
      }
    ],
    'mediators': []
  }]

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $uibModal) {
    httpBackend = $httpBackend
    modal = $uibModal

    $httpBackend.when('GET', new RegExp('.*/visualizers')).respond(visualizers)

    $httpBackend.when('GET', new RegExp('.*/heartbeat')).respond({ 'now': Date.now() })

    $httpBackend.when('PUT', new RegExp('.*/users/test@user.org')).respond()

    createController = function () {
      scope = $rootScope.$new()
      return $controller('VisualizerCtrl', { $scope: scope })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should add visualizer settings to the scope, defaulting to the first visualizer', function () {
    httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({'email': 'test@user.org'})

    createController()
    httpBackend.flush()

    scope.visualizerSettings.should.deep.equal({
      'name': 'Test Visualizer 1',
      'components': [
        {
          'eventType': 'primary',
          'eventName': 'OpenHIM Mediator FHIR Proxy Route',
          'display': 'FHIR Server'
        },
        {
          'eventType': 'primary',
          'eventName': 'echo',
          'display': 'Echo'
        }
      ],
      'channels': [
        {
          'eventType': 'channel',
          'eventName': 'FHIR Proxy',
          'display': 'FHIR Proxy'
        },
        {
          'eventType': 'channel',
          'eventName': 'Echo',
          'display': 'Echo'
        }
      ],
      'mediators': [
        {
          'mediator': 'urn:mediator:fhir-proxy',
          'name': 'OpenHIM Mediator FHIR Proxy',
          'display': 'OpenHIM Mediator FHIR Proxy'
        },
        {
          'mediator': 'urn:mediator:shell-script',
          'name': 'OpenHIM Shell Script Mediator',
          'display': 'OpenHIM Shell Script Mediator'
        }
      ],
      'visResponsive': true,
      'visW': 1000,
      'visH': 400,
      'pad': 20,
      'inactiveColor': '#c8cacf',
      'activeColor': '#10e057',
      'errorColor': '#a84b5c',
      'textColor': '#4a4254',
      'updatePeriod': 200,
      'minDisplayPeriod': 500,
      'speed': 0,
      'maxSpeed': 5,
      'maxTimeout': 5000
    })
  })

  it('should add visualizer settings to the scope, defaulting to a user last viewed visualizer', function () {
    httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({ 'email': 'test@user.org', settings: { selectedVisualizer: 'Test Visualizer 2' } })

    createController()
    httpBackend.flush()

    scope.visualizerSettings.should.have.property('name', 'Test Visualizer 2')
  })

  it('should load another visualizer', function () {
    httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({'email': 'test@user.org'})

    createController()
    httpBackend.flush()

    scope.selectVis(visualizers[1])
    httpBackend.flush()

    scope.visualizerSettings.should.have.property('name', 'Test Visualizer 2')
  })

  it('should update a users last viewed visualizer', function () {
    httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({'email': 'test@user.org'})

    createController()
    httpBackend.flush()

    httpBackend.expect('PUT', new RegExp('.*/users/test@user.org'), function (data) {
      return !!JSON.parse(data).settings.selectedVisualizer
    }).respond({})
    scope.selectVis(visualizers[1])
    httpBackend.flush()

    var consoleSession = localStorage.getItem('consoleSession')
    consoleSession = JSON.parse(consoleSession)

    consoleSession.sessionUserSettings.selectedVisualizer.should.be.equal('Test Visualizer 2')
  })

  it('should open a modal to confirm deletion of a visualizer and remove a visualizer on confirmation', function () {
    httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({'email': 'test@user.org'})

    var modalSpy = sinon.stub(modal, 'open', function () {
      return {
        result: {
          then: function (callback) {
            callback()
          }
        }
      }
    })
    var vis
    vis = angular.copy(visualizers[0], vis)
    vis.$remove = sinon.spy()

    createController()
    httpBackend.flush()

    scope.confirmRemoveVis(vis, 0)
    modalSpy.should.have.been.calledOnce()
    vis.$remove.should.have.been.calledOnce()
    scope.visualizers.length.should.be.equal(1)
    scope.visualizers[0].should.have.property('name', 'Test Visualizer 2')
  })

  it('should open a modal to confirm deletion of a visualizer and NOT remove a visualizer on cancellation', function () {
    httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({'email': 'test@user.org'})

    var modalSpy = sinon.stub(modal, 'open', function () {
      return {
        result: {
          then: function (callback, cancel) {
            cancel()
          }
        }
      }
    })
    var vis
    vis = angular.copy(visualizers[0], vis)
    vis.$remove = sinon.spy()

    createController()
    httpBackend.flush()

    scope.confirmRemoveVis(vis, 0)
    modalSpy.should.have.been.calledOnce()
    vis.$remove.should.not.have.been.called()
    scope.visualizers.length.should.be.equal(2)
    scope.visualizers[0].should.have.property('name', 'Test Visualizer 1')
  })

  it('should open a modal to add a new visualizer', function () {
    httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({'email': 'test@user.org'})

    var modalSpy = sinon.stub(modal, 'open', function () {
      return {
        result: {
          then: function (callback, cancel) {
            cancel()
          }
        }
      }
    })

    createController()
    httpBackend.flush()

    scope.addVisualiser()
    modalSpy.should.have.been.calledOnce()
  })

  it('should open a modal to edit a visualizer', function () {
    httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({'email': 'test@user.org'})

    var modalSpy = sinon.stub(modal, 'open')

    createController()
    httpBackend.flush()

    scope.editVisualiser()
    modalSpy.should.have.been.calledOnce()
  })

  it('should open a modal to duplicate a visualizer', function () {
    httpBackend.when('GET', new RegExp('.*/users/test@user.org')).respond({'email': 'test@user.org'})

    var modalSpy = sinon.stub(modal, 'open')

    createController()
    httpBackend.flush()

    scope.duplicateVisualiser()
    modalSpy.should.have.been.calledOnce()
  })
})
