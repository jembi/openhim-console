import TextField from '@mui/material/TextField'
import {useFormContext} from 'react-hook-form'
import FormInputRadioGroup from './FormInputRadio'
import {FormInputDropdown} from './FormInputDropDown'
import {
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  Switch
} from '@mui/material'

const FormFields = () => {
  const {register, control, formState, watch} = useFormContext()
  const {errors} = formState
  const typeCheck = watch('type')

  return (
    <>
      <Stack spacing={2} alignItems="left">
        <FormInputRadioGroup
          name={'type'}
          id={'type'}
          label={'What is the type of your app?'}
          control={control}
          errors={errors}
          options={[
            {
              label: 'Internal',
              value: 'link'
            },
            {
              label: 'External',
              value: 'embedded'
            }
          ]}
        />
        <FormInputDropdown
          name={'category'}
          id={'category'}
          label={'Category'}
          control={control}
          options={[
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
          ]}
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
          name="description"
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register('description', {
            maxLength: {
              value: 70,
              message: 'Description should be at most 70 characters long'
            }
          })}
        />
        {typeCheck === 'embedded' && (
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
        )}
        {typeCheck === 'embedded' && (
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
        )}
        {typeCheck === 'link' && (
          <TextField
            margin="dense"
            multiline
            id="page"
            label="Page"
            type="page"
            fullWidth
            variant="outlined"
            name="page"
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
        )}
        <FormInputDropdown
          name={'access_roles'}
          id={'access_roles'}
          label={'Access Roles'}
          control={control}
          options={[
            {
              label: 'Super Admin',
              value: 'admin'
            },
            {
              label: 'Basic User',
              value: 'user'
            }
          ]}
        />
        <FormLabel component="legend">Visibility Settings</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                name="showInPortal"
                id="showInPortal"
                {...register('showInPortal')}
                sx={{'& .MuiSvgIcon-root': {fontSize: 24}}}
              />
            }
            label="Display in Portal Apps Shelf"
          />
          <FormControlLabel
            control={
              <Switch
                name="showInSideBar"
                id="showInSideBar"
                sx={{'& .MuiSvgIcon-root': {fontSize: 24}}}
                {...register('showInSideBar')}
              />
            }
            label="Display in Sidebar Menu"
          />
        </FormGroup>
      </Stack>
    </>
  )
}

export default FormFields
