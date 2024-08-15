import {Client, Channel} from './index'

describe('Client Type', () => {
  it('should create a valid Client object', () => {
    const client: Client = {
      _id: '12345',
      name: 'John Doe'
    }

    expect(client).toHaveProperty('_id')
    expect(client).toHaveProperty('name')
    expect(typeof client._id).toBe('string')
    expect(typeof client.name).toBe('string')
  })

  it('should fail if Client object is missing properties', () => {
    // const client: Client = {
    //   _id: '12345'
    // }
  })
})

describe('Channel Type', () => {
  it('should create a valid Channel object', () => {
    const channel: Channel = {
      _id: '54321',
      name: 'General'
    }

    expect(channel).toHaveProperty('_id')
    expect(channel).toHaveProperty('name')
    expect(typeof channel._id).toBe('string')
    expect(typeof channel.name).toBe('string')
  })

  it('should fail if Channel object is missing properties', () => {
    // const channel: Channel = {
    //   name: 'General'
    // }
  })
})
