import {Role} from '../types'
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
    console.log(roles)

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

export async function getMediators() {
  try {
    const mediators = await fetchMediators()
    console.log(mediators)

    return mediators
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getApps() {
  try {
    const apps = await getAllApps()
    console.log(apps)

    return apps
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getChannels() {
  try {
    const channels = await fetchChannels()
    console.log(channels)

    return channels
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getClients() {
  try {
    const clients = await fetchClients()
    console.log(clients)

    return clients
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getTransactions() {
  try {
    const transactions = await fetchTransactions()
    console.log(transactions)

    return transactions
  } catch (err) {
    console.error(err)
    throw err
  }
}
