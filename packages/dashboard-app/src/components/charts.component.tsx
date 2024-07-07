import React, {useState} from 'react'
import * as fns from 'date-fns'
import {Grid, Typography, Card} from '@mui/material'
import TransactionLineChart from './charts/transaction-line-chart.component'
import {getTimeSeries} from '../services/api'
import {TimeSeries, TimeSeriesScale} from '../types'
import BasicFilter, {BasicFilterData} from './filters/basic.filter.component'
import Loader from './ux/loader.component'
import { AlertDialog, AlertDialogProps } from './ux/alert.dialog.component'

type Alert = {
  severity: AlertDialogProps['severity'];
  isOpen: boolean;
  title: string;
  message: string;
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
  const [alert, setAlert] = useState<Alert>({ isOpen: false, title: '', message: '', severity: 'info' });

  const getFilteredTransactions = () => {
    setIsFetchingTransactions(true)
    getTimeSeries(filterData.period, {
      startDate: fns.sub(new Date(), {weeks: 1}),
      endDate: new Date()
    })
      .then(timeSeries => {
        setIsFetchingTransactions(false)
        setTimeSeries(timeSeries)
      })
      .catch(err => {
        console.error(err)
        setIsFetchingTransactions(false)
        setAlert({ isOpen: true, title: 'Error ',severity: 'error', message: 'Error loading data' });
      })
  }

  React.useEffect(() => {
    getFilteredTransactions()
  }, [filterData])

  const onFilterChange = (filter: BasicFilterData) => {
    setFilterData(structuredClone(filter))
  }

  if (isFetchingTransactions) {
    return <Loader />
  }

  return (
    <div>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Charts</Typography>
          <p>An overview of recent transactions through your mediator.</p>
        </Grid>
        <Grid item xs={12}>
          <BasicFilter value={filterData} onChange={onFilterChange} />
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              <Card>
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
              <Card>
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
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
    </div>
  )
}
