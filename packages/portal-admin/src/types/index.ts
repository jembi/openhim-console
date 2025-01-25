export enum Routes {
  MANAGE_APPS = '!/portal-admin',
  CREATE_APP = '!/portal-admin/create-add',
  EDIT_APP = '!/portal-admin/edit-add/:appId'
}

export type ModuleTypes = 'internal' | 'esmodule' | 'external'

export interface App {
  _id: string
  name: string
  description: string
  category: string
  type: ModuleTypes
  url: string
  showInPortal: boolean
  showInSideBar: boolean
  access_roles: string[]
  icon: string
}
