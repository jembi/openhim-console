import ExtensionIcon from '@mui/icons-material/Extension'
import HomeIcon from '@mui/icons-material/Home'
import LinkIcon from '@mui/icons-material/Link'
import BuiltInIcon from '../../assets/icons/openhim-icon-logo.svg'
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
  Typography,
  Stack
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
      label: 'BUILT-IN',
      value: 'internal',
      icon: (isSelected) => (
        <img 
          src={BuiltInIcon} 
          alt="" 
          style={{ 
            width: 24, 
            height: 24,
            filter: isSelected ? 'brightness(0) invert(1)' : 'none'
          }} 
        />
      )
    },
    {
      label: 'EXTENSION',
      value: 'esmodule',
      icon: <ExtensionIcon sx={{ fontSize: 24, color: 'inherit' }} />
    },
    {
      label: 'SHORTCUT',
      value: 'external',
      icon: <LinkIcon sx={{ fontSize: 24, color: 'inherit' }} />
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

  return (
    <Stack spacing={3}>
      <FormControl fullWidth component="fieldset" required>
        <FormLabel 
          component="legend"
          sx={{
            mb: 2,
            color: 'text.primary',
            '&.Mui-focused': {
              color: 'text.primary'
            }
          }}
        >
          Select app type
        </FormLabel>
        <RadioGroup
          id="type"
          name="type"
          row
          value={app.type}
          onChange={e => {
            setApp({...app, type: e.target.value as App['type']})
          }}
          sx={{
            display: 'flex',
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: '8px',
            bgcolor: 'background.paper',
            overflow: 'hidden',
            '& .MuiFormControlLabel-root': {
              flex: 1,
              margin: 0,
              padding: 0,
              minHeight: 48,
              borderRight: '1px solid',
              borderColor: 'primary.main',
              '&:last-of-type': {
                borderRight: 'none'
              }
            }
          }}
        >
          {radioButtonOptions.map(option => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              sx={{
                bgcolor: app.type === option.value ? 'primary.main' : 'transparent',
                '&:hover': {
                  bgcolor: app.type === option.value 
                    ? 'primary.dark' 
                    : 'primary.lighter'
                },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              control={
                <Radio
                  sx={{
                    display: 'none',
                  }}
                />
              }
              label={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    width: '100%',
                    color: app.type === option.value ? 'common.white' : 'primary.main',
                    transition: 'all 0.2s',
                    '& svg': {
                      color: 'inherit'
                    }
                  }}
                >
                  {typeof option.icon === 'function' 
                    ? option.icon(app.type === option.value)
                    : option.icon}
                  <Typography
                    variant="button"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      letterSpacing: '0.1em'
                    }}
                  >
                    {option.label}
                  </Typography>
                </Box>
              }
              labelPlacement="start"
            />
          ))}
        </RadioGroup>
      </FormControl>
      <FormControl fullWidth required>
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
    </Stack>
  )
}

export default ActiveStepZero
