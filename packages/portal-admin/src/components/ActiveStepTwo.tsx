import {Stack, Button, FormControl, FormLabel, TextField} from '@mui/material'

import {useEffect, useState} from 'react'
import IconToggleButton from './FormFieldsComponents/IconToggleButton'
import {App} from '../types'
import {useAlert} from '../contexts/alert.context'

export type ActiveStepTwoProps = {
  app: App
  onChange: (event: {app: App; isValid: boolean}) => unknown
}
const ActiveStepTwo: React.FC<ActiveStepTwoProps> = (
  props: ActiveStepTwoProps
) => {
  const [app, setApp] = useState<App>(props.app)
  const [displayIcon, setDisplayIcon] = useState(false)
  const {showAlert} = useAlert()

  useEffect(() => {
    props.onChange({app: structuredClone(app), isValid: true})
  }, [app])

  // When adding a custom icon than what provided in the form this function is called to set the icon url.
  const handleFileRead = async ({target}) => {
    const file = target.files[0]
    if (!file) {
      return showAlert('No file selected', 'Error', 'error')
    }
    if (file && file.size > 50000) {
      return showAlert('File size exceeds 50kb', 'Error', 'error')
    }
    try {
      const base64 = await convertBase64(file)
      setApp({...app, icon: base64})
    } catch (error) {
      console.error('Error reading file:', error)
      showAlert('Error reading file', 'Error', 'error')
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
          <IconToggleButton updateIcon={icon => setApp({...app, icon})} />
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
            />
          </div>
        ) : null}
      </Stack>
    </>
  )
}

export default ActiveStepTwo
