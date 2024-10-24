import {
  fetchClients,
  fetchChannels,
  editClient,
  editChannel
} from '@jembi/openhim-core-api'

export interface Client {
  _id?: string
  clientID: string
  roles?: string[]
}
export interface Channel {
  _id?: string
  name: string
  allow?: string[]
}

export interface Role {
  roleName: string
  clients: string[]
  channels: string[]
}

export async function getAllClientsAndChannels(): Promise<{
  clients: Client[]
  channels: Channel[]
}> {
  const clients = await fetchClients()
  const channels = await fetchChannels()

  return {
    clients,
    channels
  }
}

export async function upsertRole(channels: Channel[]) {
  const upsertChannelPromises = channels.map(channel => {
    return editChannel(channel)
  })

  console.log(
    `upserting ${upsertChannelPromises.length} channels`
  )

  await Promise.all([...upsertChannelPromises])
}
