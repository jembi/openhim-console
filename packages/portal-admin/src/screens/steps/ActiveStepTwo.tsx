import {Stack, Button, FormControl, FormLabel, TextField} from '@mui/material'

import {useEffect, useState} from 'react'
import IconToggleButton from '../../components/FormFieldsComponents/IconToggleButton'
import {App} from '../../types'
import {useAlert} from '../../contexts/alert.context'

export type ActiveStepTwoProps = {
  app: App
  onChange: (event: {app: App; isValid: boolean}) => unknown
}
const ActiveStepTwo: React.FC<ActiveStepTwoProps> = (
  props: ActiveStepTwoProps
) => {
  const [app, setApp] = useState<App>(props.app)
  const [displayIcon, setDisplayIcon] = useState(false)
  const [touched, setTouched] = useState({
    icon: false
  })
  const [iconHelperMessage, setIconHelperMessage] = useState('')
  const {showAlert} = useAlert()

  const validateData = async () => {
    let isValid = true
    setIconHelperMessage('')

    // Icon is optional, but if provided via file upload, validate its size
    if (app.icon && app.icon.startsWith('data:')) {
      // Rough estimation of base64 string size
      const base64Size = app.icon.length * (3/4) - 2
      if (base64Size > 50000) {
        isValid = false
        if (touched.icon) {
          setIconHelperMessage('Icon size exceeds 50kb')
        }
      }
    }

    return isValid
  }

  useEffect(() => {
    validateData().then(isValid => {
      props.onChange({app: structuredClone(app), isValid})
    })
  }, [app])

  // When adding a custom icon than what provided in the form this function is called to set the icon url.
  const handleFileRead = async ({target}) => {
    const file = target.files[0]
    if (!file) {
      showAlert('No file selected', 'Error', 'error')
      return
    }
    if (file && file.size > 50000) {
      showAlert('File size exceeds 50kb', 'Error', 'error')
      setIconHelperMessage('File size exceeds 50kb')
      return
    }
    try {
      const base64 = await convertBase64(file)
      setApp({...app, icon: base64})
      setIconHelperMessage('')
    } catch (error) {
      console.error('Error reading file:', error)
      showAlert('Error reading file', 'Error', 'error')
      setIconHelperMessage('Error reading file')
    }
  }

  const convertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        return resolve(fileReader.result.toString())
      }
      fileReader.onerror = error => {
        return reject(error)
      }
    })
  }

  return (
    <>
      <Stack id="step-3">
        <FormControl
          sx={{m: 1, alignItems: 'center'}}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="label">Icon Settings</FormLabel>
          <IconToggleButton
            icon={app.icon}
            updateIcon={icon => {
              setApp({...app, icon})
              setIconHelperMessage('')
            }}
          />
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
            <input hidden id="icon" type="url" name="icon" />
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
              onChange={handleFileRead}
              onBlur={() => setTouched({...touched, icon: true})}
              error={touched.icon && iconHelperMessage ? true : false}
              helperText={iconHelperMessage}
              FormHelperTextProps={{
                sx: { marginLeft: 0 }
              }}
            />
          </div>
        ) : null}
      </Stack>
    </>
  )
}

export default ActiveStepTwo
