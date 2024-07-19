import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'
import {FC, useEffect, useState} from 'react'
import {AuthenticationModel, BasicInfoModel} from '../../interfaces'
import {BasicInfo} from '../components/basic-info'
import {Authentication} from '../components/authentication'
import {
  Client,
  ClientSchema,
  Authentication as AuthenticationType,
  AuthenticationSchema
} from '../../types'
import {addClient} from '@jembi/openhim-core-api'
import CryptoJS from 'crypto-js'
import './style.css'
import {AxiosError} from 'axios'
import {useSnackbar} from 'notistack'

interface AddClientProps {
  returnToClientList: () => void
}

export const AddClient: FC<AddClientProps> = ({returnToClientList}) => {
  //TODO: Make sure that there is a safe guard when incrementing this value to prevent it from going over the number of steps
  const [activeStep, setActiveStep] = useState(0)
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string
  }>({})
  const labelProps: {optional?: React.ReactNode} = {}
  const [basicInfo, setBasicInfo] = useState<Client>({
    clientID: '',
    name: '',
    roles: [],
    organization: '',
    softwareName: '',
    description: '',
    location: '',
    contactPerson: '',
    contactPersonEmail: null
  })
  const [authType, setAuthType] = useState('jwt')
  const [authentication, setAuthentication] = useState<AuthenticationModel>({
    customToken: {
      token: ''
    },
    mutualTLS: {
      domain: '',
      certificate: null
    },
    basicAuth: {
      password: ''
    }
  })

  const onNextButtonClicked = () => {
    const validation = ClientSchema.safeParse(basicInfo)
    if (!validation.success) {
      // add empty string case for email
      const validationErrors = {}
      validation.error.errors.forEach(error => {
        validationErrors[error.path[0]] = error.message
      })
      setValidationErrors(validationErrors)

      alert('Please fill resolve the validation errors before proceeding.')
      // set the validation errors within the state
      return
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  const onSaveButtonClicked = () => {
    const basicAuth = {
      passwordSalt: null,
      passwordHash: null,
      passwordAlgorithm: null
    }

    if (authentication.basicAuth?.password) {
      const salt = CryptoJS.lib.WordArray.random(16).toString()
      const sha512 = CryptoJS.algo.SHA512.create()
      sha512.update(authentication.basicAuth?.password)
      sha512.update(salt)
      const hash = sha512.finalize()

      basicAuth.passwordSalt = salt
      basicAuth.passwordHash = hash.toString(CryptoJS.enc.Hex)
      basicAuth.passwordAlgorithm = 'sha512'
    }

    let clientsPayload = {
      ...basicInfo,
      clientDomain: authentication.mutualTLS?.domain,
      ...(authentication.mutualTLS?.certificate
        ? {certFingerprint: authentication.mutualTLS.certificate}
        : {}),
      ...(authentication.customToken?.token
        ? {customTokenID: authentication.customToken.token}
        : {}),
      ...(basicAuth?.passwordHash ? basicAuth : {})
    }

    addClient(clientsPayload)
      .then(() => {
        enqueueSnackbar('Client added successfully', {variant: 'success'})
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          enqueueSnackbar(error.response.data, {variant: 'error'})
        } else {
          console.log(JSON.stringify(error))
          enqueueSnackbar('Error while creating new client', {variant: 'error'})
        }
      })
      .finally(() => {
        returnToClientList()
      })
  }

  const validateBasicInfoField = (
    field: string,
    newBasicInfoState?: object
  ) => {
    const validate = ClientSchema.safeParse(newBasicInfoState || basicInfo)
    if (!validate.success) {
      const message = validate.error.errors.filter(
        error => error.path[0] === field
      )[0]?.message
      if (message) {
        setValidationErrors({
          ...validationErrors,
          [field]: message
        })
      } else {
        const {[field]: _, ...rest} = validationErrors
        setValidationErrors(rest)
      }
    } else {
      setValidationErrors({})
    }
  }

  const onBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newBasicInfoState = {
      ...basicInfo,
      [e.target.id]: e.target.value
    }
    setBasicInfo(newBasicInfoState)
    validateBasicInfoField(e.target.id, newBasicInfoState)
  }

  const selectAuthenticationType = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAuthType(e.currentTarget.id)
  }

  const onAuthenticationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAuthentication({
      ...authentication,
      [authType]: {
        ...authentication[authType],
        [e.target.id]: e.target.value
      }
    })
  }

  const onNavigateClicked = (direction: string) => {
    if (direction === 'next') {
      onNextButtonClicked()
    }
    if (direction === 'back') {
      setActiveStep(activeStep - 1)
    }
    if (direction === 'cancel') {
      returnToClientList()
    }
    if (direction === 'save') {
      onSaveButtonClicked()
    }
  }

  return (
    <Grid container spacing={2} padding={2}>
      <Grid item xs={12}>
        <Typography variant="h3" fontSize={'32px'} fontWeight={400}>
          Add Client
        </Typography>

        <p style={{opacity: 0.6, fontSize: '16px'}}>
          Control client systems and their access roles. Add clients to enable
          their request routing and group them by roles for streamlined channel
          access management
        </p>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Card variant="outlined" sx={{margin: 'auto', maxWidth: 610}}>
          <Box>
            <Stepper sx={{paddingTop: 2}} activeStep={activeStep}>
              <Step key={'basic-info'}>
                <StepLabel sx={{fontSize: 20}} {...labelProps}>
                  <p style={{fontSize: 14}}>Basic Info</p>
                </StepLabel>
              </Step>
              <Step key={'authentication'}>
                <StepLabel {...labelProps}>
                  <p style={{fontSize: 14}}>Authentication</p>
                </StepLabel>
              </Step>
            </Stepper>
          </Box>
          <Divider />
          <Box>
            {activeStep === 0 ? (
              <BasicInfo
                basicInfo={basicInfo}
                onBasicInfoChange={onBasicInfoChange}
                setBasicInfo={setBasicInfo}
                validationErrors={validationErrors}
                validateBasicInfoField={validateBasicInfoField}
              />
            ) : (
              <Authentication
                authType={authType}
                authentication={authentication}
                basicInfo={basicInfo}
                setAuthentication={setAuthentication}
                selectAuthenticationType={selectAuthenticationType}
                onAuthenticationChange={onAuthenticationChange}
              />
            )}
            <br />
            <Stack
              spacing={2}
              direction="row"
              sx={{marginBottom: 1, marginLeft: 2}}
            >
              <Button
                variant="outlined"
                id={activeStep === 0 ? 'cancel' : 'back'}
                color="success"
                onClick={e => onNavigateClicked(e.currentTarget.id)}
              >
                {activeStep === 0 ? 'Cancel' : 'Back'}
              </Button>
              <Button
                variant="contained"
                id={activeStep === 0 ? 'next' : 'save'}
                color="success"
                sx={{backgroundColor: '#29AC96'}}
                onClick={e => onNavigateClicked(e.currentTarget.id)}
              >
                {activeStep === 0 ? 'Next' : 'Save'}
              </Button>
            </Stack>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}
