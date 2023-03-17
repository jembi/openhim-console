'use strict'
/* global sinon: false */

describe('Controller: CertificatesCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'))

  // setup config constant to be used for API server details
  beforeEach(function () {
    module('openhimConsoleApp', function ($provide) {
      $provide.constant('config', { protocol: 'https', host: 'localhost', hostPath: '', port: 8080, title: 'Title', footerTitle: 'FooterTitle', footerPoweredBy: 'FooterPoweredBy' })
    })
  })

  var scope, createController, httpBackend, modalSpy

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $uibModal) {
    httpBackend = $httpBackend

    httpBackend.when('GET', new RegExp('.*/keystore/cert')).respond({
      validity: {
        end: '2024-03-16T13:46:48.000Z',
        start: '2014-03-19T13:46:48.000Z'
      },
      data: '-----BEGIN CERTIFICATE-----\nMIIEFTCCAv2gAwIBAgIJALAiF9OxCN0tMA0GCSqGSIb3DQEBBQUAMIGgMQswCQYD\nVQQGEwJaQTEMMAoGA1UECAwDS1pOMQ8wDQYDVQQHDAZEdXJiYW4xITAfBgNVBAoM\nGEplbWJpIEhlYWx0aCBTeXN0ZW1zIE5QQzEQMA4GA1UECwwHZUhlYWx0aDEeMBwG\nA1UEAwwVdGVzdC1jbGllbnQuamVtYmkub3JnMR0wGwYJKoZIhvcNAQkBFg5yeWFu\nQGplbWJpLm9yZzAeFw0xNDAzMTkxMzQ2NDhaFw0yNDAzMTYxMzQ2NDhaMIGgMQsw\nCQYDVQQGEwJaQTEMMAoGA1UECAwDS1pOMQ8wDQYDVQQHDAZEdXJiYW4xITAfBgNV\nBAoMGEplbWJpIEhlYWx0aCBTeXN0ZW1zIE5QQzEQMA4GA1UECwwHZUhlYWx0aDEe\nMBwGA1UEAwwVdGVzdC1jbGllbnQuamVtYmkub3JnMR0wGwYJKoZIhvcNAQkBFg5y\neWFuQGplbWJpLm9yZzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKPB\n9eSU9vASw7a+Dk79T92PpkdWcOy7Tt4AQXoepKJRy/ip3QKxPHLekSqRRQ12maZo\n7axsctB5EoI3bGpD/a/GukaS5BE5rt5g74G6iAC24RygeOv7H86U03l06XrTyRgk\n2DGw5LZVajjaFX9630eoBnoTPxLHmNHCV94I4c1cEMZrcS6kNXH/4jtuLJGjWy9p\np9A0D7Lf/egoMmQqBQ1RVc4f43OiCyhrCVMMb2WuDPctiXZrlXopB0OPLpQOv3WO\nEzeKhA88BLSH7+Iyj6BUPazCfVaKyfrqa6iSUiXYj8lJFBhN49Pd5oPHLb6YR2Ci\nbYZcgDhGmYryruofXBcCAwEAAaNQME4wHQYDVR0OBBYEFPmmVNZYuv2Ha3m1bRtk\nxfdkuCaMMB8GA1UdIwQYMBaAFPmmVNZYuv2Ha3m1bRtkxfdkuCaMMAwGA1UdEwQF\nMAMBAf8wDQYJKoZIhvcNAQEFBQADggEBAGqyp9cvxRtrzga0Z6+hY72Vk7nsQ5FP\nF7WZ7mT8FFbM4BhZb8lIdVx/BzA4tEpFuTrRqM1k5Rp9Nn90/4mz7XLacb6usq12\nMOv5TKCzt+rmvoQv/lgdIYU1167meHIUZMgRLSrd3/sT1+NgSisIrFROiRFNt2Th\n6+KOPVkU8zpbEX5pGoiIaunBcKnEyae/iqFJTKzHK9KSZAH7roJPnuc/m1ZuPyM1\n3s5k50m/dG1mBG8igRmtEWVIA14Qh1vWT2HMb1QtR4uiFHt6CSm7K4jfpDukLa+s\nVgFoA+CfqiFgWdK5xSJq89GA4xSBFUppMqcpNDNUgSfGt/U8TY/mfGE=\n-----END CERTIFICATE-----\n',
      emailAddress: 'ryan@jembi.org',
      commonName: 'test-client.jembi.org',
      organizationUnit: 'eHealth',
      organization: 'Jembi Health Systems NPC',
      locality: 'Durban',
      state: 'KZN',
      country: 'ZA'
    })
    httpBackend.when('PUT', new RegExp('.*/channels')).respond('Channel has been successfully updated')

    httpBackend.when('GET', new RegExp('.*/keystore/ca')).respond([
      {
        country: 'ZA',
        state: 'KZN',
        locality: 'Durban',
        organization: 'Malice',
        organizationUnit: 'Hackers',
        commonName: 'hackers.fake.org',
        emailAddress: 'nope@fake.org',
        data: '-----BEGIN CERTIFICATE-----\nMIID5TCCAs2gAwIBAgIJAMUOBt7nRnSAMA0GCSqGSIb3DQEBBQUAMIGIMQswCQYD\nVQQGEwJaQTEMMAoGA1UECAwDS1pOMQ8wDQYDVQQHDAZEdXJiYW4xDzANBgNVBAoM\nBk1hbGljZTEQMA4GA1UECwwHSGFja2VyczEZMBcGA1UEAwwQaGFja2Vycy5mYWtl\nLm9yZzEcMBoGCSqGSIb3DQEJARYNbm9wZUBmYWtlLm9yZzAeFw0xNDAzMjQwNjUx\nMDJaFw0yNDAzMjEwNjUxMDJaMIGIMQswCQYDVQQGEwJaQTEMMAoGA1UECAwDS1pO\nMQ8wDQYDVQQHDAZEdXJiYW4xDzANBgNVBAoMBk1hbGljZTEQMA4GA1UECwwHSGFj\na2VyczEZMBcGA1UEAwwQaGFja2Vycy5mYWtlLm9yZzEcMBoGCSqGSIb3DQEJARYN\nbm9wZUBmYWtlLm9yZzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANTj\nmEsIQr73aW/kI/JosRo6jWqSgjaEIsiHpItxjqutZBVcYBYbHtyDvk1npk+jNOum\n7nUriTTQGf0jni3/7jGaD1kxxRekuy+oxGKcvZ0yR3rxoQZjPgmEqu68s5ZHBRlL\na1l0AM0QEXpZoWXme41qaoCw92eEfZXNyFaahWPGiBDElV3Na3tqOR+T7OBx1Oya\njPFylLKXye+79Ms2MkrZT3vgcjiJXf6OwBL9RIAHYjrvq+4+v7J8HwdyyuwD7oKj\nYFyE9YCuXGCG85NAFzM0z9hN85eMHkjzNljU4jGpuS6fpYCgQ3kfykQ/pVmCAxT8\nGVvMumIolvOVldgK+RkCAwEAAaNQME4wHQYDVR0OBBYEFKjXBp/uion+/ZsAAAt5\nQzFPadUGMB8GA1UdIwQYMBaAFKjXBp/uion+/ZsAAAt5QzFPadUGMAwGA1UdEwQF\nMAMBAf8wDQYJKoZIhvcNAQEFBQADggEBALdQSrZsGrzvDngZphQd3QVF3Mfs8A9j\nSU/7yWTrWJVmyAOoR47kyH+MtmQGYquqwmsOVRkgLvSQ+TFFqA+DQthGeogf9b6z\nShDtAfKWY8urBMVviW3xuc9azSSvt6F1LWmQVMRNUpQImBVcgu7CnJqiRcW9TCg2\nmTI2mdHSS3wiWTjy+ALpwEBbYD9vnYNPDaeiypYzIBuxM4JtN75btb1povRDF1X3\naCNjlHGHarPYwbAz+QYk5ag/7sR7yJOHP2WHgtkx9+RzcrJZSa83XTSBmlGqBwc9\nm3ZMExR5ZrgMQgGCfzUPakp7bHk4R49alV0BevmBsk6RWudv+9iVx1A=\n-----END CERTIFICATE-----\n',
        _id: '54dc7fdabf443bf8485b297c',
        validity: {
          start: '2014-03-24T06:51:02.000Z',
          end: '2024-03-21T06:51:02.000Z'
        }
      },
      {
        country: 'ZA',
        state: 'KZN',
        locality: 'Durban',
        organization: 'Jembi Health Systems NPC',
        organizationUnit: 'eHealth',
        commonName: 'test-client.jembi.org',
        emailAddress: 'ryan@jembi.org',
        data: '-----BEGIN CERTIFICATE-----\nMIIEFTCCAv2gAwIBAgIJALAiF9OxCN0tMA0GCSqGSIb3DQEBBQUAMIGgMQswCQYD\nVQQGEwJaQTEMMAoGA1UECAwDS1pOMQ8wDQYDVQQHDAZEdXJiYW4xITAfBgNVBAoM\nGEplbWJpIEhlYWx0aCBTeXN0ZW1zIE5QQzEQMA4GA1UECwwHZUhlYWx0aDEeMBwG\nA1UEAwwVdGVzdC1jbGllbnQuamVtYmkub3JnMR0wGwYJKoZIhvcNAQkBFg5yeWFu\nQGplbWJpLm9yZzAeFw0xNDAzMTkxMzQ2NDhaFw0yNDAzMTYxMzQ2NDhaMIGgMQsw\nCQYDVQQGEwJaQTEMMAoGA1UECAwDS1pOMQ8wDQYDVQQHDAZEdXJiYW4xITAfBgNV\nBAoMGEplbWJpIEhlYWx0aCBTeXN0ZW1zIE5QQzEQMA4GA1UECwwHZUhlYWx0aDEe\nMBwGA1UEAwwVdGVzdC1jbGllbnQuamVtYmkub3JnMR0wGwYJKoZIhvcNAQkBFg5y\neWFuQGplbWJpLm9yZzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKPB\n9eSU9vASw7a+Dk79T92PpkdWcOy7Tt4AQXoepKJRy/ip3QKxPHLekSqRRQ12maZo\n7axsctB5EoI3bGpD/a/GukaS5BE5rt5g74G6iAC24RygeOv7H86U03l06XrTyRgk\n2DGw5LZVajjaFX9630eoBnoTPxLHmNHCV94I4c1cEMZrcS6kNXH/4jtuLJGjWy9p\np9A0D7Lf/egoMmQqBQ1RVc4f43OiCyhrCVMMb2WuDPctiXZrlXopB0OPLpQOv3WO\nEzeKhA88BLSH7+Iyj6BUPazCfVaKyfrqa6iSUiXYj8lJFBhN49Pd5oPHLb6YR2Ci\nbYZcgDhGmYryruofXBcCAwEAAaNQME4wHQYDVR0OBBYEFPmmVNZYuv2Ha3m1bRtk\nxfdkuCaMMB8GA1UdIwQYMBaAFPmmVNZYuv2Ha3m1bRtkxfdkuCaMMAwGA1UdEwQF\nMAMBAf8wDQYJKoZIhvcNAQEFBQADggEBAGqyp9cvxRtrzga0Z6+hY72Vk7nsQ5FP\nF7WZ7mT8FFbM4BhZb8lIdVx/BzA4tEpFuTrRqM1k5Rp9Nn90/4mz7XLacb6usq12\nMOv5TKCzt+rmvoQv/lgdIYU1167meHIUZMgRLSrd3/sT1+NgSisIrFROiRFNt2Th\n6+KOPVkU8zpbEX5pGoiIaunBcKnEyae/iqFJTKzHK9KSZAH7roJPnuc/m1ZuPyM1\n3s5k50m/dG1mBG8igRmtEWVIA14Qh1vWT2HMb1QtR4uiFHt6CSm7K4jfpDukLa+s\nVgFoA+CfqiFgWdK5xSJq89GA4xSBFUppMqcpNDNUgSfGt/U8TY/mfGE=\n-----END CERTIFICATE-----\n',
        _id: '54dc807dbf443bf8485b297e',
        validity: {
          start: '2014-03-19T13:46:48.000Z',
          end: '2024-03-16T13:46:48.000Z'
        }
      }
    ])
    httpBackend.when('POST', new RegExp('.*/keystore/key')).respond('Current Server Certificate updated')
    httpBackend.when('POST', new RegExp('.*/keystore/cert')).respond('Current Server Key updated')
    httpBackend.when('POST', new RegExp('.*/keystore/ca/cert')).respond('Trusted Certificate Added')
    httpBackend.when('POST', new RegExp('.*/keystore/passphrase')).respond('Current Server Password updated')

    modalSpy = sinon.spy($uibModal, 'open')
    createController = function () {
      scope = $rootScope.$new()
      return $controller('CertificatesCtrl', { $scope: scope })
    }
  }))

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should execute add a scope object for Current Certs and for Trusted Certs', function () {
    httpBackend.when('GET', new RegExp('.*/keystore/validity')).respond({ valid: true })
    createController()
    httpBackend.flush()

    scope.currentServerCert.should.have.property('commonName', 'test-client.jembi.org')
    scope.trustedCertificates.length.should.equal(2)
    scope.certValidity.should.have.property('valid', true)
  })

  it('should execute uploadCertificate() and import the certificate', function () {
    httpBackend.when('GET', new RegExp('.*/keystore/validity')).respond({ valid: true })
    createController()
    httpBackend.flush()

    scope.trustedCertificates.length.should.equal(2)

    var certificate = '-----BEGIN CERTIFICATE-----\nMIIEFTCCAv2gAwIBAgIJALAiF9OxCN0tMA0GCSqGSIb3DQEBBQUAMIGgMQswCQYD\nVQQGEwJaQTEMMAoGA1UECAwDS1pOMQ8wDQYDVQQHDAZEdXJiYW4xITAfBgNVBAoM\nGEplbWJpIEhlYWx0aCBTeXN0ZW1zIE5QQzEQMA4GA1UECwwHZUhlYWx0aDEeMBwG\nA1UEAwwVdGVzdC1jbGllbnQuamVtYmkub3JnMR0wGwYJKoZIhvcNAQkBFg5yeWFu\nQGplbWJpLm9yZzAeFw0xNDAzMTkxMzQ2NDhaFw0yNDAzMTYxMzQ2NDhaMIGgMQsw\nCQYDVQQGEwJaQTEMMAoGA1UECAwDS1pOMQ8wDQYDVQQHDAZEdXJiYW4xITAfBgNV\nBAoMGEplbWJpIEhlYWx0aCBTeXN0ZW1zIE5QQzEQMA4GA1UECwwHZUhlYWx0aDEe\nMBwGA1UEAwwVdGVzdC1jbGllbnQuamVtYmkub3JnMR0wGwYJKoZIhvcNAQkBFg5y\neWFuQGplbWJpLm9yZzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKPB\n9eSU9vASw7a+Dk79T92PpkdWcOy7Tt4AQXoepKJRy/ip3QKxPHLekSqRRQ12maZo\n7axsctB5EoI3bGpD/a/GukaS5BE5rt5g74G6iAC24RygeOv7H86U03l06XrTyRgk\n2DGw5LZVajjaFX9630eoBnoTPxLHmNHCV94I4c1cEMZrcS6kNXH/4jtuLJGjWy9p\np9A0D7Lf/egoMmQqBQ1RVc4f43OiCyhrCVMMb2WuDPctiXZrlXopB0OPLpQOv3WO\nEzeKhA88BLSH7+Iyj6BUPazCfVaKyfrqa6iSUiXYj8lJFBhN49Pd5oPHLb6YR2Ci\nbYZcgDhGmYryruofXBcCAwEAAaNQME4wHQYDVR0OBBYEFPmmVNZYuv2Ha3m1bRtk\nxfdkuCaMMB8GA1UdIwQYMBaAFPmmVNZYuv2Ha3m1bRtkxfdkuCaMMAwGA1UdEwQF\nMAMBAf8wDQYJKoZIhvcNAQEFBQADggEBAGqyp9cvxRtrzga0Z6+hY72Vk7nsQ5FP\nF7WZ7mT8FFbM4BhZb8lIdVx/BzA4tEpFuTrRqM1k5Rp9Nn90/4mz7XLacb6usq12\nMOv5TKCzt+rmvoQv/lgdIYU1167meHIUZMgRLSrd3/sT1+NgSisIrFROiRFNt2Th\n6+KOPVkU8zpbEX5pGoiIaunBcKnEyae/iqFJTKzHK9KSZAH7roJPnuc/m1ZuPyM1\n3s5k50m/dG1mBG8igRmtEWVIA14Qh1vWT2HMb1QtR4uiFHt6CSm7K4jfpDukLa+s\nVgFoA+CfqiFgWdK5xSJq89GA4xSBFUppMqcpNDNUgSfGt/U8TY/mfGE=\n-----END CERTIFICATE-----\n'
    var totalFiles = 1
    var fileName = 'testCert.pem'
    scope.uploadType = 'trustedCerts'

    // execute the import function
    scope.uploadCertificate(JSON.stringify(certificate), totalFiles, fileName)

    scope.certificateObject.should.have.property('$save')
    scope.certificateObject.should.have.property('cert')

    httpBackend.flush()
  })

  it('should open a modal to confirm deletion of a Trusted Certificate', function () {
    httpBackend.when('GET', new RegExp('.*/keystore/validity')).respond({ valid: true })
    createController()
    httpBackend.flush()

    scope.confirmDelete(scope.trustedCertificates[0])
    modalSpy.should.have.been.calledOnce()
  })

  it('should add a passphrase', function () {
    httpBackend.when('GET', new RegExp('.*/keystore/validity')).respond({ valid: true })
    createController()
    httpBackend.flush()
    scope.serverPassphrase = 'password'
    scope.addPassphrase()
    scope.certificateObject.should.have.property('passphrase')
    httpBackend.flush()
  })

  it('should alert when the password is wrong', function () {
    httpBackend.when('GET', new RegExp('.*/keystore/validity')).respond({ valid: false })
    createController()
    httpBackend.flush()
    scope.serverPassphrase = 'password'
    scope.addPassphrase()
    scope.certValidity.should.have.property('valid', false)
    httpBackend.flush()
  })
})
