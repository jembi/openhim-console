import {App, Channel, Client, Mediator, Role, Transaction} from '../types'
import {defaultRole} from '../utils'

const {
  fetchRoles,
  getAllApps,
  fetchChannels,
  fetchMediators,
  fetchClients,
  fetchTransactions,
  deleteRole,
  editRole,
  createRole
} = require('@jembi/openhim-core-api')

export async function getRoles() {
  try {
    // const roles = await fetchRoles();
    const roles = [
      structuredClone({...defaultRole, name: 'Test 67'}),
      {...defaultRole, name: 'Admin'}
    ]

    return roles
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function deleteRoleByName(name: string) {
  try {
    await deleteRole(name)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function editRoleByName(name: string, role: Role) {
  try {
    await editRole(name, role)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function createNewRole(role: Role) {
  try {
    await createRole(role)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getMediators(): Promise<Mediator[]> {
  try {
    const mediators = await fetchMediators()

    return mediators
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getApps(): Promise<App[]> {
  try {
    const apps = await getAllApps()

    return apps
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getChannels(): Promise<Channel[]> {
  try {
    const channels = await fetchChannels()

    return channels
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getClients(): Promise<Client[]> {
  try {
    const clients = await fetchClients()

    return clients
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const transactions = await fetchTransactions()

    return transactions
  } catch (err) {
    console.error(err)
    throw err
  }
}
