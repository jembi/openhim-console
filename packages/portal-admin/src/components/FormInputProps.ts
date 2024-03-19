type ModuleTypes = 'internal' | 'esmodule' | 'external'

export interface AppProps {
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

export interface FormInputProps {
  name: string
  id: string
  control: any
  label: string
  setValue?: any
  errors?: any
  options?: object[]
  typeCheck: ModuleTypes
  handleTypeChange: any
}
