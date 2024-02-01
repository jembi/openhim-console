import {useState} from 'react'
import {useFormContext} from 'react-hook-form'
import TextField from '@mui/material/TextField'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  Switch
} from '@mui/material'
import {enqueueSnackbar} from 'notistack'
import FormInputRadioGroup from './FormInputRadio'
import {FormInputDropdown} from './FormInputDropDown'
import IconToggleButton from './IconToggleButton'

const FormFields = ({currentStep}) => {
  const {register, control, formState, watch, setValue} = useFormContext()
  const {errors} = formState
  const typeCheck = watch('type')
  const [displayIcon, setDisplayIcon] = useState(false)

  const handleFileRead = async ({target}) => {
    const file = target.files[0]
    if (!file) {
      enqueueSnackbar('No file selected', {variant: 'error'})
      return
    }
    if (file && file.size > 50000) {
      // Handle error when file size exceeds 3kb
      enqueueSnackbar('File size exceeds 50kb', {variant: 'error'})
      return
    }
    try {
      const base64 = await convertBase64(file)
      // Set the value of the 'icon' field using react-hook-form
      setValue('icon', base64)
    } catch (error) {
      console.error('Error reading file:', error)
      enqueueSnackbar('Error reading file', {variant: 'error'})
      // handle error in input component
    }
  }

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = error => {
        reject(error)
      }
    })
  }

  return (
    <>
      <Stack spacing={2}>
        {currentStep === 0 && (
          <div id="step-1">
            <FormInputRadioGroup
              name={'type'}
              id={'type'}
              label={'What is the type of your app?'}
              control={control}
              errors={errors}
              options={[
                {
                  label: '🏠 Built-in',
                  value: 'internal'
                },
                {
                  label: '🧩 Extension',
                  value: 'esmodule'
                },
                {
                  label: '🔗 Shortcut',
                  value: 'external'
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
                  message:
                    'Application title should be at least 3 characters long'
                },
                maxLength: {
                  value: 25,
                  message:
                    'Application title should be at most 25 characters long'
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
          </div>
        )}
        {currentStep === 1 && (
          <div id="step-2">
            {typeCheck === 'esmodule' && (
              <TextField
                margin="dense"
                multiline
                id="url"
                label="Bundle URL"
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
            {(typeCheck === 'internal' || typeCheck === 'external') && (
              <TextField
                margin="dense"
                multiline
                id="page"
                label="Link"
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
            <FormGroup sx={{mt: 2}}>
              <FormLabel component="legend">Visibility Settings</FormLabel>
              <FormControlLabel
                control={
                  <Switch
                    name="showInPortal"
                    id="showInPortal"
                    {...register('showInPortal')}
                    sx={{'& .MuiSvgIcon-root': {fontSize: 18}}}
                  />
                }
                label="Display in Portal Apps Shelf"
              />
              <FormControlLabel
                control={
                  <Switch
                    name="showInSideBar"
                    id="showInSideBar"
                    sx={{'& .MuiSvgIcon-root': {fontSize: 18}}}
                    {...register('showInSideBar')}
                  />
                }
                label="Display in Sidebar Menu"
              />
            </FormGroup>
          </div>
        )}
        {currentStep === 2 && (
          <Stack id="step-3">
            <FormControl
              sx={{m: 1, alignItems: 'center'}}
              component="fieldset"
              variant="standard"
            >
              <FormLabel component="label">Icon Settings</FormLabel>
              <IconToggleButton />
            </FormControl>
            <Button
              variant="text"
              onClick={() => {
                setDisplayIcon(true)
              }}
            >
              Or upload your own custom icon
            </Button>
            {displayIcon ? (
              <div>
                <input
                  hidden
                  id="icon"
                  type="url"
                  name="icon"
                  {...register('icon')}
                />
                <TextField
                  focused
                  margin="dense"
                  id="icon-file"
                  name="icon-file"
                  type="file"
                  label="Application Icon"
                  size="small"
                  variant="outlined"
                  fullWidth
                  inputProps={{accept: 'image/*'}}
                  onChange={e => handleFileRead(e)}
                />
              </div>
            ) : null}
          </Stack>
        )}
      </Stack>
    </>
  )
}

export default FormFields

