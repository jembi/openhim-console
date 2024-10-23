import {
  fetchChannels,
  createChannel,
  editChannel,
  fetchChannelById
} from '@jembi/openhim-core-api'
import {Channel} from '../types'

export async function getChannels(): Promise<Channel[]> {
  try {
    return await fetchChannels()
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getChannelById(id: string): Promise<Channel> {
  try {
    return await fetchChannelById(id)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function addChannel(channel: Channel): Promise<void> {
  try {
    const channelPayload = structuredClone(channel)

    if (
      channelPayload.addAutoRewriteRules &&
      !channelPayload.urlPattern.trimStart().startsWith('^') &&
      !channelPayload.urlPattern.trimEnd().endsWith('$')
    ) {
      channelPayload._id = undefined
      channelPayload.urlPattern = `^${channelPayload.urlPattern.trim()}$`
    }

    // make sure _id is not included in the routes payload
    for (const route of channelPayload.routes ?? []) {
      delete route._id
    }

    await createChannel(channelPayload)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function modifyChannel(channel: Channel): Promise<void> {
  try {
    await editChannel(channel)
  } catch (err) {
    console.error(err)
    throw err
  }
}
