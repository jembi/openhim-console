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

export type User = {
  _id: string
  firstname: string
  surname: string
  email: string
  passports?: string
  /**
   * @deprecated
   */
  passwordAlgorithm?: string

  /**
   * @deprecated
   */
  passwordHash?: string

  /**
   * @deprecated
   */
  passwordSalt?: string
  provider: 'openid' | 'local' | 'token' // token is deprecated
  groups?: string[]
  msisdn?: string
  dailyReport?: boolean
  weeklyReport?: boolean
  settings?: Record<string, any>
  token?: string
  tokenType?: 'newUser' | 'existingUser' | null
  expiry?: Date
  locked?: boolean
}

export enum Routes {
  USERS = '!/users/',
  CREATE_USER = '!/users/create-user',
  EDIT_USER = '!/users/edit-user/:userId',

  ADD_ROLE = '/#!/rbac/create-role',
}
