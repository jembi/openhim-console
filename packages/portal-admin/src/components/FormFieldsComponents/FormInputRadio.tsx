import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { FormInputProps } from './FormInputProps'
import { useState } from 'react'

export const FormInputRadioGroup: React.FC<FormInputProps> = ({
  name,
  id,
  control,
  label,
  errors,
  options,
  handleTypeChange,
  typeCheck
}) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleTypeChange(event.target.value)
  }

  const generateRadioOptions = options =>
    options.map(option => {
      return (
        <FormControlLabel
          key={option.value}
          value={option.value}
          label={option.label}
          control={<Radio />}
        />
      )
    })

  return (
    <FormControl fullWidth component="fieldset" required error={!!errors.type}>
      <FormLabel required component="legend">
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={'internal'}
        rules={{ required: 'This field is required' }}
        render={({ fieldState: { error } }) => {
          return (
            <RadioGroup
              id={id}
              name={name}
              row
              value={typeCheck}
              onChange={handleChange}
            >
              {generateRadioOptions(options)}
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </RadioGroup>
          )
        }}
      />
    </FormControl>
  )
}

export default FormInputRadioGroup
