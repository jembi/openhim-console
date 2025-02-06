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
  FormHelperText,
  Stack
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
  const [touched, setTouched] = React.useState({
    url: false,
    access_roles: false
  })
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
    let isValid = true

    // Clear previous messages
    setAppLinkHelperMessage('')
    setAppAccessRoleHelperMessage('')

    // URL validation
    if (!app.url) {
      isValid = false
      if (touched.url) {
        setAppLinkHelperMessage('App Link is required')
      }
    } else {
      const regExp =
        /^(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(:[0-9]+)?(\/[a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]*)*$/

      if (!regExp.test(app.url)) {
        isValid = false
        if (touched.url) {
          setAppLinkHelperMessage('Invalid URL')
        }
      } else {
        try {
          await fetch(app.url)
        } catch (error) {
          isValid = false
          if (touched.url) {
            setAppLinkHelperMessage(
              'Service unreachable. Please check the URL or contact the services administrator'
            )
          }
        }
      }
    }

    // Access roles validation
    if (app.access_roles.length === 0) {
      isValid = false
      if (touched.access_roles) {
        setAppAccessRoleHelperMessage('User Access Role is required')
      }
    }

    return isValid
  }

  return (
    <Stack spacing={3}>
      <FormControl fullWidth>
        {app.type === 'esmodule' && (
          <TextField
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
            onBlur={() => setTouched({...touched, url: true})}
            error={touched.url && appLinkHelperMessage ? true : false}
            helperText={appLinkHelperMessage}
            FormHelperTextProps={{
              sx: { marginLeft: 0 }
            }}
          />
        )}
        {(app.type === 'internal' || app.type === 'external') && (
          <TextField
            type="url"
            id="url"
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
            onBlur={() => setTouched({...touched, url: true})}
            error={touched.url && appLinkHelperMessage ? true : false}
            helperText={appLinkHelperMessage}
            FormHelperTextProps={{
              sx: { marginLeft: 0 }
            }}
          />
        )}
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel>{'Access Roles'}</InputLabel>
        <Select
          fullWidth
          onChange={e => {
            setApp({...app, access_roles: e.target.value as string[]})
            setAppAccessRoleHelperMessage('')
          }}
          onBlur={() => setTouched({...touched, access_roles: true})}
          id="access_roles"
          name="access_roles"
          value={app.access_roles}
          label="Access Roles"
          multiple
          error={touched.access_roles && appAccessRoleHelperMessage ? true : false}
        >
          {generateSingleOptions(accessRoleOptions)}
        </Select>
        <FormHelperText 
          error={touched.access_roles && appAccessRoleHelperMessage ? true : false}
          sx={{ marginLeft: 0 }}
        >
          {appAccessRoleHelperMessage}
        </FormHelperText>
      </FormControl>

      <FormControl component="fieldset">
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
      </FormControl>
    </Stack>
  )
}

export default ActiveStepOne
