export interface FormInputProps {
  name: string
  id: string
  control: any
  label: string
  setValue?: any
  errors?: any
  options?: object[]
  handleTypeChange?: any,
  typeCheck?: ModuleTypes
}

export type ModuleTypes = "internal"| "esmodule" | "external"
