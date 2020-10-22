import visualizerModal from '~/views/visualizerModal'
import confirmModal from '~/views/confirmModal'
import { VisualizerModalCtrl, ConfirmModalCtrl } from './'

import moment from 'moment'

export function VisualizerCtrl ($scope, $http, $interval, $window, $uibModal, login, Api, Alerting, Fullscreen) {
  // initialize global variables
  const settingsStore = {} // a place the push current settings when switching to fullscreen
  let visualizerUpdateInterval, updatePeriod, diffTime, lastUpdate, maxSpeed, pad, user, consoleSession

  $scope.loadingVisualizer = false
  $scope.loadingVisualizerError = false
  $scope.loadingVisualizerErrorMsgs = []
  $scope.isUsingOldVisualizerSettings = false

  // function to start the visualizer
  const startVisualizer = function startVisualizer () {
    Api.Heartbeat.get(function (heartbeat) {
      diffTime = Date.now() - moment(heartbeat.now)
      $scope.play()
    })
  }

  const loadVisualizer = function (visSettings) {
    $scope.loadingVisualizer = true
    let visResponsive, visW, visH, inactiveColor, activeColor, errorColor, textColor, minDisplayPeriod, maxTimeout
    const components = []
    const channels = []
    const mediators = []

    if (visSettings.endpoints && !visSettings.mediators) {
      $scope.isUsingOldVisualizerSettings = true
    }

    /** ******** Visualizations Management **********/
    // setup components (components)
    angular.forEach(visSettings.components, function (component) {
      components.push(component)
    })

    // setup channels
    angular.forEach(visSettings.channels, function (channel) {
      channels.push(channel)
    })

    // setup channels
    angular.forEach(visSettings.mediators, function (mediator) {
      mediators.push(mediator)
    })

    // check if components and components have events
    if (components.length === 0 || channels.length === 0) {
      $scope.loadingVisualizerError = true
      $scope.loadingVisualizer = false
      $scope.loadingVisualizerErrorMsgs.push({ section: 'Visualizations Management', msg: 'Please ensure your visualizer has at least one Component and one Endpoint added!' })
    }
    /** ******** Visualizations Management **********/

    /** ******** Size Management **********/
    visResponsive = visSettings.size.responsive
    visW = parseInt(visSettings.size.width)
    visH = parseInt(visSettings.size.height)
    pad = parseInt(visSettings.size.padding)

    // check if config not empty
    if (!visW || !visH || !pad) {
      $scope.loadingVisualizerError = true
      $scope.loadingVisualizer = false
      $scope.loadingVisualizerErrorMsgs.push({ section: 'Size Management', msg: 'Please ensure all size management fields are supplied!' })
    }
    /** ******** Size Management **********/

    /** ******** Color Management **********/
    inactiveColor = visSettings.color.inactive
    activeColor = visSettings.color.active
    errorColor = visSettings.color.error
    textColor = visSettings.color.text

    // check if config not empty
    if (inactiveColor === '' || activeColor === '' || errorColor === '' || textColor === '') {
      $scope.loadingVisualizerError = true
      $scope.loadingVisualizer = false
      $scope.loadingVisualizerErrorMsgs.push({ section: 'Color Management', msg: 'Please ensure all color management fields are supplied!' })
    }
    /** ******** Color Management **********/

    /** ******** Time Management **********/
    // How often to fetch updates from the server (in millis)
    updatePeriod = parseInt(visSettings.time.updatePeriod)
    minDisplayPeriod = parseInt(visSettings.time.minDisplayPeriod)

    // play speed; 0 = normal, -1 = 2X slower, -2 = 3X slower, 1 = 2X faster, etc.
    $scope.visualizerSpeed = 0
    maxSpeed = parseInt(visSettings.time.maxSpeed)
    maxTimeout = parseInt(visSettings.time.maxTimeout)

    // check if config not empty
    if (!updatePeriod || !maxSpeed || !maxTimeout) {
      $scope.loadingVisualizerError = true
      $scope.loadingVisualizer = false
      $scope.loadingVisualizerErrorMsgs.push({ section: 'Speed Management', msg: 'Please ensure all speed management fields are supplied!' })
    }
    /** ******** Time Management **********/

    // setup watcher objects
    $scope.visualizerData = []
    $scope.visualizerSettings = {
      name: visSettings.name,
      components: components,
      channels: channels,
      mediators: mediators,
      visResponsive: visResponsive,
      visW: visW,
      visH: visH,
      pad: pad,
      inactiveColor: inactiveColor,
      activeColor: activeColor,
      errorColor: errorColor,
      textColor: textColor,
      updatePeriod: updatePeriod,
      minDisplayPeriod: minDisplayPeriod,
      speed: $scope.visualizerSpeed,
      maxSpeed: maxSpeed,
      maxTimeout: maxTimeout
    }

    // check if visualizer should be loaded - no errors found
    if ($scope.loadingVisualizer === true) {
      // visualizer loaded - change state
      $scope.loadingVisualizer = false

      // Start the visualizer
      startVisualizer()
    }
  }

  // function to play the visualizer - Pull new events
  $scope.play = function play () {
    $scope.showPlay = false
    $scope.showPause = true

    lastUpdate = (Date.now() - diffTime)
    visualizerUpdateInterval = $interval(function () {
      Api.Events.get({ receivedTime: lastUpdate }, function (events) {
        // update the visualizerData object to trigger the directive watcher and update the events
        $scope.visualizerData = events.events
        lastUpdate = (Date.now() - diffTime)
      })
    }, updatePeriod)
  }

  // function to cancel the update interval
  const cancelVisualizerUpdateInterval = function () {
    if (angular.isDefined(visualizerUpdateInterval)) {
      $interval.cancel(visualizerUpdateInterval)
      visualizerUpdateInterval = undefined
    }
  }

  // function to pause the visualizer - cancel update interval
  $scope.pause = function pause () {
    $scope.showPlay = true
    $scope.showPause = false
    cancelVisualizerUpdateInterval()
  }

  // cancel update interval when visualizer scope destroyed
  $scope.$on('$destroy', cancelVisualizerUpdateInterval)

  // funcntion to slow down animate
  $scope.slowDown = function slowDown () {
    if ($scope.visualizerSpeed > -1 * maxSpeed + 1) {
      $scope.visualizerSpeed--
    }
    $scope.speedText = $scope.setSpeedText()
  }

  // function to speed up animate
  $scope.speedUp = function speedUp () {
    if ($scope.visualizerSpeed < maxSpeed - 1) {
      $scope.visualizerSpeed++
    }
    $scope.speedText = $scope.setSpeedText()
  }

  // function to set the animate speed
  $scope.setSpeedText = function setSpeedText () {
    if ($scope.visualizerSpeed === 0) {
      return ''
    } else if ($scope.visualizerSpeed < 0) {
      return (-1 * $scope.visualizerSpeed + 1) + 'X Slower'
    } else if ($scope.visualizerSpeed > 0) {
      return ($scope.visualizerSpeed + 1) + 'X Faster'
    }
  }

  // function to add new visualizer to list
  $scope.addVisualiser = function addVisualiser () {
    Alerting.AlertReset()

    // open visualizer settings modal
    $uibModal.open({
      template: visualizerModal,
      controller: VisualizerModalCtrl,
      resolve: {
        visualizers: function () { return $scope.visualizers },
        visualizer: function () { return null },
        duplicate: function () { return null }
      }
    })
  }

  // function to edit a visualizer
  $scope.editVisualiser = function editVisualiser (vis) {
    Alerting.AlertReset()

    // open visualizer settings modal
    $uibModal.open({
      template: visualizerModal,
      controller: VisualizerModalCtrl,
      resolve: {
        visualizers: function () { return $scope.visualizers },
        visualizer: function () { return null },
        duplicate: function () { return vis }
      }
    })
  }

  // function to duplicate a visualizer
  $scope.duplicateVisualiser = function duplicateVisualiser (vis) {
    Alerting.AlertReset()

    // open visualizer settings modal
    $uibModal.open({
      template: visualizerModal,
      controller: VisualizerModalCtrl,
      resolve: {
        visualizers: function () { return $scope.visualizers },
        visualizer: function () { return vis },
        duplicate: function () { return null }
      }
    })
  }

  function fetchSessionAndVisualizers () {
    // Retrieve the session from storage
    consoleSession = localStorage.getItem('consoleSession')
    consoleSession = JSON.parse(consoleSession)
    user = null

    Api.Users.get({ email: consoleSession.sessionUser }, function (u) {
      user = u

      // visualizer list controls
      Api.Visualizers.query(function (visualizers) {
        $scope.visualizers = visualizers
        if (visualizers.length > 0) {
          $scope.selectedVis = visualizers[0]
          if (user.settings && user.settings.selectedVisualizer) {
            visualizers.forEach(function (vis) {
              if (vis.name === user.settings.selectedVisualizer) {
                $scope.selectedVis = vis
              }
            })
          }
          loadVisualizer($scope.selectedVis)
        }
      }, function (err) {
        Alerting.AlertAddServerMsg(err.status)
      })
    }, function (err) {
      Alerting.AlertAddServerMsg(err.status)
    })
  }

  $scope.isFullScreen = false

  $scope.goFullScreenViaWatcher = function () {
    $scope.isFullScreen = !$scope.isFullScreen
  }

  Fullscreen.$on('FBFullscreen.change', function (evt, isFullscreenEnabled) {
    if (isFullscreenEnabled) {
      settingsStore.visResponsive = $scope.visualizerSettings.visResponsive
      settingsStore.visW = $scope.visualizerSettings.visW
      settingsStore.visH = $scope.visualizerSettings.visH
      if ($scope.visualizerSettings.visResponsive) {
        $scope.visualizerSettings.visResponsive = false
        $scope.visualizerSettings.visW = $window.innerWidth - 2 * pad
        $scope.visualizerSettings.visH = $window.innerHeight - 8 * pad
      }
    } else {
      $scope.visualizerSettings.visResponsive = settingsStore.visResponsive
      $scope.visualizerSettings.visW = settingsStore.visW
      $scope.visualizerSettings.visH = settingsStore.visH
    }
  })

  // do the initial request
  fetchSessionAndVisualizers()

  $scope.$on('visualizersChanged', function () {
    fetchSessionAndVisualizers()
  })

  $scope.selectVis = function (vis, callback) {
    if (!callback) {
      callback = function () { }
    }

    // set current visualizer
    $scope.selectedVis = vis

    // store in current session
    if (!consoleSession.sessionUserSettings) {
      consoleSession.sessionUserSettings = {}
    }
    consoleSession.sessionUserSettings.selectedVisualizer = vis.name
    localStorage.setItem('consoleSession', JSON.stringify(consoleSession))
    // store in user settings
    if (!user.settings) {
      user.settings = {}
    }
    user.settings.selectedVisualizer = vis.name

    loadVisualizer(vis)
    Api.Users.update(user, callback)
  }

  // remove visualizer functions
  const removeVisualizer = function (vis, i) {
    $scope.visualizers.splice(i, 1)
    if (vis === $scope.selectedVis) {
      if ($scope.visualizers.length === 0) {
        $scope.selectedVis = null
      } else {
        $scope.selectVis($scope.visualizers[0])
      }
    }
    vis.$remove(function () {
      Alerting.AlertAddMsg('top', 'success', 'The visualizer has been deleted successfully')
    })
  }

  $scope.confirmRemoveVis = function (vis, i) {
    Alerting.AlertReset()

    const deleteObject = {
      title: 'Delete Visualizer',
      button: 'Delete',
      message: 'Are you sure you wish to delete this visualizer "' + vis.name + '"?'
    }

    const modalInstance = $uibModal.open({
      template: confirmModal,
      controller: ConfirmModalCtrl,
      resolve: {
        confirmObject: function () {
          return deleteObject
        }
      }
    })

    modalInstance.result.then(function () {
      // Delete confirmed - delete the visualizer
      removeVisualizer(vis, i)
    }, function () {
      // delete cancelled - do nothing
    })
  }
}
