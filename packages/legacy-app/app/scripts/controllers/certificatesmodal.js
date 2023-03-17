export function CertificatesModalCtrl ($rootScope, $scope, $uibModalInstance, $timeout, Api, Notify, Alerting, certType) {
  const textFile = null

  function notifyUser () {
    // reset backing object and refresh certificate list
    Notify.notify('certificatesChanged')
  }

  const NewBlob = function (data, datatype) {
    let out
    try {
      out = new Blob([data], { type: datatype })
    } catch (e) {
      const BlobBuilder = function () {
        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder
      }

      if (e.name === 'TypeError' && window.BlobBuilder) {
        const bb = new BlobBuilder()
        bb.append(data)
        out = bb.getBlob(datatype)
      } else if (e.name === 'InvalidStateError') {
        // InvalidStateError (tested on FF13 WinXP)
        out = new Blob([data], { type: datatype })
      } else {
        out = { error: 'Browser not supported for Blob creation' }
        // We're screwed, blob constructor unsupported entirely
      }
    }
    return out
  }

  const makeTextFile = function (text) {
    const data = new NewBlob(text, 'application/text')
    // if blob error exist
    if (data.error) {

    } else {
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile)
      }
      return window.URL.createObjectURL(data)
    }
  }

  const success = function (data) {
    Alerting.AlertAddMsg('top', 'success', 'The certificate has been created, download the key and cert below.')
    const keyLink = makeTextFile(data.key)
    $scope.downloadKeyLink = angular.copy(keyLink)
    if (keyLink) {
      const certLink = makeTextFile(data.certificate)
      if (certLink) {
        $scope.downloadCertLink = certLink
      }
    }

    notifyUser()
  }

  $scope.downloadKeyFile = function () {
    // reset download link and remove download button
    $scope.downloadKeyLink = ''
  }
  $scope.downloadCertFile = function () {
    // reset download link and remove download button
    $scope.downloadCertLink = ''
  }

  const error = function (err) {
    // add the success message
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while creating the certificate: #' + err.status + ' - ' + err.data)
    notifyUser()
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }

  $scope.validateFormCertificates = function () {
    // reset hasErrors alert object
    Alerting.AlertReset('hasErrors')

    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidation)

    $scope.ngError = {}
    $scope.ngError.hasErrors = false

    // certificate validity validation
    if (!$scope.cert.days) {
      $scope.ngError.days = true
      $scope.ngError.hasErrors = true
    }
    // commonName validation
    if (!$scope.cert.commonName) {
      $scope.ngError.commonName = true
      $scope.ngError.hasErrors = true
    }

    // country validation
    if ($scope.cert.country) {
      if ($scope.cert.country.length !== 2) {
        $scope.ngError.country = true
        $scope.ngError.hasErrors = true
      }
    }
    $scope.cert.country = $scope.cert.country.toUpperCase()
  }

  $scope.submitFormCertificate = function () {
    $scope.validateFormCertificates()
    // save the client object if no errors are present
    if ($scope.ngError.hasErrors === false) {
      $scope.save($scope.cert)
    }
  }

  $scope.cert = new Api.Certificates()
  $scope.cert.type = certType

  const saveCert = function (cert) {
    // set backup client object to check if cert has changed
    $scope.keyName = cert.commonName + '.key.pem'
    $scope.certName = cert.commonName + '.cert.crt'
    $scope.certBackup = angular.copy(cert)
    if ($scope.update) {
      cert.$update(success, error)
    } else {
      cert.$save({}, success, error)
    }
  }

  $scope.save = function (cert) {
    saveCert(cert)
  }
}
