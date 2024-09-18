import {Channel, Client} from '../types'
import {
  fetchClients,
  fetchClientById,
  fetchChannels,
  fetchChannelById,
  fetchTransactions,
  fetchServerHeartBeat,
  fetchTransaction,
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

export async function getTransactions(filters: {}): Promise<any[]> {
  try {
    const transactions = await fetchTransactions(filters)

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

export async function getServerHeartBeat(): Promise<{master: number, now: number}> {
  try {
    const heartBeat = await fetchServerHeartBeat()

    return heartBeat
  } catch (error) {
    throw error
  }
}
