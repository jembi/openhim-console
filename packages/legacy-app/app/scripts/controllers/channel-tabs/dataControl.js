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
    const fromPortError = $scope.checkIsPortValid($scope.newUrlRewrite.fromPort)
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
    const toPortError = $scope.checkIsPortValid($scope.newUrlRewrite.toPort)
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
