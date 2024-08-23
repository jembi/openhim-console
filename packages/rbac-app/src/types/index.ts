export type Permission = {
  'channel-view-all': boolean
  'channel-view-specified': string[]
  'channel-manage-all': boolean
  'channel-manage-specified': string[]
  'client-view-all': boolean
  'client-view-specified': string[]
  'client-manage-all': boolean
  'client-manage-specified': string[]
  'client-role-view-all': boolean
  'client-role-view-specified': string[]
  'client-role-manage-all': boolean
  'client-role-manage-specified': string[]
  'transaction-view-all': boolean
  'transaction-view-specified': string[]
  'transaction-view-body-all': boolean
  'transaction-view-body-specified': string[]
  'transaction-rerun-all': boolean
  'transaction-rerun-specified': string[]
  'mediator-view-all': boolean
  'mediator-view-specified': string[]
  'mediator-manage-all': boolean
  'mediator-manage-specified': string[]
  'app-view-all': boolean
  'app-view-specified': string[]
  'app-manage-all': boolean
  'user-view': boolean
  'user-manage': boolean
  'user-role-view': boolean
  'user-role-manage': boolean
  'audit-trail-view': boolean
  'audit-trail-manage': boolean
  'contact-list-view': boolean
  'contact-list-manage': boolean
  'certificates-view': boolean
  'certificates-manage': boolean
  'logs-view': boolean
  'import-export': boolean
}

export type Role = {
  _id: string
  name: string
  permissions: Permission
}

export enum Routes {
  ROLES = '!/rbac',
  CREATE_ROLE = '!/rbac/create-role',
  EDIT_ROLE = '!/rbac/edit-role/:roleName'
}

export type Request = {
  host: string
  port: string
  path: string
  querystring: string
  method: string
  timestamp: string
}

export type Response = {
  status: number
  timestamp: string
}

export type Transaction = {
  request: Request
  response: Response
  _id: string
  clientID: string
  clientIP: string
  childIDs: string[]
  channelID: string
  canRerun: boolean
  autoRetry: boolean
  wasRerun: boolean
  status: string
  __v: number
}

export type Mediator = {name: string}

export type Client = {name: string}

export type Channel = {name: string}

export type App = {name: string}

export type CreateRoleLoader = {
  channels: Channel[]
  clients: Client[]
  transactions: Transaction[]
  mediators: Mediator[]
  apps: App[]
}
