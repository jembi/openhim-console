import { getTimeForTimezone, getTimezoneOffset } from '../utils'

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
    Alerting.AlertAddMsg('top', 'success', 'The mediator configuration was updated successfully')
    notifyUser()
  };

  function error (err) {
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the mediator config: #' + err.status + ' - ' + err.data)
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
      $scope.ngError.name = true
      $scope.ngError.basicInfoTab = true
      $scope.ngError.hasErrors = true
    }

    if ($scope.channel.maxBodyAgeDays != null && ($scope.channel.maxBodyAgeDays < 1 || $scope.channel.maxBodyAgeDays > 36500)) {
      $scope.ngError.maxBodyAgeDays = true
      $scope.ngError.dataControlTab = true
      $scope.ngError.hasErrors = true
    }

    if ($scope.channel.timeout != null && ($scope.channel.maxBodyAgeDays < 1 || $scope.channel.maxBodyAgeDays > 3600000)) {
      $scope.ngError.timeout = true
      $scope.ngError.basicInfoTab = true
      $scope.ngError.hasErrors = true
    }

    switch ($scope.channel.type) {
      case 'http':
        if (!$scope.channel.methods || $scope.channel.methods.length === 0) {
          $scope.ngError.basicInfoTab = true
          $scope.ngError.methods = true
          $scope.ngError.hasErrors = true
        }
        break
      case 'tcp':
        if (!$scope.channel.tcpHost) {
          $scope.ngError.tcpHost = true
          $scope.ngError.hasErrors = true
        }
        if (!$scope.channel.tcpPort || isNaN($scope.channel.tcpPort)) {
          $scope.ngError.tcpPort = true
          $scope.ngError.hasErrors = true
        }
        break
      case 'tls':
        if (!$scope.channel.tcpHost) {
          $scope.ngError.tcpHost = true
          $scope.ngError.hasErrors = true
        }
        if (!$scope.channel.tcpPort || isNaN($scope.channel.tcpPort)) {
          $scope.ngError.tcpPort = true
          $scope.ngError.hasErrors = true
        }
        break
      case 'polling':
        if (!$scope.channel.pollingSchedule) {
          $scope.ngError.pollingSchedule = true
          $scope.ngError.hasErrors = true
        }
        break
    }

    // roles validation
    if ($scope.channel.authType === 'private') {
      if (!$scope.channel.allow || $scope.channel.allow.length === 0) {
        $scope.ngError.allow = true
        $scope.ngError.requestMatchingTab = true
        $scope.ngError.hasErrors = true
      }
    }

    // set url-pattern to default for tcp/tls channel type
    if ($scope.channel.type === 'tcp' || $scope.channel.type === 'tls') {
      $scope.channel.urlPattern = '_' + $scope.channel.type
      $scope.urlPattern.regex = false
    }

    // urlPattern validation
    if (!$scope.channel.urlPattern) {
      $scope.ngError.urlPattern = true
      $scope.ngError.requestMatchingTab = true
      $scope.ngError.hasErrors = true
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
          $scope.ngError.matchContentRegex = true
          $scope.ngError.requestMatchingTab = true
          $scope.ngError.hasErrors = true
        }
        break
      case 'XML matching':
        if (!$scope.channel.matchContentXpath) {
          $scope.ngError.matchContentXpath = true
          $scope.ngError.requestMatchingTab = true
          $scope.ngError.hasErrors = true
        }
        if (!$scope.channel.matchContentValue) {
          $scope.ngError.matchContentValue = true
          $scope.ngError.requestMatchingTab = true
          $scope.ngError.hasErrors = true
        }
        break
      case 'JSON matching':
        if (!$scope.channel.matchContentJson) {
          $scope.ngError.matchContentJson = true
          $scope.ngError.requestMatchingTab = true
          $scope.ngError.hasErrors = true
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
      $scope.ngError.routesTab = true
      $scope.ngError.hasErrors = true
    }

    // has url rewrite errors
    if ($scope.ngError.hasUrlRewritesWarnings) {
      $scope.ngError.dataControlTab = true
      $scope.ngError.hasErrors = true
    }

    // auto retry errors
    if ($scope.channel.autoRetryEnabled) {
      if (!$scope.channel.autoRetryPeriodMinutes || $scope.channel.autoRetryPeriodMinutes <= 0) {
        $scope.ngError.autoRetryPeriodMinutes = true
        $scope.ngError.dataControlTab = true
        $scope.ngError.hasErrors = true
      }
      if ($scope.autoRetry.enableMaxAttempts &&
        (!$scope.channel.autoRetryMaxAttempts || $scope.channel.autoRetryMaxAttempts <= 0)) {
        $scope.ngError.maxAttempts = true
        $scope.ngError.dataControlTab = true
        $scope.ngError.hasErrors = true
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

// nested controller for the channel routes tab
export function channelDataControlCtrl ($scope, $timeout, Api, Alerting) {
  // store settings
  if (!$scope.update) {
    // set default variables if new channel
    $scope.channel.requestBody = true
    $scope.channel.responseBody = true
  }

  /***********************************************************/
  /**   Default Channel URL Rewrite Rule configurations     **/
  /***********************************************************/

  // if channel update is false
  if (!$scope.update) {
    // set default rewriteUrlsConfig array variable
    $scope.channel.rewriteUrlsConfig = []
    $scope.channel.rewriteUrls = false
    $scope.channel.addAutoRewriteRules = true
  } else {
    // wait for channel fetch promise to be completed
    $scope.channel.$promise.then(function () {
      if (typeof ($scope.channel.rewriteUrlsConfig) === 'undefined') {
        // set default rewriteUrlsConfig array variable
        $scope.channel.rewriteUrlsConfig = []
        $scope.channel.rewriteUrls = false
        $scope.channel.addAutoRewriteRules = true
      }
    })
  }

  $scope.urlRewriteAddEdit = false

  /***********************************************************/
  /**   Default Channel URL Rewrite Rule configurations     **/
  /***********************************************************/

  /**************************************************/
  /**   Functions for Channel URL Rewrite Rule     **/
  /**************************************************/

  $scope.resetUrlRewriteErrors = function () {
    $scope.ngErrorUrlRewrite = {}
    Alerting.AlertReset('urlRewrite')
    Alerting.AlertReset('hasErrorsUrlRewrite')
  }

  $scope.saveUrlRewrite = function (index) {
    // check for route form errors
    $scope.validateFormUrlRewrites()

    // push the route object to channel.rewriteUrlsConfig if no errors exist
    if ($scope.ngErrorUrlRewrite.hasErrors === false) {
      // if index then this is an update - delete old urlRewrite based on index
      if (typeof (index) !== 'undefined' && index !== null) {
        // remove old urlRewrite from array
        $scope.channel.rewriteUrlsConfig.splice(index, 1)
      }

      // add route to channel.rewriteUrlsConfig array
      $scope.channel.rewriteUrlsConfig.push($scope.newUrlRewrite)

      // hide add/edit box
      $scope.urlRewriteAddEdit = false

      // check for urlRewrite warnings
      $scope.checkUrlRewriteWarnings()
    } else {
      // inform parent controller of urlRewrite errors
      $scope.ngError.hasUrlRewritesWarnings = true
    }
  }

  // remove urlRewrite
  $scope.removeUrlRewrite = function (index) {
    $scope.channel.rewriteUrlsConfig.splice(index, 1)

    // check for urlRewrite warnings
    $scope.checkUrlRewriteWarnings()
  }

  // add url rewrite
  $scope.addEditUrlRewrite = function (type, object, index) {
    // reset urlRewrite errors
    $scope.resetUrlRewriteErrors()

    $scope.oldUrlRewriteIndex = null

    // create new urlRewrite object
    if (type === 'new') {
      // show add/edit box
      $scope.urlRewriteAddEdit = true

      $scope.newUrlRewrite = {
        fromHost: '',
        fromPort: '',
        toHost: '',
        toPort: '',
        pathTransform: ''
      }
    } else if (type === 'edit') {
      // show add/edit box
      $scope.urlRewriteAddEdit = true

      // set new/edit urlRewrite to supplied object
      $scope.newUrlRewrite = angular.copy(object)
      $scope.oldUrlRewriteIndex = index
    }
  }

  $scope.cancelUrlRewriteAddEdit = function () {
    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidationUrlRewrite)

    $scope.resetUrlRewriteErrors()

    // check for urlRewrite warnings
    $scope.checkUrlRewriteWarnings()

    // hide add/edit box
    $scope.urlRewriteAddEdit = false
  }

  /*********************************************/
  /**   Functions for Channel UrlRewrites     **/
  /*********************************************/

  /*********************************************************/
  /**   Functions for Channel UrlRewrites Validations     **/
  /*********************************************************/

  $scope.validateFormUrlRewrites = function () {
    // reset hasErrors alert object
    $scope.resetUrlRewriteErrors()

    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidationUrlRewrite)

    $scope.ngErrorUrlRewrite = {}
    $scope.ngErrorUrlRewrite.hasErrors = false

    // fromHost validation
    if (!$scope.newUrlRewrite.fromHost) {
      $scope.ngErrorUrlRewrite.fromHost = true
      $scope.ngErrorUrlRewrite.hasErrors = true
    }

    // fromPort validation
    let fromPortError = $scope.checkIsPortValid($scope.newUrlRewrite.fromPort)
    if (fromPortError) {
      $scope.ngErrorUrlRewrite.fromPort = true
      $scope.ngErrorUrlRewrite.portError = fromPortError
      $scope.ngErrorUrlRewrite.hasErrors = true
    }

    // toHost validation
    if (!$scope.newUrlRewrite.toHost) {
      $scope.ngErrorUrlRewrite.toHost = true
      $scope.ngErrorUrlRewrite.hasErrors = true
    }

    // toPort validation
    let toPortError = $scope.checkIsPortValid($scope.newUrlRewrite.toPort)
    if (toPortError) {
      $scope.ngErrorUrlRewrite.toPort = true
      $scope.ngErrorUrlRewrite.portError = toPortError
      $scope.ngErrorUrlRewrite.hasErrors = true
    }

    if ($scope.ngErrorUrlRewrite.hasErrors) {
      $scope.clearValidationUrlRewrite = $timeout(function () {
        // clear errors after 5 seconds
        $scope.resetUrlRewriteErrors()
        $scope.checkUrlRewriteWarnings()
      }, 5000)
      Alerting.AlertAddMsg('hasErrorsUrlRewrite', 'danger', $scope.validationFormErrorsMsg)
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

  // listen for broadcast from parent controller to check urlRewrite warnings on save
  $scope.$on('parentSaveUrlRewriteAndCheckUrlRewriteWarnings', function () {
    // if urlRewrite add/edit true then save urlRewrite and check for warning
    if ($scope.urlRewriteAddEdit === true) {
      $scope.saveUrlRewrite($scope.oldUrlRewriteIndex)
    } else {
      $scope.checkUrlRewriteWarnings()
    }
  })

  // listen for broadcast from parent controller to check urlRewrite warnings
  $scope.$on('parentCheckUrlRewriteWarnings', function () {
    $scope.checkUrlRewriteWarnings()
  })

  $scope.checkUrlRewriteWarnings = function () {
    // reset urlRewrite errors
    $scope.resetUrlRewriteErrors()
  }
  // check for urlRewrite warnings on inital load
  $scope.checkUrlRewriteWarnings()

  /*********************************************************/
  /**   Functions for Channel UrlRewrites Validations     **/
  /*********************************************************/
}

// nested controller for the channel alerts tab
export function channelAlertsCtrl ($scope, Api) {
  // watch parent scope for 'users' change
  $scope.$watch('users', function () {
    // setup usersMap options object
    $scope.usersMap = {}
    angular.forEach($scope.users, function (user) {
      $scope.usersMap[user.email] = user.firstname + ' ' + user.surname + ' (' + user.email + ')'
    })
  })

  // get the groups for the Channel Alert Group dropdown
  $scope.alertGroups = Api.ContactGroups.query(function () {
    $scope.groupsMap = {}
    angular.forEach($scope.alertGroups, function (group) {
      $scope.groupsMap[group._id] = group.group
    })
  },
    function () { /* server error - could not connect to API to get Alert Groups */ })

  /**********************************************************/
  /**   These are the functions for the Channel Alerts     **/
  /**********************************************************/

  // define the alerts backup object
  $scope.channelAlertsBackup = null
  $scope.newAlert = {}

  $scope.addAlert = function (newAlert) {
    if (!$scope.channel.alerts) {
      $scope.channel.alerts = []
    }
    $scope.channel.alerts.push(angular.copy(newAlert))
    // reset the backup route object when a record is added
    $scope.channelAlertsBackup = null

    // reset the alert object
    $scope.newAlert.status = null
    $scope.newAlert.failureRate = null
    $scope.newAlert.groups = []
    $scope.newAlert.users = []
  }

  $scope.editAlert = function (alertIndex, alert) {
    // remove the selected alert object from scope
    $scope.channel.alerts.splice(alertIndex, 1)

    // if backup object exist update alerts object with backup alert
    if ($scope.channelAlertsBackup !== null) {
      $scope.channel.alerts.push(angular.copy($scope.channelAlertsBackup))
    }
    // override backup alert object to new alert being editted
    $scope.channelAlertsBackup = angular.copy(alert)

    $scope.newAlert = alert
  }

  $scope.removeAlert = function (alertIndex) {
    $scope.channel.alerts.splice(alertIndex, 1)
  }

  $scope.isAlertValid = function () {
    if (!$scope.newAlert.condition) {
      return false
    }

    if ($scope.newAlert.condition === 'status' && !$scope.newAlert.status) {
      if (!$scope.newAlert.status) {
        return false
      }

      if ($scope.newAlert.status.length !== 3) {
        return false
      }
    }

    if ((!$scope.newAlert.users || $scope.newAlert.users.length === 0) && (!$scope.newAlert.groups || $scope.newAlert.groups.length === 0)) {
      return false
    }

    return true
  }

  /**********************************************************/
  /**   These are the functions for the Channel Alerts     **/
  /**********************************************************/

  /***************************************************************/
  /**   These are the functions for the Channel Alert Users     **/
  /***************************************************************/

  // define the alerts users backup object
  $scope.channelAlertsUsersBackup = null
  $scope.newAlertUser = {}

  $scope.addAlertUser = function (newAlertUser) {
    if (!$scope.newAlert.users) {
      $scope.newAlert.users = []
    }
    $scope.newAlert.users.push(angular.copy(newAlertUser))
    // reset the backup route object when a record is added
    $scope.channelAlertsUsersBackup = null

    // reset the backing object
    $scope.newAlertUser.user = ''
    $scope.newAlertUser.method = ''
    $scope.newAlertUser.maxAlerts = ''
  }

  $scope.editAlertUser = function (alertUserIndex, alertUser) {
    // remove the selected alert user object from scope
    $scope.newAlert.users.splice(alertUserIndex, 1)

    // if backup object exist update alerts users object with backup alert user
    if ($scope.channelAlertsUsersBackup !== null) {
      $scope.newAlert.users.push(angular.copy($scope.channelAlertsUsersBackup))
    }
    // override backup alert user object to new alert user being editted
    $scope.channelAlertsUsersBackup = angular.copy(alertUser)
    $scope.newAlertUser = alertUser
  }

  $scope.removeAlertUser = function (alertUserIndex) {
    $scope.newAlert.users.splice(alertUserIndex, 1)
  }

  $scope.isAlertUserValid = function () {
    if (!$scope.newAlertUser.user || !$scope.newAlertUser.method || !$scope.newAlertUser.maxAlerts) {
      return false
    }
    return true
  }

  /***************************************************************/
  /**   These are the functions for the Channel Alert Users     **/
  /***************************************************************/

  /****************************************************************/
  /**   These are the functions for the Channel Alert Groups     **/
  /****************************************************************/

  // define the alerts groups backup object
  $scope.newAlertGroup = {}
  $scope.newAlert.groups = []

  $scope.addAlertGroup = function (newAlertGroup) {
    if ($scope.newAlert.groups.indexOf(newAlertGroup.group) === -1) {
      $scope.newAlert.groups.push(angular.copy(newAlertGroup.group))
    }

    // reset the backing object
    $scope.newAlertGroup.group = ''
  }

  $scope.removeAlertGroup = function (alertGroupIndex) {
    $scope.newAlert.groups.splice(alertGroupIndex, 1)
  }

  $scope.isAlertGroupValid = function () {
    if (!$scope.newAlertGroup.group) {
      return false
    }
    return true
  }

  /****************************************************************/
  /**   These are the functions for the Channel Alert Groups     **/
  /****************************************************************/
}
