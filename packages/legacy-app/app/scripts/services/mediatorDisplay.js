import moment from 'moment'

export function MediatorDisplay (config) {
  const _formatMediator = function (mediator) {
    const secondsDiffNow = function () {
      return Math.abs(Date.now() - moment(mediator._lastHeartbeat)) / 1000
    }

    if (!mediator._lastHeartbeat) {
      mediator.lastHeartbeatStatus = 'never'
      mediator.lastHeartbeatDisplayExplain = 'No heartbeats have ever been received from this mediator. Perhaps it doesn\'t support heartbeats.'
    } else {
      if (moment(mediator._lastHeartbeat).isAfter(Date.now())) {
        mediator.lastHeartbeatStatus = 'warning'
        mediator.lastHeartbeatDisplayExplain = 'Heartbeat set in the future'
      } else if (secondsDiffNow() < config.mediatorLastHeartbeatWarningSeconds) {
        mediator.lastHeartbeatStatus = 'success'
      } else if (secondsDiffNow() < config.mediatorLastHeartbeatDangerSeconds) {
        mediator.lastHeartbeatStatus = 'warning'
        mediator.lastHeartbeatDisplayExplain = 'No heartbeats received in over ' + config.mediatorLastHeartbeatWarningSeconds + ' s'
      } else {
        mediator.lastHeartbeatStatus = 'danger'
        mediator.lastHeartbeatDisplayExplain = 'No heartbeats received in over ' + config.mediatorLastHeartbeatDangerSeconds + ' s'
      }
      mediator.lastHeartbeatDisplay = moment(mediator._lastHeartbeat).fromNow()
    }

    if (mediator._uptime) {
      // generate human-friendly display string, e.g. 4 days
      mediator.uptimeDisplay = moment().subtract(mediator._uptime, 'seconds').fromNow(true)
      mediator.uptimeSince = moment(mediator._lastHeartbeat).subtract(mediator._uptime, 'seconds').toDate()
    }
  }

  return {
    formatMediator: _formatMediator,

    formatMediators: function (mediators) {
      angular.forEach(mediators, _formatMediator)
    }
  }
}
