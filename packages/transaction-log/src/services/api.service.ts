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
  fetchTransaction,
  addToBulkReRunTaskQueue
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
    const transactions: Transaction[] = fetchTransactions(filters)
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
  const heartBeat = await fetchServerHeartBeat()
  return heartBeat
}

export async function addTransactionsToReRunQueue(
  transactions: Transaction[],
  batchSize: number,
  paused: boolean
) {
  const payload = {
    tids: transactions.map(t => t._id),
    batchSize,
    paused
  }
  await addToTaskQueue(payload)
}

export async function addTransactionsToBulkReRunTaskQueue(params: {
  batchSize: number
  filterLimit: number
  filterPage: number
  filters: {}
  pauseQueue: boolean
}) {
  await addToBulkReRunTaskQueue(params)
}

export async function getBulkRunFilterCount(params: {
  filterLimit: number
  filterPage: number
  filterRepresentation: string
  filters: {}
}): Promise<{count: number}> {
  return await fetchBulkRunFilterCount(params)
}
