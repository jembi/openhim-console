import auditsContentModal from '~/views/auditsContentModal'
import { AuditsContentModalCtrl } from './'

export function AuditDetailsCtrl ($scope, $uibModal, $location, $routeParams, Api, Alerting, AuditLookups) {
  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  // setup audit lookup objects
  $scope.eventActionMap = AuditLookups.eventActionMap()
  $scope.eventOutcomeMap = AuditLookups.eventOutcomeMap()

  const querySuccess = function (auditDetails) {
    $scope.auditDetails = auditDetails
  }

  const queryError = function (err) {
    // on error - add server error alert
    Alerting.AlertAddServerMsg(err.status)
  }

  // get the Data for the supplied ID and store in 'auditsDetails' object
  Api.Audits.get({ auditId: $routeParams.auditId }, querySuccess, queryError)

  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  /*******************************************************************/
  /**         Transactions List and Detail view functions           **/
  /*******************************************************************/

  // setup filter options
  $scope.returnFilterObject = function () {
    const filtersObject = {}

    filtersObject.filterPage = 0
    filtersObject.filterLimit = 0
    filtersObject.parentID = $routeParams.auditId
    return filtersObject
  }

  // location provider - load audit details
  $scope.viewTransactionDetails = function (path) {
    // do audits details redirection when clicked on TD
    $location.path(path)
  }

  /*******************************************************************/
  /**         Transactions List and Detail view functions           **/
  /*******************************************************************/

  /********************************************************************/
  /**               Transactions View Body Functions                 **/
  /********************************************************************/

  $scope.viewContentDetails = function (type, content) {
    $uibModal.open({
      template: auditsContentModal,
      controller: AuditsContentModalCtrl,
      resolve: {
        auditData: function () {
          return { type: type, content: content }
        }
      }
    })
  }

  /********************************************************************/
  /**               Transactions View Body Functions                 **/
  /********************************************************************/
}
