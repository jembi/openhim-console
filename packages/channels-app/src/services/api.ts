import {fetchChannels} from '@jembi/openhim-core-api'
import {Channel} from '../types'

export async function getChannels(): Promise<Channel[]> {
  try {
    return await fetchChannels()
  } catch (err) {
    console.error(err)
    throw err
  }
}
