import React, {useState, useEffect, useCallback} from 'react'
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
  fetchClientById,
  fetchChannels
} from '@jembi/openhim-core-api'

const App: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [status, setStatus] = useState('NoFilter')
  const [searchQuery, setSearchQuery] = useState('')
  const [channel, setChannel] = useState('NoFilter')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [limit, setLimit] = useState(10)
  const [reruns, setReruns] = useState('NoFilter')
  const [channels, setChannels] = useState([])
  const [transactions, setTransactions] = useState([])

  const fetchTransactionLogs = useCallback(async () => {
    try {
      const filters: {[key: string]: any} = {}

      if (status !== 'NoFilter') {
        filters.status = status
      }

      if (channel !== 'NoFilter') {
        filters.channelID = channel
      }

      if (reruns !== 'NoFilter') {
        if (reruns === 'Yes') {
          filters.childIDs = JSON.stringify({$exists: true, $ne: []})
        } else if (reruns === 'No') {
          filters.childIDs = JSON.stringify({$eq: []})
        }
      }

      if (startDate && endDate) {
        filters['request.timestamp'] = JSON.stringify({
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString()
        })
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
  }, [status, channel, startDate, endDate, limit, reruns])

  const fetchAvailableChannels = useCallback(async () => {
    try {
      const channels = await fetchChannels()
      setChannels(channels)
    } catch (error) {
      console.error('Error fetching channels:', error)
    }
  }, [])

  useEffect(() => {
    fetchTransactionLogs()
    fetchAvailableChannels()
  }, [fetchTransactionLogs, fetchAvailableChannels])

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue)
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

  const filteredTransactions = transactions.filter(transaction => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      transaction.channelName?.toLowerCase().includes(searchTerm) ||
      '' ||
      transaction.clientName?.toLowerCase().includes(searchTerm) ||
      '' ||
      transaction.request.method?.toLowerCase().includes(searchTerm) ||
      '' ||
      transaction.request.host?.toLowerCase().includes(searchTerm) ||
      '' ||
      transaction.request.path?.toLowerCase().includes(searchTerm) ||
      '' ||
      transaction.request.params?.toLowerCase().includes(searchTerm) ||
      '' ||
      transaction.status?.toLowerCase().includes(searchTerm) ||
      ''
    )
  })

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
            status={status}
            setStatus={setStatus}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            channel={channel}
            setChannel={setChannel}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            limit={limit}
            setLimit={setLimit}
            reruns={reruns}
            setReruns={setReruns}
            channels={channels}
          />
        )}
        {tabValue === 1 && <CustomFilters limit={limit} setLimit={setLimit} />}
        <TransactionLogTable
          transactions={filteredTransactions}
          loadMore={loadMore}
        />
      </Card>
    </Container>
  )
}

export default App
