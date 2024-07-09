import InfoIcon from '@mui/icons-material/Info'
import {Card, CardContent, CardHeader, Grid, Typography} from '@mui/material'
import {LineChart} from '@mui/x-charts/LineChart'
import {
  add,
  format,
  isSameDay,
  isSameHour,
  isSameMinute,
  isSameMonth,
  isSameWeek,
  isSameYear
} from 'date-fns'
import {TimeSeries, TimeSeriesScale} from '../../types'
import {getTimeDiffScale} from '../../utils'

export type TransactionLineChartType = 'load' | 'avgResponseTime'

export type TransactionLineChartProps = {
  period: {from: Date; until: Date; type: TimeSeriesScale}
  data: TimeSeries[]
  type: TransactionLineChartType
}

export default function TransactionLineChart(props: TransactionLineChartProps) {
  const buildChartData = () => {
    const graphData = []
    const {diff, scale} = getTimeDiffScale(
      props.period.from,
      props.period.until
    )

    for (let i = 0; i < diff; i++) {
      const timestamp = add(props.period.from, {[`${scale}s`]: 1 * (i + 1)})
      let Y = 0
      const X = timestamp

      for (let j = 0; j < props.data.length; j++) {
        const ts = new Date(props.data[j].timestamp)
        const eq =
          (scale == TimeSeriesScale.year && isSameYear(ts, timestamp)) ||
          (scale == TimeSeriesScale.month && isSameMonth(ts, timestamp)) ||
          (scale == TimeSeriesScale.week && isSameWeek(ts, timestamp)) ||
          (scale == TimeSeriesScale.day && isSameDay(ts, timestamp)) ||
          (scale == TimeSeriesScale.hour && isSameHour(ts, timestamp)) ||
          (scale == TimeSeriesScale.minute && isSameMinute(ts, timestamp))

        if (eq) {
          Y =
            props.data[j][props.type == 'avgResponseTime' ? 'avgResp' : 'total']
          break
        }
      }

      graphData.push({X, Y})
    }

    return {
      graphData,
      scale,
      diff
    }
  }

  const xValueFormatter = (v: Date) => {
    if (scale == TimeSeriesScale.year) {
      return format(v, 'yyyy')
    } else if (scale == TimeSeriesScale.month) {
      return format(v, 'MMM')
    } else if (scale == TimeSeriesScale.week) {
      return format(v, 'II')
    } else if (scale == TimeSeriesScale.day) {
      return format(v, 'iii')
    } else if (scale == TimeSeriesScale.hour) {
      return format(v, 'HH')
    } else if (scale == TimeSeriesScale.minute) {
      return format(v, 'HH:mm')
    }
  }

  const res = buildChartData()
  const scale = res.scale
  const xData = res.graphData.map(d => d.X)
  const yData = res.graphData.map(d => d.Y)
  const hasDataToShow = yData.some(y => y > 0)

  return (
    <Card style={{minWidth: '660px', backgroundColor: '#fff'}}>
      <CardHeader
        title={
          props.type == 'load' ? 'Transaction Load' : 'Average Response Time'
        }
        subheader={props.type == 'load' ? `per ${scale}` : `ms`}
      />
      <CardContent>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12}>
            {!hasDataToShow && (
              <>
                <InfoIcon color="action" sx={{fontSize: 50, marginBottom: 1}} />
                <Typography variant="h6" color="black" gutterBottom>
                  No Data Available
                </Typography>
                <Typography variant="body2" color="black">
                  Please check back later or contact support if you believe this
                  is an error.
                </Typography>
              </>
            )}
            {hasDataToShow && (
              <LineChart
                xAxis={[
                  {
                    scaleType: 'time',
                    data: xData,
                    label: `${scale}s`,
                    valueFormatter: xValueFormatter,
                    tickNumber: res.diff >= 12 ? undefined : res.diff
                  }
                ]}
                yAxis={[
                  {label: props.type == 'load' ? 'Load' : 'Response Time'}
                ]}
                series={[
                  {
                    data: yData,
                    area: true,
                    connectNulls: false,
                    showMark: true
                  }
                ]}
                width={600}
                height={380}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
