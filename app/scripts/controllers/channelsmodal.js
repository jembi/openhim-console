const defaultHttpMethods = {
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

export function ChannelsModalCtrl ($scope, $uibModalInstance, $timeout, Api, Notify, Alerting, channel, channelDuplicate, tab) {
  function notifyUser () {
    // I have no idea what the correct channels changed is supposed to be
    Notify.notify('channelsChanged')
    $uibModalInstance.close()
  };

  function success () {
    Alerting.AlertAddMsg('top', 'success', 'The channel configuration was updated successfully')
    notifyUser()
  };

  function error (err) {
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the channel config: #' + err.status + ' - ' + err.data)
    notifyUser()
  };

  function filterEmptyAdds (operation) {
    // Only filter adds
    if (operation.op !== 'add') {
      return true
    }
    // Filter null or undefined values
    if (operation.value == null) {
      return false
    }
    // Filter empty arrays
    if (Array.isArray(operation.value) && operation.value.length === 0) {
      return false
    }
    return true
  }

  /****************************************************************/
  /**   These are the functions for the Channel initial load     **/
  /****************************************************************/

  $scope.ngError = {}

  // used in child and parent controller - ( basic info ) - define globally
  $scope.urlPattern = {}
  $scope.urlPattern.regex = true

  // used in child and parent controller - ( Content Matching ) - define globally
  $scope.matching = {}
  $scope.matching.contentMatching = 'No matching'
  $scope.matching.showRequestMatching = false

  $scope.autoRetry = {}
  $scope.autoRetry.enableMaxAttempts = false

  $scope.methods = Object.assign({}, defaultHttpMethods)

  // get the users for the Channel taglist option and alert users - used in two child controllers
  Api.Users.query(function (users) {
    $scope.users = users
  },
  function () { /* server error - could not connect to API to get Users */ })

  $scope.channelAudits = []
  if (channel) {
    $scope.update = true
    $scope.channel = Api.Channels.get({ channelId: channel._id }, function (channel) {
      $scope.autoRetry.enableMaxAttempts = channel.autoRetryMaxAttempts > 0
      populateHttpMethods(channel, $scope.methods)
    })
    Api.Channels.audits({ channelId: channel._id }, function (audits) {
      for (const audit of audits) {
        audit.ops = audit.ops.filter(filterEmptyAdds)
      }
      $scope.channelAudits = audits
    })
  } else {
    $scope.update = false
    if (channelDuplicate) {
      $scope.channelDuplicate = true
      $scope.channel = Api.Channels.get({ channelId: channelDuplicate }, function (result) {
        delete (result._id)
        delete (result.name)
        $scope.channel = result
        $scope.autoRetry.enableMaxAttempts = result.autoRetryMaxAttempts > 0
        populateHttpMethods($scope.channel, $scope.methods)
      })
    } else {
      $scope.channel = new Api.Channels()
      populateHttpMethods($scope.channel, $scope.methods)
    }
  }

  $scope.selectedTab = {}
  switch (tab) {
    case 'Basic Info': $scope.selectedTab.basicInfo = true; break
    case 'Request Matching': $scope.selectedTab.requestMatching = true; break
    case 'Routes': $scope.selectedTab.routes = true; break
    case 'Data Control': $scope.selectedTab.dataControl = true; break
    case 'Access Control': $scope.selectedTab.accessControl = true; break
    case 'Alerts': $scope.selectedTab.alerts = true; break
    case 'Logs': $scope.selectedTab.logs = true; break
    default: $scope.selectedTab.basicInfo = true; break
  }

  /****************************************************************/
  /**   These are the functions for the Channel initial load     **/
  /****************************************************************/

  /***************************************************************/
  /**   These are the functions for the Channel Modal Popup     **/
  /***************************************************************/

  $scope.saveOrUpdate = function (channel) {
    // add regex delimiter when true
    if ($scope.urlPattern.regex === true) {
      channel.urlPattern = '^' + channel.urlPattern + '$'
    }

    switch (channel.type) {
      case 'http':
        channel.pollingSchedule = null
        channel.tcpHost = null
        channel.tcpPort = null
        break
      case 'tcp':
        channel.pollingSchedule = null
        delete channel.methods
        break
      case 'tls':
        channel.pollingSchedule = null
        delete channel.methods
        break
      case 'polling':
        channel.tcpHost = null
        channel.tcpPort = null
        delete channel.methods
        break
      default:
        channel.pollingSchedule = null
        channel.tcpHost = null
        channel.tcpPort = null
        delete channel.methods
    }

    switch ($scope.matching.contentMatching) {
      case 'RegEx matching':
        channel.matchContentXpath = null
        channel.matchContentJson = null
        channel.matchContentValue = null
        break
      case 'XML matching':
        channel.matchContentRegex = null
        channel.matchContentJson = null
        break
      case 'JSON matching':
        channel.matchContentRegex = null
        channel.matchContentXpath = null
        break
      default:
        channel.matchContentRegex = null
        channel.matchContentXpath = null
        channel.matchContentJson = null
        channel.matchContentValue = null
    }

    if (channel.autoRetryEnabled && !$scope.autoRetry.enableMaxAttempts) {
      channel.autoRetryMaxAttempts = 0
    }

    if ($scope.update) {
      channel.$update(success, error)
    } else {
      channel.$save({ channelId: '' }, success, error)
    }
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }

  /***************************************************************/
  /**   These are the functions for the Channel Modal Popup     **/
  /***************************************************************/

  /***************************************************************************/
  /**   These are the general functions for the channel form validation     **/
  /***************************************************************************/

  $scope.validateFormChannels = function () {
    // reset hasErrors alert object
    Alerting.AlertReset('hasErrors')

    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidation)

    $scope.ngError.hasErrors = false

    // send broadcast to children ( routes controller ) to save route if applicable and check route warnings
    $scope.$broadcast('parentSaveRouteAndCheckRouteWarnings')
    $scope.$broadcast('parentSaveUrlRewriteAndCheckUrlRewriteWarnings')

    // name validation
    if (!$scope.channel.name) {
      $scope.ngError.hasErrors = true
      $scope.ngError.basicInfoTab = true
      $scope.ngError.name = true
    }

    if ($scope.channel.maxBodyAgeDays != null && ($scope.channel.maxBodyAgeDays < 1 || $scope.channel.maxBodyAgeDays > 36500)) {
      $scope.ngError.hasErrors = true
      $scope.ngError.dataControlTab = true
      $scope.ngError.maxBodyAgeDays = true
    }

    if ($scope.channel.timeout != null && ($scope.channel.maxBodyAgeDays < 1 || $scope.channel.maxBodyAgeDays > 3600000)) {
      $scope.ngError.hasErrors = true
      $scope.ngError.basicInfoTab = true
      $scope.ngError.timeout = true
    }

    switch ($scope.channel.type) {
      case 'http':
        if (!$scope.channel.methods || $scope.channel.methods.length === 0) {
          $scope.ngError.hasErrors = true
          $scope.ngError.basicInfoTab = true
          $scope.ngError.methods = true
        }
        break
      case 'tcp':
        if (!$scope.channel.tcpHost) {
          $scope.ngError.hasErrors = true
          $scope.ngError.basicInfoTab = true
          $scope.ngError.tcpHost = true
        }
        if (!$scope.channel.tcpPort || isNaN($scope.channel.tcpPort)) {
          $scope.ngError.hasErrors = true
          $scope.ngError.basicInfoTab = true
          $scope.ngError.tcpPort = true
        }
        break
      case 'tls':
        if (!$scope.channel.tcpHost) {
          $scope.ngError.hasErrors = true
          $scope.ngError.basicInfoTab = true
          $scope.ngError.tcpHost = true
        }
        if (!$scope.channel.tcpPort || isNaN($scope.channel.tcpPort)) {
          $scope.ngError.hasErrors = true
          $scope.ngError.basicInfoTab = true
          $scope.ngError.tcpPort = true
        }
        break
      case 'polling':
        if (!$scope.channel.pollingSchedule) {
          $scope.ngError.hasErrors = true
          $scope.ngError.basicInfoTab = true
          $scope.ngError.pollingSchedule = true
        }
        break
    }

    // roles validation
    if ($scope.channel.authType === 'private') {
      if (!$scope.channel.allow || $scope.channel.allow.length === 0) {
        $scope.ngError.hasErrors = true
        $scope.ngError.requestMatchingTab = true
        $scope.ngError.allow = true
      }
    }

    // set url-pattern to default for tcp/tls channel type
    if ($scope.channel.type === 'tcp' || $scope.channel.type === 'tls') {
      $scope.channel.urlPattern = '_' + $scope.channel.type
      $scope.urlPattern.regex = false
    }

    // urlPattern validation
    if (!$scope.channel.urlPattern) {
      $scope.ngError.hasErrors = true
      $scope.ngError.requestMatchingTab = true
      $scope.ngError.urlPattern = true
    }

    // reset contentMatching if request matching not visible
    if (!$scope.matching.showRequestMatching) {
      $scope.matching.contentMatching = 'No matching'
      $scope.channel.matchContentRegex = null
      $scope.channel.matchContentXpath = null
      $scope.channel.matchContentValue = null
      $scope.channel.matchContentJson = null
    }

    switch ($scope.matching.contentMatching) {
      case 'RegEx matching':
        if (!$scope.channel.matchContentRegex) {
          $scope.ngError.hasErrors = true
          $scope.ngError.requestMatchingTab = true
          $scope.ngError.matchContentRegex = true
        }
        break
      case 'XML matching':
        if (!$scope.channel.matchContentXpath) {
          $scope.ngError.hasErrors = true
          $scope.ngError.requestMatchingTab = true
          $scope.ngError.matchContentXpath = true
        }
        if (!$scope.channel.matchContentValue) {
          $scope.ngError.hasErrors = true
          $scope.ngError.requestMatchingTab = true
          $scope.ngError.matchContentValue = true
        }
        break
      case 'JSON matching':
        if (!$scope.channel.matchContentJson) {
          $scope.ngError.hasErrors = true
          $scope.ngError.requestMatchingTab = true
          $scope.ngError.matchContentJson = true
        }
        if (!$scope.channel.matchContentValue) {
          $scope.ngError.matchContentValue = true
          $scope.ngError.requestMatchingTab = true
          $scope.ngError.hasErrors = true
        }
        break
    }

    // has route errors
    if ($scope.ngError.hasRouteWarnings) {
      $scope.ngError.hasErrors = true
      $scope.ngError.routesTab = true
    }

    // has url rewrite errors
    if ($scope.ngError.hasUrlRewritesWarnings) {
      $scope.ngError.hasErrors = true
      $scope.ngError.dataControlTab = true
    }

    // auto retry errors
    if ($scope.channel.autoRetryEnabled) {
      if (!$scope.channel.autoRetryPeriodMinutes || $scope.channel.autoRetryPeriodMinutes <= 0) {
        $scope.ngError.hasErrors = true
        $scope.ngError.dataControlTab = true
        $scope.ngError.autoRetryPeriodMinutes = true
      }
      if ($scope.autoRetry.enableMaxAttempts &&
        (!$scope.channel.autoRetryMaxAttempts || $scope.channel.autoRetryMaxAttempts <= 0)) {
        $scope.ngError.hasErrors = true
        $scope.ngError.dataControlTab = true
        $scope.ngError.maxAttempts = true
      }
    }

    if ($scope.ngError.hasErrors) {
      $scope.clearValidation = $timeout(function () {
        // clear errors after 5 seconds
        $scope.ngError = {}
        Alerting.AlertReset('hasErrors')

        // send broadcast to children ( routes controller ) to check route warnings
        $scope.$broadcast('parentCheckRouteWarnings')
      }, 5000)
      Alerting.AlertAddMsg('hasErrors', 'danger', $scope.validationFormErrorsMsg)
    }
  }

  $scope.addHttpMethodsToChannel = function () {
    $scope.channel.methods = Object.keys($scope.methods).filter(function (key) {
      return $scope.methods[key]
    })
  }

  $scope.submitFormChannels = function () {
    // clear channel errors that might be old and check fresh validate
    $scope.ngError = {}
    Alerting.AlertReset('hasErrors')
    $scope.addHttpMethodsToChannel()

    // validate the form first to check for any errors
    $scope.validateFormChannels()

    // save the channel object if no errors are present
    if ($scope.ngError.hasErrors === false) {
      $scope.saveOrUpdate($scope.channel)
    }
  }

  /***************************************************************************/
  /**   These are the general functions for the channel form validation     **/
  /***************************************************************************/
}

function populateHttpMethods (channel, methods) {
  if (channel.methods) {
    for (const channelMethod of channel.methods) {
      if (channelMethod) {
        methods[channelMethod] = true
      }
    }
  } else {
    Object.keys(methods).forEach(function (key) {
      methods[key] = true
    })
  }
  return methods
}
