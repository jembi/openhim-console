import {
  FormControl,
  FormLabel,
  RadioGroup,
  InputLabel,
  Select,
  TextField,
  FormHelperText,
  FormControlLabel,
  MenuItem,
  Radio,
  Autocomplete,
  Typography,
  Box
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ExtensionIcon from '@mui/icons-material/Extension'
import LinkIcon from '@mui/icons-material/Link'
import {App} from '../types'
import React, {useEffect} from 'react'

interface ActiveStepZeroProps {
  app: App
  onChange: (event: {app: App; isValid: boolean}) => unknown
}

const ActiveStepZero: React.FC<ActiveStepZeroProps> = (
  props: ActiveStepZeroProps
) => {
  const [app, setApp] = React.useState<App>(props.app)
  const [appDescriptionHelperMessage, setAppDescriptionHelperMessage] =
    React.useState('')
  const [appTitleHelperMessage, setAppTitleHelperMessage] = React.useState('')
  const [appCategoryHelperMessage, setAppCategoryHelperMessage] =
    React.useState('')
  const radioButtonOptions = [
    {
      label: 'Built-in',
      value: 'internal',
      icon: <HomeIcon htmlColor="brown" />
    },
    {
      label: 'Extension',
      value: 'esmodule',
      icon: <ExtensionIcon htmlColor="lightgreen" />
    },
    {
      label: 'Shortcut',
      value: 'external',
      icon: <LinkIcon htmlColor="silver" />
    }
  ]

  const categoryOptions = [
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
  ]

  useEffect(() => {
    validateData().then(isValid => {
      props.onChange({app: structuredClone(app), isValid})
    })
  }, [app])

  const validateData = async () => {
    if (!app.category) {
      setAppCategoryHelperMessage(
        'Category is required. Select one of the categories'
      )
      return false
    } else if (!app.name) {
      setAppTitleHelperMessage(
        'App Title is required. Type a title between 3-25 characters'
      )
      return false
    } else if (app.name.length < 3) {
      setAppTitleHelperMessage(
        'Application title should be at least 3 characters long'
      )
      return false
    } else if (app.name.length > 25) {
      setAppTitleHelperMessage(
        'Application title should be at most 25 characters long'
      )
      return false
    } else if (app.description.length > 70) {
      setAppDescriptionHelperMessage(
        'Description should be at most 70 characters long'
      )
      return false
    } else {
      return true
    }
  }

  const generateRadioOptions = options =>
    options.map(option => {
      return (
        <FormControlLabel
          key={option.value}
          value={option.value}
          label={
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              {option.icon}
              <Typography sx={{px: '2px'}}>{option.label}</Typography>
            </Box>
          }
          control={<Radio />}
        />
      )
    })
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

  return (
    <>
      <FormControl fullWidth component="fieldset" required>
        <FormLabel required component="legend">
          {'What is the type of your app?'}
        </FormLabel>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <RadioGroup
            id="type"
            name="type"
            row
            value={app.type}
            onChange={e => {
              setApp({...app, type: e.target.value as App['type']})
            }}
          >
            {generateRadioOptions(radioButtonOptions)}
          </RadioGroup>
        </Box>
      </FormControl>
      <FormControl fullWidth required sx={{mt: 1}}>
        <Autocomplete
          freeSolo
          renderInput={params => (
            <TextField
              {...params}
              id="category"
              name="category"
              label="Category *"
              onChange={e => {
                setApp({...app, category: e.target.value})
                setAppCategoryHelperMessage('')
              }}
            />
          )}
          options={categoryOptions}
          value={app.category}
          onChange={e => {
            // setApp({...app, category: e.nativeEvent.targ})
            // setAppCategoryHelperMessage('')
          }}
        />
        <FormHelperText error={appCategoryHelperMessage ? true : false}>
          {appCategoryHelperMessage}
        </FormHelperText>
      </FormControl>
      <TextField
        margin="dense"
        value={app.name}
        id="name"
        label="App Title"
        type="text"
        fullWidth
        variant="outlined"
        required
        name="name"
        onChange={e => {
          setApp({...app, name: e.target.value})
          setAppTitleHelperMessage('')
        }}
        error={appTitleHelperMessage ? true : false}
        helperText={appTitleHelperMessage}
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
        value={app.description}
        onChange={e => {
          setApp({...app, description: e.target.value})
          setAppDescriptionHelperMessage('')
        }}
        error={appDescriptionHelperMessage ? true : false}
        helperText={appDescriptionHelperMessage}
      />
    </>
  )
}

export default ActiveStepZero
