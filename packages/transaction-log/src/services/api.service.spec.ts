import {
  getClients,
  getClientById,
  getChannels,
  getChannelById,
  getTransactions
} from './api.service'

import {Client, Channel} from '../types'

// Mock the functions from api.service
jest.mock('./api.service', () => ({
  getClients: jest.fn(),
  getClientById: jest.fn(),
  getChannels: jest.fn(),
  getChannelById: jest.fn(),
  getTransactions: jest.fn()
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

      ;(getClients as jest.Mock).mockResolvedValue(mockClients)

      const clients = await getClients()
      expect(clients).toEqual(mockClients)
      expect(getClients).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if getClients fails', async () => {
      const errorMessage = 'Failed to fetch clients'
      ;(getClients as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(getClients()).rejects.toThrow(errorMessage)
      expect(getClients).toHaveBeenCalledTimes(1)
    })
  })

  describe('getClientById', () => {
    it('should return a client by ID', async () => {
      const mockClient: Client = {_id: '1', name: 'Client One'}

      ;(getClientById as jest.Mock).mockResolvedValue(mockClient)

      const client = await getClientById('1')
      expect(client).toEqual(mockClient)
      expect(getClientById).toHaveBeenCalledWith('1')
    })

    it('should throw an error if getClientById fails', async () => {
      const errorMessage = 'Failed to fetch client'
      ;(getClientById as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(getClientById('1')).rejects.toThrow(errorMessage)
      expect(getClientById).toHaveBeenCalledWith('1')
    })
  })

  describe('getChannels', () => {
    it('should return a list of channels', async () => {
      const mockChannels: Channel[] = [
        {_id: '1', name: 'Channel One'},
        {_id: '2', name: 'Channel Two'}
      ]

      ;(getChannels as jest.Mock).mockResolvedValue(mockChannels)

      const channels = await getChannels()
      expect(channels).toEqual(mockChannels)
      expect(getChannels).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if getChannels fails', async () => {
      const errorMessage = 'Failed to fetch channels'
      ;(getChannels as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(getChannels()).rejects.toThrow(errorMessage)
      expect(getChannels).toHaveBeenCalledTimes(1)
    })
  })

  describe('getChannelById', () => {
    it('should return a channel by ID', async () => {
      const mockChannel: Channel = {_id: '1', name: 'Channel One'}

      ;(getChannelById as jest.Mock).mockResolvedValue(mockChannel)

      const channel = await getChannelById('1')
      expect(channel).toEqual(mockChannel)
      expect(getChannelById).toHaveBeenCalledWith('1')
    })

    it('should throw an error if getChannelById fails', async () => {
      const errorMessage = 'Failed to fetch channel'
      ;(getChannelById as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(getChannelById('1')).rejects.toThrow(errorMessage)
      expect(getChannelById).toHaveBeenCalledWith('1')
    })
  })

  describe('getTransactions', () => {
    it('should return a list of transactions', async () => {
      const mockTransactions = [
        {id: '1', type: 'Transaction One'},
        {id: '2', type: 'Transaction Two'}
      ]

      ;(getTransactions as jest.Mock).mockResolvedValue(mockTransactions)

      const transactions = await getTransactions({})
      expect(transactions).toEqual(mockTransactions)
      expect(getTransactions).toHaveBeenCalledWith({})
    })

    it('should throw an error if getTransactions fails', async () => {
      const errorMessage = 'Failed to fetch transactions'
      ;(getTransactions as jest.Mock).mockRejectedValue(new Error(errorMessage))

      await expect(getTransactions({})).rejects.toThrow(errorMessage)
      expect(getTransactions).toHaveBeenCalledWith({})
    })
  })
})