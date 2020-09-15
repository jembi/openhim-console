import visualizerConfig from '../../config/visualizer.json'

export function VisualizerModalCtrl ($http, $scope, $uibModalInstance, $timeout, Api, Notify, Alerting, visualizers, visualizer, duplicate) {
  $scope.ngError = {}
  $scope.validationRequiredMsg = 'This field is required.'

  // get/set the users scope whether new or update
  if (visualizer) {
    $scope.update = true
    // make a copy of the object so that the original doesn't get changed until we save
    $scope.visualizer = JSON.parse(angular.toJson(visualizer))
  } else if (duplicate) {
    $scope.update = false
    // make a copy of the object so that the original doesn't get changed until we save
    duplicate = JSON.parse(angular.toJson(duplicate))
    delete (duplicate._id)
    delete (duplicate.name)
    $scope.visualizer = duplicate
  } else {
    $scope.update = false

    // create visualizer settings properties
    $scope.visualizer = {}

    // load default visualizer config for new user
    // TODO : See if it's ok to have a compile step or if this setting needed to be changed whilst running
    angular.extend($scope.visualizer, angular.copy(visualizerConfig))
  }

  $scope.cancel = function () {
    $timeout.cancel($scope.clearValidationRoute)
    $uibModalInstance.dismiss('cancel')
  }

  // get the allowed channels for the transaction settings
  Api.Channels.query(function (channels) {
    $scope.channels = channels

    $scope.primaryRoutes = []
    $scope.secondaryRoutes = []

    angular.forEach(channels, function (channel) {
      angular.forEach(channel.routes, function (route) {
        if (route.primary) {
          if ($scope.primaryRoutes.indexOf(route.name) < 0) {
            $scope.primaryRoutes.push(route.name)
          }
        } else {
          if ($scope.secondaryRoutes.indexOf(route.name) < 0) {
            $scope.secondaryRoutes.push(route.name)
          }
        }
      })
    })
  }, function () { /* server error - could not connect to API to get channels */ })

  Api.Mediators.query(function (mediators) {
    $scope.mediators = mediators
  }, function () { /* server error - could not connect to API to get mediators */ })

  // setup visualizer object
  $scope.viewModel = {}

  $scope.addSelectedChannel = function () {
    $scope.visualizer.channels.push({ eventType: 'channel', eventName: $scope.viewModel.addSelectChannel.name, display: $scope.viewModel.addSelectChannel.name })
    $scope.viewModel.addSelectChannel = null
  }

  $scope.addSelectedMediator = function () {
    $scope.visualizer.mediators.push({ mediator: $scope.viewModel.addSelectMediator.urn, name: $scope.viewModel.addSelectMediator.name, display: $scope.viewModel.addSelectMediator.name })
    $scope.viewModel.addSelectMediator = null
  }

  $scope.addComponent = function () {
    if ($scope.viewModel.addComponent.eventType) {
      $scope.visualizer.components.push({ eventType: $scope.viewModel.addComponent.eventType, eventName: $scope.viewModel.addComponent.eventName, display: $scope.viewModel.addComponent.display })
      $scope.viewModel.addComponent.eventType = ''
      $scope.viewModel.addComponent.eventName = ''
      $scope.viewModel.addComponent.display = ''
    }
  }

  $scope.removeComponent = function (index) {
    $scope.visualizer.components.splice(index, 1)
  }

  $scope.removeChannel = function (index) {
    $scope.visualizer.channels.splice(index, 1)
  }

  $scope.removeMediator = function (index) {
    $scope.visualizer.mediators.splice(index, 1)
  }

  $scope.validateVisualizer = function (viz, callback) {
    // reset hasErrors alert object
    Alerting.AlertReset('hasErrors')
    let errorMessage

    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidation)

    $scope.ngError.hasErrors = false

    // required fields validation
    if (!viz.name) {
      $scope.ngError.hasNoName = true
      $scope.ngError.hasErrors = true
      errorMessage = 'Give me a name please :)'
    } else {
      if (!$scope.update) {
        // the visualizer name must be unique
        const result = visualizers.filter(function (obj) {
          return obj.name === viz.name
        })

        if (result.length > 0) {
          $scope.ngError.nameNotUnique = true
          $scope.ngError.hasErrors = true
          errorMessage = 'Give me a unique name please :p'
        }
      }
    }

    if (viz.components === undefined || viz.components.length === 0) {
      $scope.ngError.hasErrors = true
      $scope.ngError.hasNoComponents = true
      errorMessage = 'Give me a component please :D'
    }

    if (viz.channels === undefined || viz.channels.length === 0) {
      $scope.ngError.hasErrors = true
      $scope.ngError.hasNoChannels = true
      errorMessage = 'Give me a channel please :}'
    }

    if ($scope.ngError.hasErrors) {
      $scope.clearValidation = $timeout(function () {
        // clear errors after 5 seconds
        $scope.ngError = {}
        Alerting.AlertReset('hasErrors')
      }, 5000)
      Alerting.AlertAddMsg('hasErrors', 'danger', errorMessage)
      const message = 'Error: Form has errors'
      callback(message)
    } else {
      callback()
    }
  }

  const notifyUser = function () {
    // reset backing object and refresh users list
    Notify.notify('visualizersChanged')
    $uibModalInstance.close()
  }

  const success = function () {
    // add the success message
    Alerting.AlertAddMsg('top', 'success', 'The visualizer has been saved successfully')

    notifyUser()
  }

  const error = function () {
    // add the success message
    Alerting.AlertAddMsg('top', 'danger', 'Failed to save the visualizer details because the visualizer name is not unique. Please try again.')

    notifyUser()
  }

  $scope.saveVisualizer = function () {
    // validate form input
    $scope.validateVisualizer($scope.visualizer, function (err) {
      if (!err) {
        // save visualizer settings
        if ($scope.update) {
          Api.Visualizers.update($scope.visualizer, success, error)
        } else {
          Api.Visualizers.save({ name: '' }, $scope.visualizer, success, error)
        }
      }
    })
  }
}
