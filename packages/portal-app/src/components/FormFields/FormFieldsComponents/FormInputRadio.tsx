import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material'
import {Controller, set} from 'react-hook-form'
import {FormInputProps} from './FormInputProps'

const radioOptions = [
  {
    label: 'Internal',
    value: 'embedded'
  },
  {
    label: 'External',
    value: 'link'
  }
]

export const FormInputRadioGroup: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  errors
}) => {
  const generateRadioOptions = () =>
    radioOptions.map(option => {
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
    <FormControl component="fieldset" required error={!!errors.type}>
      <FormLabel required component="legend">
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={'embedded'}
        rules={{required: 'This field is required'}}
        render={({field: {onChange, value}, fieldState: {error}}) => {
          return (
            <RadioGroup row value={value} onChange={onChange}>
              {generateRadioOptions()}
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </RadioGroup>
          )
        }}
      />
    </FormControl>
  )
}

export default FormInputRadioGroup
