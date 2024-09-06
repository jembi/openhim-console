import {
  getClients,
  getClientById,
  getChannels,
  getChannelById,
  getTransactions
} from './api.service'
import {
  fetchClients,
  fetchClientById,
  fetchChannels,
  fetchChannelById,
  fetchTransactions
} from '@jembi/openhim-core-api'
import {Client, Channel} from '../types'

jest.mock('@jembi/openhim-core-api', () => ({
  fetchClients: jest.fn(),
  fetchClientById: jest.fn(),
  fetchChannels: jest.fn(),
  fetchChannelById: jest.fn(),
  fetchTransactions: jest.fn()
}))

describe('API Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getClients', () => {
    it('should return a list of clients', async () => {
      const mockClients: Client[] = [
        {_id: '1', name: 'Client One'},
        {_id: '2', name: 'Client Two'}
      ]

      ;(fetchClients as jest.Mock).mockResolvedValue(mockClients)

      const clients = await getClients()
      expect(clients).toEqual(mockClients)
      expect(fetchClients).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if fetchClients fails', async () => {
      const errorMessage = 'Failed to fetch clients'
      ;(fetchClients as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(getClients()).rejects.toThrow(errorMessage)
      expect(fetchClients).toHaveBeenCalledTimes(1)
    })
  })

  describe('getClientById', () => {
    it('should return a client by ID', async () => {
      const mockClient: Client = {_id: '1', name: 'Client One'}

      ;(fetchClientById as jest.Mock).mockResolvedValue(mockClient)

      const client = await getClientById('1')
      expect(client).toEqual(mockClient)
      expect(fetchClientById).toHaveBeenCalledWith('1')
    })

    it('should throw an error if fetchClientById fails', async () => {
      const errorMessage = 'Failed to fetch client'
      ;(fetchClientById as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(getClientById('1')).rejects.toThrow(errorMessage)
      expect(fetchClientById).toHaveBeenCalledWith('1')
    })
  })

  describe('getChannels', () => {
    it('should return a list of channels', async () => {
      const mockChannels: Channel[] = [
        {_id: '1', name: 'Channel One'},
        {_id: '2', name: 'Channel Two'}
      ]

      ;(fetchChannels as jest.Mock).mockResolvedValue(mockChannels)

      const channels = await getChannels()
      expect(channels).toEqual(mockChannels)
      expect(fetchChannels).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if fetchChannels fails', async () => {
      const errorMessage = 'Failed to fetch channels'
      ;(fetchChannels as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(getChannels()).rejects.toThrow(errorMessage)
      expect(fetchChannels).toHaveBeenCalledTimes(1)
    })
  })

  describe('getChannelById', () => {
    it('should return a channel by ID', async () => {
      const mockChannel: Channel = {_id: '1', name: 'Channel One'}

      ;(fetchChannelById as jest.Mock).mockResolvedValue(mockChannel)

      const channel = await getChannelById('1')
      expect(channel).toEqual(mockChannel)
      expect(fetchChannelById).toHaveBeenCalledWith('1')
    })

    it('should throw an error if fetchChannelById fails', async () => {
      const errorMessage = 'Failed to fetch channel'
      ;(fetchChannelById as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      )

      await expect(getChannelById('1')).rejects.toThrow(errorMessage)
      expect(fetchChannelById).toHaveBeenCalledWith('1')
    })
  })

  describe('getTransactions', () => {
    it('should return a list of transactions', async () => {
      const mockTransactions = [
        {id: '1', type: 'Transaction One'},
        {id: '2', type: 'Transaction Two'}
      ]

      ;(fetchTransactions as jest.Mock).mockResolvedValue(mockTransactions)

      const transactions = await getTransactions({})
      expect(transactions).toEqual(mockTransactions)

      expect(fetchTransactions).toHaveBeenCalledWith({})
    })

    it('should throw an error if fetchTransactions fails', async () => {
      const errorMessage = 'Failed to fetch transactions'

      ;(fetchTransactions as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      )

      await expect(getTransactions({})).rejects.toThrow(errorMessage)

      expect(fetchTransactions).toHaveBeenCalledWith({})
    })
  })
})
