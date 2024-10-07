const {fetchRoles} = require('@jembi/openhim-core-api')
import {App, Role, UserProfile} from '../types'

export async function getUser(): Promise<UserProfile> {
  const resConf = await fetch('/config/default.json')
  if (!resConf.ok) {
    throw new Error('Failed to fetch OpenHIM console config')
  }
  const {protocol, host, hostPath, port} = await resConf.json()
  const resMe = await fetch(
    `${protocol}://${host}:${port}${
      /^\s*$/.test(hostPath) ? '' : '/' + hostPath
    }/me`,
    {credentials: 'include'}
  )

  if (!resMe.ok) {
    throw new Error('Failed to fetch user profile')
  }

  const user = await resMe.json()

  return user
}

export async function getApps(): Promise<App[]> {
  const resConf = await fetch('/config/default.json')
  if (!resConf.ok) {
    throw new Error('Failed to fetch OpenHIM console config')
  }
  const {protocol, host, hostPath, port} = await resConf.json()
  const resApps = await fetch(
    `${protocol}://${host}:${port}${
      /^\s*$/.test(hostPath) ? '' : '/' + hostPath
    }/apps`,
    {credentials: 'include'}
  )
  if (!resApps.ok) {
    throw new Error('Failed to fetch apps')
  }
  const apps = await resApps.json()

  return apps
}

export async function getUserPermissionRoles(
  groups: string[]
): Promise<Role[]> {
  const roles: Role[] = await fetchRoles()

  return roles.filter(role => groups.includes(role.name))
}
