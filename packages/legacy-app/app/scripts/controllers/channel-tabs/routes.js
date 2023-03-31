export function channelRoutesCtrl ($scope, $timeout, Api, Alerting) {
  /*************************************************/
  /**   Default Channel Routes configurations     **/
  /*************************************************/

  // if channel update is false
  if (!$scope.update) {
    // set default routes array variable
    $scope.channel.routes = []
  }

  $scope.selected = {}
  $scope.mediatorRoutes = []
  $scope.routeAddEdit = false

  // get the mediators for the route option
  Api.Mediators.query(function (mediators) {
    // foreach mediator
    angular.forEach(mediators, function (mediator) {
      // foreach endpoint in the mediator
      angular.forEach(mediator.endpoints, function (endpoint) {
        $scope.mediatorRoutes.push({ fullName: mediator.name + ' - ' + endpoint.name, mediator: mediator.urn, endpoint: endpoint })
      })
    })
  }, function () { /* server error - could not connect to API to get Mediators */ })

  // get the Trusted Certificates for the Channel routes cert dropdown
  Api.Keystore.query({ type: 'ca' }, function (result) {
    $scope.trustedCerts = []
    angular.forEach(result, function (cert) {
      $scope.trustedCerts.push({ _id: cert._id, commonName: 'cn=' + cert.commonName })
    })
  },
  function () { /* server error - could not connect to API to get Trusted Certificates */ })

  /*************************************************/
  /**   Default Channel Routes configurations     **/
  /*************************************************/

  /****************************************/
  /**   Functions for Channel Routes     **/
  /****************************************/

  $scope.resetRouteErrors = function () {
    $scope.ngErrorRoute = {}
    Alerting.AlertReset('route')
    Alerting.AlertReset('hasErrorsRoute')
  }

  $scope.saveRoute = function (index) {
    // check for route form errors
    $scope.validateFormRoutes()

    // push the route object to channel.routes if no errors exist
    if ($scope.ngErrorRoute.hasErrors === false) {
      // if index then this is an update - delete old route based on idex
      if (typeof (index) !== 'undefined' && index !== null) {
        // remove old route from array
        $scope.channel.routes.splice(index, 1)
      }

      // add route to channel.routes array
      $scope.channel.routes.push($scope.newRoute)

      // hide add/edit box
      $scope.routeAddEdit = false

      // check for route warnings
      $scope.checkRouteWarnings()
    } else {
      // inform parent controller of route errors
      $scope.ngError.hasRouteWarnings = true
    }
  }

  // remove route
  $scope.removeRoute = function (index) {
    $scope.channel.routes.splice(index, 1)

    // check for route warnings
    $scope.checkRouteWarnings()
  }

  // add route
  $scope.addEditRoute = function (type, object, index) {
    // reset route errors
    $scope.resetRouteErrors()

    $scope.oldRouteIndex = null

    // declare variable for primary route
    let primary

    // create new route object
    if (type === 'new') {
      // show add/edit box
      $scope.routeAddEdit = true

      // if no routes exist yet then make mediator primary
      primary = false
      if ($scope.channel.routes.length === 0) {
        primary = true
      }

      $scope.newRoute = {
        name: '',
        secured: false,
        host: '',
        port: '',
        path: '',
        pathTransform: '',
        primary: primary,
        username: '',
        password: '',
        type: 'http',
        status: 'enabled',
        forwardAuthHeader: false
      }
    } else if (type === 'edit') {
      // show add/edit box
      $scope.routeAddEdit = true

      // set new/edit route to supplied object
      $scope.newRoute = angular.copy(object)
      $scope.oldRouteIndex = index
    }
  }

  $scope.addRouteFromMediator = function () {
    $scope.resetRouteErrors()
    $scope.oldRouteIndex = null

    // dont show add/edit box for mediator add - push directly to channel routes
    $scope.routeAddEdit = false

    // set defaults
    let primary = false
    let name = ''
    let secured = false
    let host = ''
    let port = ''
    let path = ''
    let pathTransform = ''
    let username = ''
    let password = ''
    let routeType = 'http'
    let forwardAuthHeader = false

    if ($scope.selected.mediatorRoute.endpoint.name) { name = $scope.selected.mediatorRoute.endpoint.name }
    if ($scope.selected.mediatorRoute.endpoint.secured) { secured = $scope.selected.mediatorRoute.endpoint.secured }
    if ($scope.selected.mediatorRoute.endpoint.host) { host = $scope.selected.mediatorRoute.endpoint.host }
    if ($scope.selected.mediatorRoute.endpoint.port) { port = $scope.selected.mediatorRoute.endpoint.port }
    if ($scope.selected.mediatorRoute.endpoint.path) { path = $scope.selected.mediatorRoute.endpoint.path }
    if ($scope.selected.mediatorRoute.endpoint.pathTransform) { pathTransform = $scope.selected.mediatorRoute.endpoint.pathTransform }
    if ($scope.selected.mediatorRoute.endpoint.username) { username = $scope.selected.mediatorRoute.endpoint.username }
    if ($scope.selected.mediatorRoute.endpoint.password) { password = $scope.selected.mediatorRoute.endpoint.password }
    if ($scope.selected.mediatorRoute.endpoint.type) { routeType = $scope.selected.mediatorRoute.endpoint.type }
    if ($scope.selected.mediatorRoute.endpoint.forwardAuthHeader) { forwardAuthHeader = $scope.selected.mediatorRoute.endpoint.forwardAuthHeader }

    // if no routes exist yet then make mediator primary
    if ($scope.channel.routes.length === 0) {
      primary = true
    }

    // add mediator to channel.routes array
    $scope.channel.routes.push({
      name: name,
      secured: secured,
      host: host,
      port: port,
      path: path,
      pathTransform: pathTransform,
      primary: primary,
      username: username,
      password: password,
      type: routeType,
      status: 'enabled',
      forwardAuthHeader: forwardAuthHeader
    })
  }

  $scope.cancelRouteAddEdit = function () {
    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidationRoute)

    $scope.resetRouteErrors()

    // check for route warnings
    $scope.checkRouteWarnings()

    // hide add/edit box
    $scope.routeAddEdit = false
  }

  $scope.onRouteDisable = function (route) {
    route.primary = false
  }

  /****************************************/
  /**   Functions for Channel Routes     **/
  /****************************************/

  /****************************************************/
  /**   Functions for Channel Routes Validations     **/
  /****************************************************/

  $scope.validateFormRoutes = function () {
    // reset hasErrors alert object
    $scope.resetRouteErrors()

    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidationRoute)

    $scope.ngErrorRoute = {}
    $scope.ngErrorRoute.hasErrors = false

    // name validation
    if (!$scope.newRoute.name) {
      $scope.ngErrorRoute.name = true
      $scope.ngErrorRoute.hasErrors = true
    }

    // host validation
    if (!$scope.newRoute.host) {
      $scope.ngErrorRoute.host = true
      $scope.ngErrorRoute.hasErrors = true
    }

    // port validation
    const portError = $scope.checkIsPortValid($scope.newRoute.port)
    if (portError) {
      $scope.ngErrorRoute.port = true
      $scope.ngErrorRoute.portError = portError
      $scope.ngErrorRoute.hasErrors = true
    }

    // path/transform validation
    const pathTransformError = $scope.checkPathTransformPathSet($scope.newRoute)
    if (pathTransformError) {
      $scope.ngErrorRoute.pathTransform = true
      $scope.ngErrorRoute.pathTransformError = pathTransformError
      $scope.ngErrorRoute.hasErrors = true
    }

    if ($scope.ngErrorRoute.hasErrors) {
      $scope.clearValidationRoute = $timeout(function () {
        // clear errors after 5 seconds
        $scope.resetRouteErrors()
        $scope.checkRouteWarnings()
      }, 5000)
      Alerting.AlertAddMsg('hasErrorsRoute', 'danger', $scope.validationFormErrorsMsg)
    }
  }

  // check required fields for empty inputs
  $scope.checkIsPortValid = function (value) {
    if (value !== '' && value !== undefined) {
      if (isNaN(value)) {
        // return error message
        return 'Only numbers allowed!'
      } else {
        if (value <= 0 || value > 65536) {
          return 'Not in valid port range!'
        }
      }
    } else {
      return 'This field is required!'
    }
  }

  // check both path and pathTransform isnt supplied
  $scope.checkPathTransformPathSet = function (route) {
    // if both supplied
    if (route.path && route.pathTransform) {
      // return error message
      return 'Cant supply both!'
    }
  }

  $scope.noRoutes = function () {
    // no routes found - return true
    if (!$scope.channel.routes || $scope.channel.routes.length === 0) {
      Alerting.AlertAddMsg('route', 'warning', 'You must supply atleast one route.')
      return true
    }
    return false
  }

  const isRouteEnabled = function (route) {
    return (typeof route.status === 'undefined' || route.status === null) || route.status === 'enabled'
  }

  $scope.noPrimaries = function () {
    if ($scope.channel.routes) {
      for (let i = 0; i < $scope.channel.routes.length; i++) {
        if (isRouteEnabled($scope.channel.routes[i]) && $scope.channel.routes[i].primary === true) {
          // atleast one primary so return false
          return false
        }
      }
    }
    // return true if no primary routes found
    Alerting.AlertAddMsg('route', 'warning', 'At least one of your enabled routes must be set to primary.')
    return true
  }

  $scope.multiplePrimaries = function () {
    if ($scope.channel.routes) {
      const routes = $scope.channel.routes
      let count = 0
      for (let i = 0; i < routes.length; i++) {
        if (isRouteEnabled(routes[i]) && routes[i].primary === true) {
          count++
        }

        if (count > 1) {
          Alerting.AlertAddMsg('route', 'warning', 'You cannot have multiple primary routes.')
          return true
        }
      }
    }

    return false
  }

  // listen for broadcast from parent controller to check route warnings on save
  $scope.$on('parentSaveRouteAndCheckRouteWarnings', function () {
    // if route add/edit true then save route and check for warning
    if ($scope.routeAddEdit === true) {
      $scope.saveRoute($scope.oldRouteIndex)
    } else {
      $scope.checkRouteWarnings()
    }
  })

  // listen for broadcast from parent controller to check route warnings
  $scope.$on('parentCheckRouteWarnings', function () {
    $scope.checkRouteWarnings()
  })

  $scope.checkRouteWarnings = function () {
    // reset route errors
    $scope.resetRouteErrors()

    const noRoutes = $scope.noRoutes()
    const noPrimaries = $scope.noPrimaries()
    const multiplePrimaries = $scope.multiplePrimaries()

    if (noRoutes || noPrimaries || multiplePrimaries) {
      $scope.ngError.hasRouteWarnings = true
    }
  }

  // check for route warnings on inital load
  if ($scope.update) {
    // make sure promise is completed before checking
    $scope.channel.$promise.then(function () {
      $scope.checkRouteWarnings()
    })
  } else {
    $scope.checkRouteWarnings()
  }

  /****************************************************/
  /**   Functions for Channel Routes Validations     **/
  /****************************************************/
}
