import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import React, {useState} from 'react'
import {AuthenticationModel, BasicInfoModel} from '../../interfaces'
import {Authentication} from '../components/authentication'
import {BasicInfo} from '../components/basic-info'
import {ClientSchema} from '../../types'
import CryptoJS from 'crypto-js'
import {editClient} from '@jembi/openhim-core-api'
import {useSnackbar} from 'notistack'
import {AxiosError} from 'axios'
import {fetchClientById} from '@jembi/openhim-core-api'
import { useLoaderData } from 'react-router-dom'

export async function loader({params}) {
  const client = await fetchClientById(params['clientId']);
  return {client};
}

const EditClient = () => {
  const { client } = useLoaderData() as { client: BasicInfoModel };

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string
  }>({})
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const [basicInfo, setBasicInfo] = useState<BasicInfoModel | null>(client)
  const [authType, setAuthType] = useState('jwt')
  const [authentication, setAuthentication] = useState<AuthenticationModel>({
    customToken: {
      token: ''
    },
    mutualTLS: {
      domain: '',
      certificate: ''
    },
    basicAuth: {
      password: ''
    }
  })

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

    editClient(client['_id'], clientsPayload)
      .then(() => {
        enqueueSnackbar('Client edited successfully', {variant: 'success'})
      })
      .catch((error: AxiosError) => {
        if (error?.response && error.response?.data) {
          enqueueSnackbar(error.response.data, {variant: 'error'})
        } else {
          console.log(JSON.stringify(error))
          enqueueSnackbar('Error while editing client', {variant: 'error'})
        }
      })
      .finally(() => {
        window.history.pushState({}, '', '/#!/clients')
      })
  }

  const onBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newBasicInfoState = {
      ...basicInfo,
      [e.target.id]: e.target.value
    }
    // @ts-ignore
    setBasicInfo(newBasicInfoState)
    validateBasicInfoField(e.target.id, newBasicInfoState)
  }

  const selectAuthenticationType = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAuthType(e.currentTarget.id)
  }

  const onAuthenticationChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | {target: {id: string; value: string}}
  ) => {
    setAuthentication({
      ...authentication,
      [authType]: {
        ...authentication[authType],
        [e.target.id]: e.target.value
      }
    })
  }

  const [tabValue, setTabValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }
  return (
    <Grid container spacing={2} padding={2}>
      <Grid item xs={12}>
        <Typography variant="h3" fontSize={'32px'} fontWeight={400}>
          Edit Client
        </Typography>

        <p style={{opacity: 0.6, fontSize: '16px'}}>
          Control client systems and their access roles. Add clients to enable
          their request routing and group them by roles for streamlined channel
          access management
        </p>
        <Divider />
      </Grid>
      <Grid item xs={12}>
          <Card sx={{width: 550, margin: 'auto'}}>
            <Box>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                variant="fullWidth"
              >
                <Tab label="Basic Info" id={`edit-client-tab-${0}`} />
                <Tab label="Authentication" id={`edit-client-tab-${1}`} />
              </Tabs>
            </Box>
            <BasicInfo
              basicInfo={basicInfo}
              onBasicInfoChange={onBasicInfoChange}
              setBasicInfo={setBasicInfo}
              validationErrors={validationErrors}
              validateBasicInfoField={validateBasicInfoField}
              hidden={tabValue !== 0}
              editMode={true}
            />
            <Authentication
              authType={authType}
              authentication={authentication}
              basicInfo={basicInfo}
              setAuthentication={setAuthentication}
              selectAuthenticationType={selectAuthenticationType}
              onAuthenticationChange={onAuthenticationChange}
              hidden={tabValue !== 1}
            />
            <Divider />
            <br />
            <Stack spacing={2} direction="row" sx={{marginBottom: 1, marginLeft: 2}}>
              <Button
                variant="outlined"
                id="cancel"
                color="success"
                sx={{color: '#29AC96'}}
                onClick={() => window.history.pushState({}, '', '/#!/clients')}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                id="save"
                color="success"
                sx={{backgroundColor: '#29AC96'}}
                onClick={() => onSaveButtonClicked()}
              >
                Save
              </Button>
            </Stack>
          </Card>
      </Grid>
    </Grid>
  )
}

export default EditClient
