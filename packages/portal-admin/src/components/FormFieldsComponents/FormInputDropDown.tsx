import React from 'react'
import {FormControl, InputLabel, MenuItem, Select, Stepper} from '@mui/material'
import {Controller} from 'react-hook-form'
import {FormInputProps} from '../FormInputProps'

export const FormInputDropdown: React.FC<FormInputProps> = ({
  name,
  id,
  control,
  label,
  options
}) => {
  const generateSingleOptions = () => {
    if (!options) {
      return null
    }
    return options.map((option: any) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      )
    })
  }

  return (
    <FormControl fullWidth required sx={{mt: 1}}>
      <InputLabel>{label}</InputLabel>
      <Controller
        render={({field: {onChange, value}}) => (
          <>
            <Select
              margin="dense"
              fullWidth
              onChange={onChange}
              id={id}
              name={name}
              value={value}
              label={label}
            >
              {generateSingleOptions()}
            </Select>
          </>
        )}
        control={control}
        name={name}
        rules={{required: true}}
      />
    </FormControl>
  )
}
