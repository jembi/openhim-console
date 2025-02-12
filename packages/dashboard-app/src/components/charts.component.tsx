import React, {useState} from 'react'
import {sub} from 'date-fns'
import {Grid, Typography, Card, Divider, Box} from '@mui/material'
import TransactionLineChart from './charts/transaction-line-chart.component'
import {getTimeSeries} from '../services/api'
import {TimeSeries, TimeSeriesScale} from '../types'
import BasicFilter, {BasicFilterData} from './filters/basic.filter.component'
import Loader from './ux/loader.component'
import './styles.css'
import {ErrorMessage} from './ux/error.component'
import {BasePageTemplate} from '../../../base-components'

export default function Charts() {
  const now = new Date()
  const [timeSeries, setTimeSeries] = useState<TimeSeries[]>([])
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filterData, setFilterData] = useState<BasicFilterData>({
    period: TimeSeriesScale.minute,
    from: sub(now, {hours: 1}),
    until: now,
    option: '1h'
  })

  const getFilteredTransactions = async () => {
    setIsFetchingTransactions(true)
    setError(null)

    const timeRanges = [
      { scale: TimeSeriesScale.minute, duration: { hours: 1 }, option: '1h' },
      { scale: TimeSeriesScale.day, duration: { days: 1 }, option: '1d' },
      { scale: TimeSeriesScale.day, duration: { weeks: 1 }, option: '1w' },
      { scale: TimeSeriesScale.day, duration: { months: 1 }, option: '1m' },
      { scale: TimeSeriesScale.day, duration: { years: 1 }, option: '1y' },
      { scale: TimeSeriesScale.day, duration: { years: 5 }, option: '5y' }
    ]

    try {
      for (const range of timeRanges) {
        const data = await getTimeSeries(range.scale, {
          startDate: sub(now, range.duration),
          endDate: now
        })
        type BasicFilterOption = '1h' | '1d' | '1w' | '1m' | '1y' | '5y'; // Define this type if not already defined

        if (data && data.length > 0) {
          setFilterData({
            period: range.scale,
            from: sub(now, range.duration),
            until: now,
            option: range.option as BasicFilterOption
          })
          setTimeSeries(data)
          return
        }
      }

      setError(new Error('No data found'))
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setIsFetchingTransactions(false)
    }
  }

  React.useEffect(() => {
    getFilteredTransactions()

    const int = window.setInterval(getFilteredTransactions, 30000)

    return () => window.clearInterval(int)
  }, [])

  if (error) {
    return <ErrorMessage onRetry={getFilteredTransactions} />
  }

  if (isFetchingTransactions) {
    return <Loader />
  }

  return (
    <BasePageTemplate
      title="Dashboard"
      subtitle="An overview of recent transactions through your mediator."
    >
      <Grid container spacing={2} fontFamily={'sans-serif'}>
        <Grid item xs={12}>
          <BasicFilter value={filterData} onChange={setFilterData} />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2} height={420}>
            <Grid item md={6} xs={12}>
              <Card elevation={2} className={'chartCard'}>
                <TransactionLineChart
                  type="load"
                  data={timeSeries}
                  period={{
                    from: filterData.from,
                    until: filterData.until,
                    type: filterData.period
                  }}
                />
              </Card>
            </Grid>
            <Grid item md={6} xs={12}>
              <Card elevation={2} className={'chartCard'}>
                <TransactionLineChart
                  type="avgResponseTime"
                  data={timeSeries}
                  period={{
                    from: filterData.from,
                    until: filterData.until,
                    type: filterData.period
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </BasePageTemplate>
  )
}
