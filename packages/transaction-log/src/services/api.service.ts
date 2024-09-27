import {Channel, Client, Transaction} from '../types'
import {
  fetchClients,
  fetchClientById,
  fetchChannels,
  fetchChannelById,
  fetchTransactions,
  addToTaskQueue,
  fetchBulkRunFilterCount,
  fetchServerHeartBeat,
  fetchTransaction
} from '@jembi/openhim-core-api'

export async function getClients(): Promise<Client[]> {
  try {
    const clients = await fetchClients()

    return clients
  } catch (error) {
    throw error
  }
}

export async function getClientById(id: String): Promise<Client> {
  try {
    const client = await fetchClientById(id)

    return client
  } catch (error) {
    throw error
  }
}

export async function getChannels(): Promise<Channel[]> {
  try {
    const channels = await fetchChannels()

    return channels
  } catch (error) {
    throw error
  }
}

export async function getChannelById(id: String): Promise<Channel> {
  try {
    const channel = await fetchChannelById(id)

    return channel
  } catch (error) {
    throw error
  }
}

export async function getTransactions(filters: {}): Promise<Transaction[]> {
  try {
    const transactions: Transaction[] = [
      {
        _id: '66f270afd13af5ffa0ae4cd8',
        clientIP: '10.0.3.3',
        childIDs: [],
        channelID: '66deada657842ddfb162652d',
        request: {
          host: 'platform.jembi.cloud',
          path: '/ig',
          querystring: '',
          method: 'GET',
          timestamp: '2024-09-24T07:56:31.881Z'
        },
        canRerun: true,
        autoRetry: false,
        wasRerun: false,
        status: 'Successful',
        response: {
          status: 200,
          timestamp: '2024-09-24T07:56:31.952Z'
        }
      },
      {
        _id: '66eae07fd13af5ffa0640dd8',
        clientIP: '10.0.3.3',
        childIDs: [],
        channelID: '66deada657842ddfb162652d',
        request: {
          host: 'platform.jembi.cloud',
          path: '/ig',
          querystring: '',
          method: 'GET',
          timestamp: '2024-09-18T14:15:27.303Z'
        },
        canRerun: true,
        autoRetry: false,
        wasRerun: false,
        status: 'Completed',
        response: {
          status: 304,
          timestamp: '2024-09-18T14:15:27.315Z'
        }
      },
      {
        _id: '66eae03bd13af5ffa0640af8',
        clientIP: '10.0.3.3',
        childIDs: [],
        channelID: '66deada657842ddfb162652d',
        request: {
          host: 'platform.jembi.cloud',
          path: '/ig',
          querystring: '',
          method: 'GET',
          timestamp: '2024-09-18T14:14:19.302Z'
        },
        canRerun: true,
        autoRetry: false,
        wasRerun: false,
        status: 'Successful',
        response: {
          status: 200,
          timestamp: '2024-09-18T14:14:19.385Z'
        }
      },
      {
        _id: '66eadd85d13af5ffa063ef65',
        clientIP: '10.0.3.3',
        childIDs: [],
        channelID: '66deada657842ddfb162652d',
        request: {
          host: 'platform.jembi.cloud',
          path: '/ig',
          querystring: '',
          method: 'GET',
          timestamp: '2024-09-18T14:02:45.006Z'
        },
        canRerun: true,
        autoRetry: false,
        wasRerun: false,
        status: 'Successful',
        response: {
          status: 200,
          timestamp: '2024-09-18T14:02:45.045Z'
        }
      },
      {
        _id: '66eadd81d13af5ffa063ef28',
        clientIP: '10.0.3.3',
        childIDs: [],
        channelID: '66deada657842ddfb162652d',
        request: {
          host: 'platform.jembi.cloud',
          path: '/ig',
          querystring: '',
          method: 'GET',
          timestamp: '2024-09-18T14:02:41.438Z'
        },
        canRerun: true,
        autoRetry: false,
        wasRerun: false,
        status: 'Successful',
        response: {
          status: 200,
          timestamp: '2024-09-18T14:02:41.458Z'
        }
      },
      {
        _id: '66eadd79d13af5ffa063ee8e',
        clientIP: '10.0.3.3',
        childIDs: [],
        channelID: '66deada657842ddfb162652d',
        request: {
          host: 'platform.jembi.cloud',
          path: '/ig',
          querystring: '',
          method: 'GET',
          timestamp: '2024-09-18T14:02:33.598Z'
        },
        canRerun: true,
        autoRetry: false,
        wasRerun: false,
        status: 'Completed',
        response: {
          status: 304,
          timestamp: '2024-09-18T14:02:33.635Z'
        }
      },
      {
        _id: '66eadd3cd13af5ffa063eaf4',
        clientIP: '10.0.3.3',
        childIDs: [],
        channelID: '66deada657842ddfb162652d',
        request: {
          host: 'platform.jembi.cloud',
          path: '/ig',
          querystring: '',
          method: 'GET',
          timestamp: '2024-09-18T14:01:32.260Z'
        },
        canRerun: true,
        autoRetry: false,
        wasRerun: false,
        status: 'Successful',
        response: {
          status: 200,
          timestamp: '2024-09-18T14:01:32.320Z'
        }
      },
      {
        _id: '66e7ee48d13af5ffa0471dbe',
        clientIP: '10.0.3.3',
        childIDs: [],
        channelID: '66deada657842ddfb162652d',
        request: {
          host: 'platform.jembi.cloud',
          path: '/ig',
          querystring: '',
          method: 'GET',
          timestamp: '2024-09-16T08:37:28.579Z'
        },
        canRerun: true,
        autoRetry: false,
        wasRerun: false,
        status: 'Successful',
        response: {
          status: 200,
          timestamp: '2024-09-16T08:37:28.628Z'
        }
      },
      {
        _id: '66ded09fc8e594345e551056',
        clientIP: '10.0.3.3',
        childIDs: [],
        channelID: '66deada657842ddfb162652d',
        request: {
          host: 'platform.jembi.cloud',
          path: '/ig',
          querystring: '',
          method: 'GET',
          timestamp: '2024-09-09T10:40:31.910Z'
        },
        canRerun: true,
        autoRetry: false,
        wasRerun: false,
        status: 'Successful',
        response: {
          status: 200,
          timestamp: '2024-09-09T10:40:31.954Z'
        }
      }
    ]

    return transactions
  } catch (error) {
    throw error
  }
}

export async function getTransactionById(id: String): Promise<any> {
  try {
    const transaction = await fetchTransaction(id)
    return transaction
  } catch (error) {
    throw error
  }
}

export async function getServerHeartBeat(): Promise<{
  master: number
  now: number
}> {
  try {
    const heartBeat = await fetchServerHeartBeat()

    return heartBeat
  } catch (error) {
    throw error
  }
}

export async function addTransactionsToReRunQueue(
  transactions: Transaction[],
  batchSize: number,
  paused: boolean
) {
  try {
    const payload = {
      tids: transactions.map(t => t._id),
      batchSize,
      paused
    }
    await addToTaskQueue(payload)
  } catch (error) {
    throw error
  }
}

export async function addTransactionsToReRunQueueByFilters(params: {
  batchSize: number
  filterLimit: number
  filterPage: number
  filters: {}
  pauseQueue: boolean
}) {
  try {
    await addToTaskQueue(params)
  } catch (error) {
    throw error
  }
}

export async function getBulkRunFilterCount(params: {
  filterLimit: number
  filterPage: number
  filterRepresentation: string
  filters: {}
}): Promise<{count: number}> {
  try {
    return await fetchBulkRunFilterCount(params)
  } catch (error) {
    throw error
  }
}
