import React, {useState, useEffect, useCallback} from 'react'
import {
  Container,
  Tab,
  Tabs,
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  CardContent
} from '@mui/material'
import CustomFilters from '../filters/custom.component'
import BasicFilters from '../filters/basic.component'
import TransactionLogTable from './transactionlog.datatable.component'
import {
  getChannelById,
  getChannels,
  getClientById,
  getClients,
  getTransactions,
  getServerHeartBeat,
  getTransactionById
} from '../../services/api.service'
import {format, set} from 'date-fns'

const App: React.FC = () => {
  const NO_FILTER = 'NoFilter'
  const [tabValue, setTabValue] = useState(0)
  const [status, setStatus] = useState(NO_FILTER)
  const [statusCode, setStatusCode] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [channel, setChannel] = useState(NO_FILTER)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [limit, setLimit] = useState(10)
  const [reruns, setReruns] = useState(NO_FILTER)
  const [channels, setChannels] = useState([])
  const [transactions, setTransactions] = useState([])
  const [host, setHost] = useState('')
  const [port, setPort] = useState(null)
  const [path, setPath] = useState('')
  const [param, setParam] = useState('')
  const [client, setClient] = useState(NO_FILTER)
  const [method, setMethod] = useState(NO_FILTER)
  const [clients, setClients] = useState([])
  const [initialTransactionLoadComplete, setInitialTransactionLoadComplete] =
    useState(false)
  const [loading, setLoading] = useState(false)
  const [timestampFilter, setTimestampFilter] = useState<string | null>(null)
  let lastPollingComplete = true
  let lastUpdated
  let serverDifferenceTime

  const fetchTransactionLogs = useCallback(
    async (timestampFilter?: string) => {
      try {
        const filters: {[key: string]: any} = {}

        if (timestampFilter) {
          filters['request.timestamp'] = JSON.stringify({
            $gte: timestampFilter
          })
        } else {
          if (status !== 'NoFilter') {
            filters.status = status
          }

          if (statusCode) {
            filters['response.status'] = statusCode
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

          if (host) {
            filters['request.host'] = host
          }

          if (port) {
            filters['request.port'] = port
          }

          if (path) {
            filters['request.path'] = path
          }

          if (param) {
            filters['request.querystring'] = param
          }

          if (client !== 'NoFilter') {
            filters.clientID = client
          }

          if (method !== 'NoFilter') {
            filters['request.method'] = method
          }
        }

        const fetchParams: {[key: string]: any} = {
          filters: JSON.stringify(filters)
        }
        if (!timestampFilter) {
          fetchParams.filterLimit = limit
          fetchParams.filterPage = 0
        }

        const newTransactions = await getTransactions(fetchParams)

        const newTransactionsWithChannelDetails = await Promise.all(
          newTransactions.map(async transaction => {
            const channelName = await fetchChannelDetails(transaction.channelID)
            //TODO: find what the place holder text is meant to be if there is no client present
            const clientName = transaction.clientID
              ? await fetchClientDetails(transaction.clientID)
              : 'Unknown'
            return {...transaction, channelName, clientName}
          })
        )

        setTransactions(prevTransactions => {
          const newTransactionListState = [...prevTransactions]

          newTransactionsWithChannelDetails.forEach(transaction => {
            if (!newTransactionListState.some(t => t._id === transaction._id)) {
              newTransactionListState.push(transaction)
            }
          })

          //sort the transactions by timestamp
          newTransactionListState.sort((a, b) => {
            return (
              new Date(b.request.timestamp).getTime() -
              new Date(a.request.timestamp).getTime()
            )
          })

          if (lastPollingComplete) {
            return newTransactionListState.slice(0, limit)
          }

          return newTransactionListState
        })
      } catch (error) {
        console.error('Error fetching logs:', error)
      }
    },
    [
      status,
      statusCode,
      channel,
      startDate,
      endDate,
      limit,
      reruns,
      host,
      port,
      path,
      param,
      client,
      method,
      loading
    ]
  )

  const fetchAvailableChannels = useCallback(async () => {
    try {
      const channels = await getChannels()
      setChannels(channels)
    } catch (error) {
      console.error('Error fetching channels:', error)
    }
  }, [])

  const fetchAvailableClients = useCallback(async () => {
    try {
      const clients = await getClients()
      setClients(clients)
    } catch (error) {}
  }, [])

  useEffect(() => {
    ;(async () => {
      await setLastUpdated()
      await fetchAvailableChannels()
      await fetchAvailableClients()
      await fetchTransactionLogs()
      setInitialTransactionLoadComplete(true)
    })()
  }, [fetchTransactionLogs, fetchAvailableChannels, fetchAvailableClients])

  useEffect(() => {
    const interval = setInterval(() => {
      // Checking for new Transactions
      const ISO_8601_FORMAT_WITH_TIMEZONE_OFFSET = "yyyy-MM-dd'T'HH:mm:ssXXX"
      const currentTimestamp = format(
        lastUpdated,
        ISO_8601_FORMAT_WITH_TIMEZONE_OFFSET
      )
      setTimestampFilter(currentTimestamp)

      lastUpdated = new Date().getTime() - serverDifferenceTime

    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timestampFilter) {
      ;(async () => {
        lastPollingComplete = false
        await fetchTransactionLogs(timestampFilter)
        lastPollingComplete = true
      })()
    }

    const listOfProcessingTransactions = transactions.filter(
      transaction => transaction.status === 'Processing'
    )

    if (listOfProcessingTransactions.length > 0) {
      const transactionIds = listOfProcessingTransactions.map(
        transaction => transaction._id
      )
      ;(async () => {
        const updatedTransactions = await Promise.all(
          transactionIds.map(getTransactionById)
        )

        setTransactions(prevTransactions => {
          const newTransactionListState = [...prevTransactions]
          updatedTransactions.forEach(transaction => {
            const processingTransaction = newTransactionListState.find(
              t => t._id === transaction._id
            )
            if (processingTransaction) {
              processingTransaction.status = transaction.status
            }
          })
          return newTransactionListState
        })
      })()
    }

  }, [timestampFilter, fetchTransactionLogs])

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue)
  }

  const fetchChannelDetails = async (channelID: string) => {
    try {
      const response = await getChannelById(channelID)

      return response.name
    } catch (error) {
      console.error('Error fetching logs:', error)
      return 'Unknown'
    }
  }

  const fetchClientDetails = async (clientID: string) => {
    try {
      const response = await getClientById(clientID)

      return response.name
    } catch (error) {
      console.error('Error fetching logs:', error)
      return 'Unknown'
    }
  }

  const setLastUpdated = async () => {
    if (serverDifferenceTime) {
      lastUpdated = new Date().getTime() - serverDifferenceTime
      return
    }

    const heartBeat = await getServerHeartBeat()

    serverDifferenceTime = new Date().getTime() - heartBeat.now

    lastUpdated = new Date().getTime() - serverDifferenceTime
  }

  const loadMore = async () => {
    setLoading(true)
    try {
      setLimit(prevLimit => prevLimit + 20)

      await fetchTransactionLogs()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const searchTerm = searchQuery.toLowerCase()
    return [
      transaction.channelName,
      transaction.clientName,
      transaction.request.method,
      transaction.request.host,
      transaction.request.path,
      transaction.request.params,
      transaction.status
    ].some(field => field?.toLowerCase().includes(searchTerm))
  })

  const handleRowClick = transaction => {
    console.log('Transaction clicked:', transaction)
  }

  return (
    <Box padding={3} sx={{backgroundColor: '#F1F1F1',minHeight: 'calc(100vh - 64px - 10px)'}}>
      <Box>
        <Grid item xs={12}>
          <Box>
            <Typography variant="h4">Transaction Log</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1">
              A log of the recent transactions through the system. Use Basic or
              Advanced filters to find specific transactions to investigate or
              rerun. Use settings to modify the list behaviour.
            </Typography>
          </Box>
        </Grid>
      </Box>
      <Divider sx={{marginTop: '10px', marginBottom: '30px'}} />
      <Box>
        <Card elevation={4}>
          <CardContent>
            <Box
              sx={{borderBottom: 1, borderColor: 'divider', marginBottom: 2}}
            >
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
            {tabValue === 1 && (
              <CustomFilters
                status={status}
                setStatus={setStatus}
                statusCode={statusCode}
                setStatusCode={setStatusCode}
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
                host={host}
                setHost={setHost}
                port={port}
                setPort={setPort}
                path={path}
                setPath={setPath}
                param={param}
                setParam={setParam}
                client={client}
                setClient={setClient}
                method={method}
                setMethod={setMethod}
                clients={clients}
              />
            )}
          </CardContent>
        </Card>
      </Box>
      <Box sx={{mt: 3}}>
        <Card elevation={4}>
          <CardContent>
            <TransactionLogTable
              transactions={filteredTransactions}
              loadMore={loadMore}
              loading={loading}
              initialTransactionLoadComplete={initialTransactionLoadComplete}
              onRowClick={handleRowClick}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default App
