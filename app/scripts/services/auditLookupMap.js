'use strict'

angular.module('openhimConsoleApp')
  .factory('AuditLookups', function () {
    return {
      eventActionMap: function () {
        var eventActionMap = {}
        eventActionMap.C = 'Create (C)'
        eventActionMap.R = 'Read (R)'
        eventActionMap.U = 'Update (U)'
        eventActionMap.D = 'Delete (D)'
        eventActionMap.E = 'Execute (E)'

        return eventActionMap
      },
      eventOutcomeMap: function () {
        var eventOutcomeMap = {}
        eventOutcomeMap[0] = 'Success (0)'
        eventOutcomeMap[4] = 'Minor Failure (4)'
        eventOutcomeMap[8] = 'Serious Failure (8)'
        eventOutcomeMap[12] = 'Major Failure (12)'

        return eventOutcomeMap
      }

    }
  })
