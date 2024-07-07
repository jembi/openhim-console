import React from 'react'
import {BarChart} from '@mui/x-charts/BarChart'
import {format} from 'date-fns'
import {Transaction} from '../../types'

export type MediatorBarChartProps = {
  data: Transaction[]
}

export default function MediatorBarChart(props: MediatorBarChartProps) {
  const timestamps = props.data.map(entry => new Date(entry.request.timestamp))
  const formattedTimestamps = timestamps.map(timestamp =>
    format(timestamp, 'yyyy-MM-dd HH:mm:ss')
  )

  // Count occurrences of each formatted timestamp
  const counts: {[key: string]: number} = {}
  formattedTimestamps.forEach(timestamp => {
    counts[timestamp] = (counts[timestamp] || 0) + 1
  })

  // Prepare data for BarChart
  const chartData = Object.entries(counts).map(([timestamp, count]) => ({
    // label: timestamp,
    data: [count]
  }))

  return (
    <BarChart
      xAxis={[
        {
          scaleType: 'band',
          data: Object.entries(counts).map(([timestamp, count]) => timestamp)
        }
      ]}
      series={chartData}
      width={500}
      height={300}
    />
  )
}
