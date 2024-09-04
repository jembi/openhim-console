import React, {useState} from 'react'
import * as fns from 'date-fns'
import {Grid, Typography, Card, Divider, Box} from '@mui/material'
import TransactionLineChart from './charts/transaction-line-chart.component'
import {getTimeSeries} from '../services/api'
import {TimeSeries, TimeSeriesScale} from '../types'
import BasicFilter, {BasicFilterData} from './filters/basic.filter.component'
import Loader from './ux/loader.component'
import {AlertDialog, AlertDialogProps} from './ux/alert.dialog.component'
import './styles.css'

type Alert = {
  severity: AlertDialogProps['severity']
  isOpen: boolean
  title: string
  message: string
}

export default function Charts() {
  const now = new Date()
  const [timeSeries, setTimeSeries] = useState<TimeSeries[]>([])
  const [isFetchingTransactions, setIsFetchingTransactions] = useState(true)
  const [filterData, setFilterData] = useState<BasicFilterData>({
    period: TimeSeriesScale.day,
    from: now,
    until: fns.add(now, {days: 1}),
    option: '1h'
  })
  const [alert, setAlert] = useState<Alert>({
    isOpen: false,
    title: '',
    message: '',
    severity: 'info'
  })

  const getFilteredTransactions = () => {
    setIsFetchingTransactions(true)
    getTimeSeries(filterData.period, {
      startDate: filterData.from,
      endDate: filterData.until
    })
      .then(timeSeries => {
        setIsFetchingTransactions(false)
        setTimeSeries(timeSeries)
      })
      .catch(err => {
        console.error(err)
        setIsFetchingTransactions(false)
        setAlert({
          isOpen: true,
          title: 'Error ',
          severity: 'error',
          message: 'Error loading data'
        })
      })
  }

  // on mount
  React.useEffect(() => {
    getFilteredTransactions()
  }, [])

  React.useEffect(() => {
    getFilteredTransactions()

    const int = window.setInterval(getFilteredTransactions, 30000)

    return () => window.clearInterval(int)
  }, [filterData])

  const onFilterChange = (filter: BasicFilterData) => {
    setFilterData(structuredClone(filter))
  }

  if (isFetchingTransactions) {
    return <Loader />
  }

  return (
    <Box>
      <Grid container spacing={2} padding={2} fontFamily={'sans-serif'}>
        <Grid item xs={12}>
          <Typography variant="h3" fontSize={'32px'} fontWeight={400}>
            Dashboard
          </Typography>
          <p className={'subtitle'}>
            An overview of recent transactions through your mediator.
          </p>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <BasicFilter value={filterData} onChange={onFilterChange} />
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

      <AlertDialog
        severity={alert.severity}
        title={alert.title}
        message={alert.message}
        open={alert.isOpen}
        onClose={() => setAlert({...alert, isOpen: false})}
      />
    </Box>
  )
}
