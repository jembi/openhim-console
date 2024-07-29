import {Role, User} from '../types'

const {
  fetchUsers,
  editUser,
  createRole,
  fetchRoles
} = require('@jembi/openhim-core-api')

export async function getUsers(): Promise<User[]> {
  try {
    const users = await fetchUsers()

    return users
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function editUserByName(name: string, user: User) {
  try {
    await editUser(name, user)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function createNewUser(user: User) {
  try {
    await createRole({...user, _id: undefined})
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getRoles(): Promise<Role[]> {
  try {
    const roles = await fetchRoles()

    return roles
  } catch (err) {
    console.error(err)
    throw err
  }
}
