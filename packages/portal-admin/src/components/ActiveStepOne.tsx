import {
  FormControl,
  FormLabel,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormGroup,
  Switch,
  FormHelperText
} from '@mui/material'
import {AppProps} from './FormInputProps'
import { useEffect } from 'react'

interface ActiveStepOneProps {
  appLinkFieldRef: React.MutableRefObject<HTMLInputElement>
  values: AppProps
  handleChange: {
    (e: React.ChangeEvent<any>): void
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void
  }
  handleFormChanges: (values: AppProps) => void
  setAppLinkHelperMessage: React.Dispatch<React.SetStateAction<string>>
  setAppAccessRoleHelperMessage: React.Dispatch<React.SetStateAction<string>>
  appLinkHelperMessage: string
  appAccessRoleieldRef: React.MutableRefObject<HTMLInputElement>
  appAccessRoleHelperMessage: string
  setShowInPortalValue: (value: boolean) => boolean
  setShowInSideBarValue: (value: boolean) => boolean
}

const ActiveStepOne: React.FC<ActiveStepOneProps> = ({
  appLinkFieldRef,
  values,
  handleChange,
  handleFormChanges,
  setAppLinkHelperMessage,
  setAppAccessRoleHelperMessage,
  appLinkHelperMessage,
  appAccessRoleieldRef,
  appAccessRoleHelperMessage,
  setShowInSideBarValue,
  setShowInPortalValue
}) => {
  const accessRoleOptions = [
    {
      label: 'Super Admin',
      value: 'admin'
    },
    {
      label: 'Basic User',
      value: 'user'
    }
  ]

  const generateSingleOptions = options => {
    if (!options) {
      return null
    }
    return options.map((option: any) => {
      return (
        <MenuItem key={option.value} value={option.value as string}>
          {option.label}
        </MenuItem>
      )
    })
  }

  useEffect(() => {
    handleFormChanges(values);
  }, [values]);

  return (
    <>
      {values.type === 'esmodule' && (
        <TextField
          margin="dense"
          multiline
          id="url"
          label="Bundle URL"
          type="url"
          required
          inputRef={appLinkFieldRef}
          fullWidth
          variant="outlined"
          name="url"
          value={values.url}
          onChange={e => {
            handleChange(e)
            setAppLinkHelperMessage('')
          }}
          error={appLinkHelperMessage ? true : false}
          helperText={appLinkHelperMessage}
        />
      )}
      {(values.type === 'internal' || values.type === 'external') && (
        <TextField
          margin="dense"
          multiline
          id="page"
          inputRef={appLinkFieldRef}
          label="Link"
          value={values.url}
          fullWidth
          required
          variant="outlined"
          name="url"
          onChange={e => {
            handleChange(e)
            setAppLinkHelperMessage('')
          }}
          error={appLinkHelperMessage ? true : false}
          helperText={appLinkHelperMessage}
        />
      )}
      <FormControl fullWidth required sx={{mt: 1}}>
        <InputLabel>{'Access Roles'}</InputLabel>
        <Select
          margin="dense"
          fullWidth
          inputRef={appAccessRoleieldRef}
          onChange={e => {
            handleChange(e)
            setAppAccessRoleHelperMessage('')
          }}
          id={'access_roles'}
          name={'access_roles'}
          value={values.access_roles}
          label={'Access Roles'}
          multiple
          error={appAccessRoleHelperMessage ? true : false}
        >
          {generateSingleOptions(accessRoleOptions)}
        </Select>
        <FormHelperText error={appAccessRoleHelperMessage ? true : false}>
          {appAccessRoleHelperMessage}
        </FormHelperText>
      </FormControl>

      <FormGroup sx={{mt: 2}}>
        <FormLabel component="legend">Visibility Settings</FormLabel>
        <FormControlLabel
          control={
            <Switch
              name="showInPortal"
              id="showInPortal"
              sx={{'& .MuiSvgIcon-root': {fontSize: 18}}}
              onChange={e => {
                setShowInPortalValue(e.target.checked)
                handleChange(e)
              }}
              checked={values.showInPortal}
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
              onChange={e => {
                setShowInSideBarValue(e.target.checked)
                handleChange(e)
              }}
              checked={values.showInSideBar}
            />
          }
          label="Display in Sidebar Menu"
        />
      </FormGroup>
    </>
  )
}

export default ActiveStepOne
