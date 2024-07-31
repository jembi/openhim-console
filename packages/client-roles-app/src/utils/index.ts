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

export async function getAllRoles() {
  const {channels, clients} = await getAllClientsAndChannels()

  const roles: Role[] = []
  clients.forEach(client => {
    client.roles.forEach(role => {
      // check if role exists in roles array
      const roleIndex = roles.findIndex(r => r.roleName === role)
      if (roleIndex === -1) {
        roles.push({
          roleName: role,
          clients: [client.clientID],
          channels: []
        })
      } else {
        roles[roleIndex].clients.push(client.clientID)
      }
    })
  })
  channels.forEach(channel => {
    channel.allow.forEach(role => {
      // check if role exists in roles array
      const roleIndex = roles.findIndex(r => r.roleName === role)
      if (roleIndex === -1) {
        roles.push({
          roleName: role,
          clients: [],
          channels: [channel.name]
        })
      } else {
        roles[roleIndex].channels.push(channel.name)
      }
    })
  })

  return roles
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

export async function upsertRole(clients: Client[], channels: Channel[]) {
  const upsertClientPromises = clients.map(client => {
    return editClient(client._id, client)
  })

  const upsertChannelPromises = channels.map(channel => {
    return editChannel(channel)
  })

  console.log(`upserting ${upsertClientPromises.length} clients and ${upsertChannelPromises.length} channels`);

  await Promise.all([...upsertClientPromises, ...upsertChannelPromises])
}
