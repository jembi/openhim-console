import {TimeSeries, TimeSeriesScale, Transaction} from '../types'

const {
  fetchMediators,
  fetchTransactions,
  fetchTimeSeries
} = require('@jembi/openhim-core-api')

export async function getMediators() {
  try {
    const mediators = await fetchMediators()

    return mediators
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const transactions = (await fetchTransactions()) as Transaction[]

    return transactions
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getTimeSeries(
  period: TimeSeriesScale,
  filter: {startDate: Date; endDate: Date}
): Promise<TimeSeries[]> {
  try {
    const data = (await fetchTimeSeries(period, filter)) as TimeSeries[]

    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}
