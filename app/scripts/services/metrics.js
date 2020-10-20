'use strict'
import moment from 'moment'

export function Metrics () {
  return {
    refreshDatesForSelectedPeriod: function (selectedPeriod) {
      if (selectedPeriod.period === '1h') {
        selectedPeriod.from = moment().subtract(1, 'hour').toDate()
        selectedPeriod.until = moment().toDate()
        selectedPeriod.type = 'minute'
      } else if (selectedPeriod.period === '1d') {
        selectedPeriod.from = moment().subtract(1, 'day').toDate()
        selectedPeriod.until = moment().toDate()
        selectedPeriod.type = 'hour'
      } else if (selectedPeriod.period === '1w') {
        selectedPeriod.from = moment().subtract(1, 'week').toDate()
        selectedPeriod.until = moment().toDate()
        selectedPeriod.type = 'day'
      } else if (selectedPeriod.period === '1m') {
        selectedPeriod.from = moment().subtract(1, 'month').toDate()
        selectedPeriod.until = moment().toDate()
        selectedPeriod.type = 'day'
      } else if (selectedPeriod.period === '1y') {
        selectedPeriod.from = moment().subtract(1, 'year').toDate()
        selectedPeriod.until = moment().toDate()
        selectedPeriod.type = 'month'
      } else if (selectedPeriod.period === '5y') {
        selectedPeriod.from = moment().subtract(5, 'years').toDate()
        selectedPeriod.until = moment().toDate()
        selectedPeriod.type = 'month'
      }
    },

    buildLineChartData: function (selectedPeriod, metrics, key, label, valueFormatter) {
      const graphData = []
      const from = moment(selectedPeriod.from)
      const until = moment(selectedPeriod.until)
      const unit = selectedPeriod.type + 's'
      let avgResponseTimeTotal = 0

      let loadTotal = 0
      let avgResponseTime = 0

      const diff = Math.abs(from.diff(until, unit))
      for (let i = 0; i <= diff; i++) {
        const timestamp = from.clone().add(i, unit)
        let value = 0

        for (let j = 0; j < metrics.length; j++) {
          const ts = moment(metrics[j].timestamp)

          if (timestamp.isSame(ts, selectedPeriod.type)) {
            value = metrics[j][key]
            if (valueFormatter) {
              value = valueFormatter(value)
            }
            loadTotal += metrics[j].total
            avgResponseTimeTotal += metrics[j].avgResp
          }
        }

        graphData.push({ timestamp: timestamp.format('YYYY-MM-DD HH:mm'), value: value })
      }

      avgResponseTime = (avgResponseTimeTotal / metrics.length).toFixed(2)
      return {
        data: graphData,
        xkey: 'timestamp',
        ykeys: ['value'],
        labels: [label],
        loadTotal: loadTotal,
        avgResponseTime: avgResponseTime
      }
    }
  }
}
