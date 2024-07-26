import React, {useState, useEffect} from 'react'
import {
  Container,
  Tab,
  Tabs,
  Box,
  Typography,
  Card,
  Grid,
  Divider
} from '@mui/material'
import CustomFilters from './CustomFilters'
import BasicFilters from './BasicFilters'
import TransactionLogTable from './TransactionLogTable'
import {
  fetchTransactions,
  fetchChannelById,
  fetchClientById
} from '@jembi/openhim-core-api'

const App: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [limit, setLimit] = useState(10)
  const [status, setStatus] = useState('NoFilter')
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetchTransactionLogs()
  }, [limit, status])

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue)
  }

  const fetchTransactionLogs = async () => {
    try {
      const filters: {[key: string]: any} = {}
      if (status !== 'NoFilter') {
        filters.status = status
      }

      const transactions = await fetchTransactions({
        filterLimit: limit,
        filterPage: 0,
        filters: JSON.stringify(filters)
      })

      const transactionsWithChannelDetails = await Promise.all(
        transactions.map(async transaction => {
          const channelName = await fetchChannelDetails(transaction.channelID)
          const clientName = await fetchClientDetails(transaction.clientID)
          return {...transaction, channelName, clientName}
        })
      )

      setTransactions(transactionsWithChannelDetails)
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  const fetchChannelDetails = async (channelID: string) => {
    try {
      const response = await fetchChannelById(channelID)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const channel = await response.json()
      return channel.name
    } catch (error) {
      console.error('Error fetching logs:', error)
      return 'Unknown'
    }
  }

  const fetchClientDetails = async (clientID: string) => {
    try {
      const response = await fetchClientById(clientID)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const client = await response.json()
      return client.name
    } catch (error) {
      console.error('Error fetching logs:', error)
      return 'Unknown'
    }
  }

  const loadMore = () => {
    setLimit(prevLimit => prevLimit + 20)
  }

  return (
    <Container
      sx={{
        backgroundColor: '#F1F1F1',
        maxWidth: '100% !important'
      }}
    >
      <Grid item xs={12}>
        <Typography variant="h4" fontSize={'32px'} fontWeight={400}>
          Transaction Log
        </Typography>
        <p className={'subtitle'}>
          A log of the recent transactions through the system. Use Basic or
          Advanced filters to find specific transactions to investigate or
          rerun. Use settings to modify the list behaviour.
        </p>
        <Divider />
      </Grid>
      <Card>
        <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: 2}}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs"
            TabIndicatorProps={{style: {backgroundColor: '#54C4A4'}}}
          >
            <Tab
              label="Basic Filters"
              sx={{color: tabValue === 0 ? '#54C4A4' : '#54C4A4'}}
            />
            <Tab
              label="Custom Filters"
              sx={{color: tabValue === 1 ? '#54C4A4' : 'inherit'}}
            />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <BasicFilters
            limit={limit}
            setLimit={setLimit}
            status={status}
            setStatus={setStatus}
          />
        )}
        {tabValue === 1 && <CustomFilters limit={limit} setLimit={setLimit} status={status} setStatus={setStatus} />}
        <TransactionLogTable transactions={transactions} loadMore={loadMore} />
      </Card>
    </Container>
  )
}

export default App
