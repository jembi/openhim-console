import {Stack, Button, FormControl, FormLabel, TextField} from '@mui/material'

import {useState} from 'react'
import IconToggleButton from './FormFieldsComponents/IconToggleButton'

interface ActiveStepTwoProps {
  updateIcon: (icon: any) => void
  handleFileRead: ({target}: {target: any}) => Promise<void>
}
const ActiveStepTwo: React.FC<ActiveStepTwoProps> = ({
  updateIcon,
  handleFileRead
}) => {
  const [displayIcon, setDisplayIcon] = useState(false)

  return (
    <>
      <Stack id="step-3">
        <FormControl
          sx={{m: 1, alignItems: 'center'}}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="label">Icon Settings</FormLabel>
          <IconToggleButton updateIcon={updateIcon} />
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
              onChange={e => handleFileRead(e)}
            />
          </div>
        ) : null}
      </Stack>
    </>
  )
}

export default ActiveStepTwo
