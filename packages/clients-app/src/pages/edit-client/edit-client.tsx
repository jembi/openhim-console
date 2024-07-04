import {Box, Button, Card, Divider, Stack, Tab, Tabs} from '@mui/material'
import React, {FC, useState} from 'react'
import {AuthenticationModel, BasicInfoModel} from '../../interfaces'
import {Authentication} from '../components/authentication'
import {BasicInfo} from '../components/basic-info'
import {Client} from '../../types'

interface EditClientProps {
  returnToClientList: () => void
  client: BasicInfoModel | null
}

const EditClient: FC<EditClientProps> = ({returnToClientList, client}) => {
  if (client.clientID === null) {
    returnToClientList()
  }

  const [basicInfo, setBasicInfo] = useState<BasicInfoModel>(client)
  const [authType, setAuthType] = useState('jwt')
  const [authentication, setAuthentication] = useState<AuthenticationModel>({
    jwt: {
      secret: ''
    },
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

  const onBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBasicInfo({
      ...basicInfo,
      [e.target.id]: e.target.value
    })
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

  const [tabValue, setTabValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }
  return (
    <Box sx={{maxWidth: '85%', paddingLeft: 20}}>
      <h1>Edit Client</h1>

      <p>
        Control client systems and their access roles. Add clients to enable
        their request routing and group them by roles for streamlined channel
        access management
      </p>
      <Divider />
      <br />
      <Box sx={{ maxWidth: '60%', margin: 'auto'}}>
        <Card>
          <Box>
            <Tabs value={tabValue} onChange={handleChange} variant="fullWidth">
              <Tab label="Basic Info" id={`edit-client-tab-${0}`} />
              <Tab label="Authentication" id={`edit-client-tab-${1}`} />
            </Tabs>
          </Box>
          <BasicInfo
            basicInfo={basicInfo}
            onBasicInfoChange={onBasicInfoChange}
            setBasicInfo={setBasicInfo}
            hidden={tabValue !== 0}
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
          <Stack spacing={2} direction="row">
            <Button
              variant="outlined"
              id="cancel"
              color="success"
              onClick={() => returnToClientList()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              id="save"
              color="success"
              onClick={() => returnToClientList()}
            >
              Save
            </Button>
          </Stack>
        </Card>
      </Box>
    </Box>
  )
}

export default EditClient
