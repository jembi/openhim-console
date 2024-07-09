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
  Radio
} from '@mui/material'
import {AppProps} from './FormInputProps'
import { useEffect } from 'react'

interface ActiveStepZeroProps {
  values: AppProps
  handleChange: {
    (e: React.ChangeEvent<any>): void
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void
  }
  setAppCategoryHelperMessage: React.Dispatch<React.SetStateAction<string>>
  setAppTitleHelperMessage: React.Dispatch<React.SetStateAction<string>>
  setAppDescriptionHelperMessage: React.Dispatch<React.SetStateAction<string>>
  appCategoryFieldRef: React.MutableRefObject<HTMLInputElement>
  appCategoryHelperMessage: string
  appTitleFieldRef: React.MutableRefObject<HTMLInputElement>
  appTitleHelperMessage: string
  appDescriptionHelperMessage: string
  appDescriptionFieldRef: React.MutableRefObject<HTMLInputElement>
  handleFormChanges: (values: AppProps) => void
}

const ActiveStepZero: React.FC<ActiveStepZeroProps> = ({
  values,
  handleChange,
  handleFormChanges,
  setAppCategoryHelperMessage,
  setAppTitleHelperMessage,
  setAppDescriptionHelperMessage,
  appCategoryFieldRef,
  appCategoryHelperMessage,
  appTitleFieldRef,
  appTitleHelperMessage,
  appDescriptionHelperMessage,
  appDescriptionFieldRef
}) => {
  const radioButtonOptions = [
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
    handleFormChanges(values);
  }, [values]);

  const generateRadioOptions = options =>
    options.map(option => {
      return (
        <FormControlLabel
          key={option.value}
          value={option.value}
          label={option.label}
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
        <RadioGroup
          id={'type'}
          name={'type'}
          row
          value={values.type}
          onChange={e => {
            handleChange(e)
          }}
        >
          {generateRadioOptions(radioButtonOptions)}
        </RadioGroup>
      </FormControl>
      <FormControl fullWidth required sx={{mt: 1}}>
        <InputLabel>{'category'}</InputLabel>
        <Select
          margin="dense"
          fullWidth
          inputRef={appCategoryFieldRef}
          onChange={e => {
            handleChange(e)
            setAppCategoryHelperMessage('')
          }}
          id={'category'}
          error={appCategoryHelperMessage ? true : false}
          name={'category'}
          value={values.category}
          label={'category'}
        >
          {generateSingleOptions(categoryOptions)}
        </Select>
        <FormHelperText error={appCategoryHelperMessage ? true : false}>
          {appCategoryHelperMessage}
        </FormHelperText>
      </FormControl>
      <TextField
        margin="dense"
        value={values.name}
        id="name"
        inputRef={appTitleFieldRef}
        label="App Title"
        type="text"
        fullWidth
        variant="outlined"
        required
        name="name"
        onChange={e => {
          handleChange(e)
          setAppTitleHelperMessage('')
        }}
        error={appTitleHelperMessage ? true : false}
        helperText={appTitleHelperMessage}
      />
      <TextField
        margin="dense"
        multiline
        inputRef={appDescriptionFieldRef}
        id="description"
        label="Description"
        type="text"
        fullWidth
        variant="outlined"
        name="description"
        value={values.description}
        onChange={e => {
          handleChange(e)
          setAppDescriptionHelperMessage('')
        }}
        error={appDescriptionHelperMessage ? true : false}
        helperText={appDescriptionHelperMessage}
      />
    </>
  )
}

export default ActiveStepZero
