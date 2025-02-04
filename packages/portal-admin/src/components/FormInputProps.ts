import {ModuleTypes} from '../types'

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
