import mediatorConfigModal from '~/views/mediatorConfigModal'
import { MediatorConfigModalCtrl } from './'

export function MediatorDetailsCtrl ($rootScope, $scope, $uibModal, $location, $routeParams, Api, Alerting, MediatorDisplay) {
  const createParamDefMap = function (mediator) {
    const map = {}
    if (mediator.config) {
      Object.keys(mediator.config).map(function (param) {
        map[param] = mediator.configDefs.filter(function (def) {
          return def.param === param
        })[0]
      })
    }
    return map
  }

  const querySuccess = function (mediatorDetails) {
    MediatorDisplay.formatMediator(mediatorDetails)
    $scope.mediatorDetails = mediatorDetails
    $scope.mediatorDefsMap = createParamDefMap(mediatorDetails)
  }

  const queryError = function (err) {
    // on error - add server error alert
    Alerting.AlertAddServerMsg(err.status)
  }

  $scope.$on('mediatorConfigChanged', function () {
    Api.Mediators.get({ urn: $routeParams.urn }, querySuccess, queryError)
  })

  // get the Data for the supplied ID and store in 'mediatorDetails' object
  Api.Mediators.get({ urn: $routeParams.urn }, querySuccess, queryError)

  $scope.editMediatorConfig = function () {
    Alerting.AlertReset()

    $uibModal.open({
      template: mediatorConfigModal,
      controller: MediatorConfigModalCtrl,
      resolve: {
        mediator: function () {
          return $scope.mediatorDetails
        }
      }
    })
  }

  $scope.addChannel = function (channelName) {
    Alerting.AlertReset('top')
    Api.MediatorChannels.save({ urn: $routeParams.urn }, [channelName], function () {
      Alerting.AlertAddMsg('top', 'success', 'Successfully installed mediator channel')
    }, function () {
      Alerting.AlertAddMsg('top', 'danger', 'Oops, something went wrong. Could not install mediator channel.')
    })
  }
}
