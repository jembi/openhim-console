import {titleCase} from 'title-case'
import {Role, Permission} from '../types'

export const defaultRole: Readonly<Role> = {
  _id: '',
  name: '',
  permissions: {
    'channel-view-all': false,
    'channel-view-specified': [],
    'channel-manage-all': false,
    'channel-manage-specified': [],
    'client-view-all': false,
    'client-view-specified': [],
    'client-manage-all': false,
    'client-manage-specified': [],
    'client-role-view-all': false,
    'client-role-view-specified': [],
    'client-role-manage-all': false,
    'client-role-manage-specified': [],
    'transaction-view-all': false,
    'transaction-view-specified': [],
    'transaction-view-body-all': false,
    'transaction-view-body-specified': [],
    'transaction-rerun-all': false,
    'transaction-rerun-specified': [],
    'mediator-view-all': false,
    'mediator-view-specified': [],
    'mediator-manage-all': false,
    'mediator-manage-specified': [],
    'app-view-all': false,
    'app-view-specified': [],
    'app-manage-all': false,
    'user-view': false,
    'user-manage': false,
    'user-role-view': false,
    'user-role-manage': false,
    'audit-trail-view': false,
    'audit-trail-manage': false,
    'contact-list-view': false,
    'contact-list-manage': false,
    'certificates-view': false,
    'certificates-manage': false,
    'logs-view': false,
    'import-export': false
  }
}

export function mapPermissionToHumanReadable(
  permissions: Permission
): Record<keyof Permission, string> {
  const map: Record<keyof Permission, string> = {
    'channel-view-all': 'View all channels',
    'channel-view-specified': 'View specified channels',
    'channel-manage-all': 'Manage all channels',
    'channel-manage-specified': 'Manage specified channels',
    'client-view-all': 'View all clients',
    'client-view-specified': 'View specified clients',
    'client-manage-all': 'Manage all clients',
    'client-manage-specified': 'Manage specified clients',
    'client-role-view-all': 'View all client roles',
    'client-role-view-specified': 'View specified client roles',
    'client-role-manage-all': 'Manage all client roles',
    'client-role-manage-specified': 'Manage specified client roles',
    'transaction-view-all': 'View all transactions',
    'transaction-view-specified': 'View specified transactions',
    'transaction-view-body-all': 'View all transaction bodies',
    'transaction-view-body-specified': 'View specified transaction bodies',
    'transaction-rerun-all': 'Rerun all',
    'transaction-rerun-specified': 'Rerun specified transactions',
    'mediator-view-all': 'View all mediators',
    'mediator-view-specified': 'View specified mediators',
    'mediator-manage-all': 'Manage all mediators',
    'mediator-manage-specified': 'Manage specified mediators',
    'app-view-all': 'View all apps',
    'app-view-specified': 'View specified',
    'app-manage-all': 'Manage all',
    'user-view': 'View users',
    'audit-trail-manage': 'Manage audit trail',
    'audit-trail-view': 'View audit trail',
    'contact-list-manage': 'Manage contact list',
    'contact-list-view': 'View contact list',
    'certificates-manage': 'Manage certificates',
    'certificates-view': 'View certificates',
    'import-export': 'Import and export',
    'logs-view': 'View logs',
    'user-manage': 'Manage users',
    'user-role-manage': 'Manage user roles',
    'user-role-view': 'View user roles'
  }

  return Object.keys(permissions).reduce((acc, key) => {
    acc[key as keyof Permission] = titleCase(map[key as keyof Permission])
    return acc
  }, {} as Record<keyof Permission, string>)
}
