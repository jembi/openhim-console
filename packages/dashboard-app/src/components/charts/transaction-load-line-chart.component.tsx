import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import InfoIcon from '@mui/icons-material/Info';

import {
  add,
  sub,
  format,
  isEqual,
  isSameYear,
  isSameMonth,
  isSameWeek,
  isSameDay,
  isSameHour,
  isSameMinute
} from 'date-fns';
import { TimeSeries, TimeSeriesScale } from '../../types';
import { getTimeDiffScale } from '../../utils';

function buildChartData(selectedPeriod: { from: Date, until: Date, type: TimeSeriesScale }, metrics: TimeSeries[]) {
  const graphData = []
  let avgResponseTimeTotal = 0;
  let loadTotal = 0
  let avgResponseTime: number | string = 0

  const { diff, scale } = getTimeDiffScale(selectedPeriod.from, selectedPeriod.until);

  for (let i = 0; i < diff; i++) {
    const timestamp = add(selectedPeriod.from, { [`${scale}s`]: 1 * (i + 1) })
    let Y = 0;
    const X = timestamp;

    for (let j = 0; j < metrics.length; j++) {
      const ts = new Date(metrics[j].timestamp);
      const eq = (scale == TimeSeriesScale.year && isSameYear(ts, timestamp))
        || (scale == TimeSeriesScale.month && isSameMonth(ts, timestamp))
        || (scale == TimeSeriesScale.week && isSameWeek(ts, timestamp))
        || (scale == TimeSeriesScale.day && isSameDay(ts, timestamp))
        || (scale == TimeSeriesScale.hour && isSameHour(ts, timestamp))
        || (scale == TimeSeriesScale.minute && isSameMinute(ts, timestamp));
        
      if (eq) {
        Y = metrics[j].total
        loadTotal += metrics[j].total;
        avgResponseTimeTotal += metrics[j].avgResp;
        break;
      }
    }

    graphData.push({ X, Y });
  }

  avgResponseTime = (avgResponseTimeTotal / metrics.length).toFixed(2)

  // console.log({ scale, diff, graphData, from: selectedPeriod.from, until: selectedPeriod.until })

  return {
    graphData,
    loadTotal,
    avgResponseTime,
    scale,
    diff,
  }
}

export type MyProps = {
  period: { from: Date, until: Date, type: TimeSeriesScale }
  data: TimeSeries[]
}

export default function TransactionLoadLineChart(props: MyProps) {
  const res = buildChartData(props.period, props.data);
  const scale = res.scale;
  const xData = res.graphData.map(d => d.X);
  const yData = res.graphData.map(d => d.Y);
  const hasDataToShow = yData.some(y => y > 0);

  const xValueFormatter = (v: Date) => {
    if (scale == TimeSeriesScale.year) {
      return format(v, 'yyyy');
    } else if (scale == TimeSeriesScale.month) {
      return format(v, 'MMM');
    } else if (scale == TimeSeriesScale.week) {
      return format(v, 'II');
    } else if (scale == TimeSeriesScale.day) {
      return format(v, 'iii');
    } else if (scale == TimeSeriesScale.hour) {
      return format(v, 'HH');
    } else if (scale == TimeSeriesScale.minute) {
      return format(v, 'HH:mm');
    }
  }

  return (
    <Card style={{ minWidth: '600px', }}>
      <CardHeader title="Transaction load" subheader={`per ${scale}`} />
      <CardContent>
        {!hasDataToShow && <>
          <InfoIcon color="action" sx={{ fontSize: 50, marginBottom: 1 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No Data Available
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please check back later or contact support if you believe this is an error.
          </Typography></>
        }
        {hasDataToShow && <LineChart
          xAxis={[{ scaleType: 'time', data: xData, label: `${scale}s`, valueFormatter: xValueFormatter, tickNumber: res.diff >= 12 ? undefined : res.diff }]}
          yAxis={[{ label: 'Load' }]}
          series={[
            {
              data: yData,
              area: true,
              connectNulls: false,
              showMark: true,
            },
          ]}
          width={600}
          height={380}
        />}
      </CardContent>
    </Card>
  );
}

