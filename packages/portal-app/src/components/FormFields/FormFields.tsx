import TextField from '@mui/material/TextField'

import {useFormContext} from 'react-hook-form'

import FormInputRadioGroup from './FormFieldsComponents/FormInputRadio'
import {FormInputDropdown} from './FormFieldsComponents/FormInputDropDown'

const FormFields = () => {
  const {register, control, formState} = useFormContext()
  const {errors} = formState

  return (
    <>
      <FormInputRadioGroup
        name={'type'}
        label={'What is the type of your app?'}
        control={control}
        errors={errors}
      />
      <FormInputDropdown
        name={'category'}
        label={'Category'}
        control={control}
      />
      <TextField
        margin="dense"
        id="name"
        label="App Title"
        type="text"
        fullWidth
        variant="outlined"
        required
        name="name"
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register('name', {
          required: true,
          minLength: {
            value: 3,
            message: 'Application title should be at least 3 characters long'
          },
          maxLength: {
            value: 25,
            message: 'Application title should be at most 25 characters long'
          }
        })}
      />
      <TextField
        margin="dense"
        multiline
        id="description"
        label="Description"
        type="text"
        fullWidth
        variant="outlined"
        required
        name="description"
        error={!!errors.description}
        helperText={errors.description?.message}
        {...register('description', {
          required: true,
          maxLength: {
            value: 70,
            message: 'Description should be at most 70 characters long'
          }
        })}
      />
      <TextField
        margin="dense"
        multiline
        id="url"
        label="URL"
        type="url"
        fullWidth
        variant="outlined"
        name="url"
        required
        error={!!errors.url}
        helperText={errors.url?.message}
        {...register('url', {
          required: true,
          pattern: {
            value:
              /^(?:https?:\/\/)?(?:localhost|www\.\w+|(?:[\w-]+(?:\.\w+){1,2}))(?::\d+)?(?:\/.*)?$/,
            message: 'Invalid URL'
          }
        })}
      />
      <TextField
        margin="dense"
        multiline
        id="icon"
        label="Icon"
        type="url"
        fullWidth
        variant="outlined"
        name="icon"
        error={!!errors.icon}
        helperText={errors.icon?.message}
        {...register('icon')}
      />
    </>
  )
}

export default FormFields
