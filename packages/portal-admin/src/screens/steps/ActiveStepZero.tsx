import ExtensionIcon from '@mui/icons-material/Extension'
import HomeIcon from '@mui/icons-material/Home'
import LinkIcon from '@mui/icons-material/Link'
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import React, {useEffect} from 'react'
import {App} from '../../types'

export interface ActiveStepZeroProps {
  app: App
  onChange: (event: {app: App; isValid: boolean}) => unknown
}

const ActiveStepZero: React.FC<ActiveStepZeroProps> = (
  props: ActiveStepZeroProps
) => {
  const [app, setApp] = React.useState<App>(props.app)
  const [touched, setTouched] = React.useState({
    category: false,
    name: false,
    description: false
  })
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

  const validateData = async () => {
    let isValid = true
    
    // Clear all previous messages
    setAppCategoryHelperMessage('')
    setAppTitleHelperMessage('')
    setAppDescriptionHelperMessage('')

    // Always check required fields for form validity
    if (!app.category) {
      isValid = false
      // Only show error message if field was touched
      if (touched.category) {
        setAppCategoryHelperMessage(
          'Category is required. Select one of the categories'
        )
      }
    }

    if (!app.name) {
      isValid = false
      if (touched.name) {
        setAppTitleHelperMessage(
          'App Title is required. Type a title between 3-25 characters'
        )
      }
    } else if (app.name.length < 3) {
      isValid = false
      if (touched.name) {
        setAppTitleHelperMessage(
          'Application title should be at least 3 characters long'
        )
      }
    } else if (app.name.length > 25) {
      isValid = false
      if (touched.name) {
        setAppTitleHelperMessage(
          'Application title should be at most 25 characters long'
        )
      }
    }

    // Description is not required but has length validation
    if (app.description.length > 70) {
      isValid = false
      if (touched.description) {
        setAppDescriptionHelperMessage(
          'Description should be at most 70 characters long'
        )
      }
    }

    return isValid
  }

  useEffect(() => {
    validateData().then(isValid => {
      props.onChange({app: structuredClone(app), isValid})
    })
  }, [app])

  const generateRadioOptions = options =>
    options.map(option => {
      return (
        <FormControlLabel
          key={option.value}
          value={option.value}
          checked={app.type === option.value}
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
              onBlur={() => setTouched({...touched, category: true})}
              helperText={appCategoryHelperMessage}
              error={touched.category && appCategoryHelperMessage ? true : false}
              FormHelperTextProps={{
                sx: { marginLeft: 0 }
              }}
            />
          )}
          options={categoryOptions}
          value={app.category}
          onInputChange={(evt, value) => {
            setApp({...app, category: value})
            setAppCategoryHelperMessage('')
          }}
        />
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
        onBlur={() => setTouched({...touched, name: true})}
        error={touched.name && appTitleHelperMessage ? true : false}
        helperText={appTitleHelperMessage}
        FormHelperTextProps={{
          sx: { marginLeft: 0 }
        }}
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
        onBlur={() => setTouched({...touched, description: true})}
        error={touched.description && appDescriptionHelperMessage ? true : false}
        helperText={appDescriptionHelperMessage}
        FormHelperTextProps={{
          sx: { marginLeft: 0 }
        }}
      />
    </>
  )
}

export default ActiveStepZero
