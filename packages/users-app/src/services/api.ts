var ObjectID = require('bson-objectid')
import {Role, User} from '../types'

const {
  fetchUsers,
  createUser,
  updateUser,
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

export async function editUserByEmail(email: string, user: User) {
  try {
    await updateUser(email, user)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function createNewUser(user: User) {
  try {
    const passports = ObjectID() // create random ObjectId for passports
    await createUser({...user, _id: undefined, passports})
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
