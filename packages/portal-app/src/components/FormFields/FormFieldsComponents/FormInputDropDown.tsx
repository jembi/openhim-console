import React from 'react'
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material'
import {useFormContext, Controller} from 'react-hook-form'
import {FormInputProps} from './FormInputProps'

const options = [
  {
    label: 'OpenHIM',
    value: 'OpenHIM'
  },
  {
    label: 'Operations',
    value: 'Operations'
  },
  {
    label: 'HIE Configuration',
    value: 'HIE Configuration'
  },
  {
    label: 'Other',
    value: 'Other'
  }
]

export const FormInputDropdown: React.FC<FormInputProps> = ({
  name,
  control,
  label
}) => {
  const generateSingleOptions = () => {
    return options.map((option: any) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      )
    })
  }

  return (
    <FormControl fullWidth required>
      <InputLabel>{label}</InputLabel>
      <Controller
        render={({field: {onChange, value}}) => (
          <Select onChange={onChange} value={value} label={label}>
            {generateSingleOptions()}
          </Select>
        )}
        control={control}
        name={name}
        rules={{required: true}}
      />
    </FormControl>
  )
}
