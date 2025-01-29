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
import {useEffect} from 'react'
import {App} from '../../types'
import React from 'react'

export interface ActiveStepOneProps {
  app: App
  onChange: (event: {app: App; isValid: boolean}) => unknown
}

function ActiveStepOne(props: ActiveStepOneProps) {
  const [app, setApp] = React.useState<App>(structuredClone(props.app))
  const [appLinkHelperMessage, setAppLinkHelperMessage] = React.useState('')
  const [appAccessRoleHelperMessage, setAppAccessRoleHelperMessage] =
    React.useState('')
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

  useEffect(() => {
    validateData().then(isValid => {
      props.onChange({app: structuredClone(app), isValid})
    })
  }, [app])

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

  const validateData = async () => {
    if (!app.url) {
      setAppLinkHelperMessage('App Link is required')
      return false
    }

    const regExp =
      /^(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(:[0-9]+)?(\/[a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]*)*$/

    if (!regExp.test(app.url)) {
      setAppLinkHelperMessage('Invalid URL')
      return false
    }

    try {
      await fetch(app.url)
    } catch (error) {
      setAppLinkHelperMessage(
        'Service unreachable. Please check the URL or contact the services administrator'
      )
      return false
    }

    if (app.access_roles.length === 0) {
      setAppAccessRoleHelperMessage('User Access Role is required')
      return false
    }

    return true
  }

  return (
    <>
      <FormControl fullWidth>
        {app.type === 'esmodule' && (
          <TextField
            margin="dense"
            multiline
            id="url"
            label="Bundle URL"
            type="url"
            required
            fullWidth
            variant="outlined"
            name="url"
            value={app.url}
            onChange={e => {
              setApp({...app, url: e.target.value})
              setAppLinkHelperMessage('')
            }}
            error={appLinkHelperMessage ? true : false}
            helperText={appLinkHelperMessage}
          />
        )}
        {(app.type === 'internal' || app.type === 'external') && (
          <TextField
            margin="dense"
            type="url"
            id="url"
            multiline
            label="Link"
            value={app.url}
            fullWidth
            required
            variant="outlined"
            name="url"
            onChange={e => {
              setApp({...app, url: e.target.value})
              setAppLinkHelperMessage('')
            }}
            error={appLinkHelperMessage ? true : false}
            helperText={appLinkHelperMessage}
          />
        )}
      </FormControl>
      <FormControl fullWidth required sx={{mt: 1}}>
        <InputLabel>{'Access Roles'}</InputLabel>
        <Select
          margin="dense"
          fullWidth
          onChange={e => {
            setApp({...app, access_roles: e.target.value as string[]})
            setAppAccessRoleHelperMessage('')
          }}
          id="access_roles"
          name="access_roles"
          value={app.access_roles}
          label="Access Roles"
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
                setApp({...app, showInPortal: e.target.checked})
              }}
              checked={app.showInPortal}
            />
          }
          label="Display in Portal Apps Shelf"
        />
      </FormGroup>
    </>
  )
}

export default ActiveStepOne
