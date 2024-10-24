import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {AuthenticationModel} from '../../interfaces'
import {v4 as uuidv4} from 'uuid'
import {Client} from '../../types'
import {fetchCertificate, fetchAuthTypes} from '@jembi/openhim-core-api'
import './styles.css'

const buttonStyle = {
  borderColor: '#049D84',
  color: '#049D84'
}

interface AuthenticationProps {
  basicInfo: Client
  authType: string
  authentication: AuthenticationModel
  setAuthentication: React.Dispatch<React.SetStateAction<AuthenticationModel>>
  selectAuthenticationType: (e: React.MouseEvent<HTMLButtonElement>) => void
  onAuthenticationChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | {target: {id: string; value: string}}
  ) => void
  hidden?: boolean
}

export const Authentication: React.FC<AuthenticationProps> = ({
  authType,
  authentication,
  basicInfo,
  setAuthentication,
  selectAuthenticationType,
  onAuthenticationChange,
  hidden
}) => {
  const [certificates, setCertificates] = useState<any>([])
  const [authTypes, setAuthTypes] = useState<string[]>([])

  const checkAuthType = (authType: string) => {
    return !!authTypes.find(auth => auth === authType)
  }

  useEffect(() => {
    fetchCertificate()
      .then((certificates: any) => {
        setCertificates(certificates)
      })
      .catch((error: any) => {
        console.error('Failed to fetch certificates', JSON.stringify(error))
      })

    fetchAuthTypes()
      .then((authTypes: string[]) => {
        setAuthTypes(authTypes)
      })
      .catch((error: any) => {
        console.error(error)
      })
  }, [])
  return (
    <div hidden={hidden}>
      <Box sx={{marginLeft: 2}}>
        <br />
        <Typography variant="h5">Authentication</Typography>
        <Typography variant="subtitle1" sx={{fontSize: 13}}>
          Choose and configure the authentication type for securing
          client-server communication.
        </Typography>
        <br />
      </Box>

      <Divider />
      <Box sx={{marginLeft: 6, marginTop: 2, marginBottom: 4, width: 450}}>
        <Typography variant="body1">Select Type</Typography>
        <ButtonGroup>
          <Button
            variant="outlined"
            className={authType === 'jwt' ? 'selected' : ''}
            color="success"
            id="jwt"
            style={{
              ...buttonStyle,
              backgroundColor: authType === 'jwt' ? '#F3F3F3' : 'white',
              fontSize: 10
            }}
            onClick={selectAuthenticationType}
          >
            JSON WEB TOKEN
          </Button>
          <Button
            variant="outlined"
            className={authType === 'customToken' ? 'selected' : ''}
            color="success"
            id="customToken"
            style={{
              ...buttonStyle,
              backgroundColor: authType === 'customToken' ? '#F3F3F3' : 'white',
              fontSize: 10
            }}
            onClick={selectAuthenticationType}
          >
            CUSTOM TOKEN
          </Button>
          <Button
            variant="outlined"
            className={authType === 'mutualTLS' ? 'selected' : ''}
            color="success"
            id="mutualTLS"
            style={{
              ...buttonStyle,
              backgroundColor: authType === 'mutualTLS' ? '#F3F3F3' : 'white',
              fontSize: 10
            }}
            onClick={selectAuthenticationType}
          >
            MUTUAL TLS
          </Button>
          <Button
            variant="outlined"
            className={authType === 'basicAuth' ? 'selected' : ''}
            color="success"
            id="basicAuth"
            style={{
              ...buttonStyle,
              backgroundColor: authType === 'basicAuth' ? '#F3F3F3' : 'white',
              fontSize: 10
            }}
            onClick={selectAuthenticationType}
          >
            BASIC AUTH
          </Button>
        </ButtonGroup>
        
        {authType === 'jwt' && (
          <>
          <br />
          <br />
            <Typography variant="h6" sx={{fontWeight: 'bold'}}>JSON Web Token (JWT)</Typography>
            <br />
            <Typography variant="caption">
              Securely transmit information between a client and server as JSON
              object, signed using a secret or key pair
            </Typography>
            <br />
            <br />
            <Typography
              sx={{color: '#E65100', fontSize: 10, fontWeight: 'bold', textAlign: 'center'}}
              hidden={authTypes.find(auth => auth === 'jwt') !== undefined}
            >
              JWT authentication is disabled on the OpenHIM Core.
            </Typography>
          </>
        )}
        {authType === 'customToken' && (
          <>
          <br />
          <br />
            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Custom Token</Typography>
            <br />
            <Typography variant="caption">
              Set an ID to verify the client. The ID can be any unique string
            </Typography>
            <TextField
              id="customToken"
              label="Custom Token"
              fullWidth
              onChange={onAuthenticationChange}
              value={authentication.customToken.token}
              disabled={!checkAuthType('custom-token-auth')}
              InputProps={{
                endAdornment: (
                  <p
                    onClick={() => {
                      if (checkAuthType('custom-token-auth')) {
                        setAuthentication({
                          ...authentication,
                          customToken: {
                            token: uuidv4()
                          }
                        })
                      }
                    }}
                    style={{
                      fontSize: 8,
                      cursor: checkAuthType('custom-token-auth')
                        ? 'pointer'
                        : 'not-allowed'
                    }}
                  >
                    Generate UUID
                  </p>
                )
              }}
            />
            <p
              style={{color: '#E65100', fontSize: 10, fontWeight: 'bold', textAlign: 'center'}}
              hidden={checkAuthType('custom-token-auth')}
            >
              Custom Token Authentication is disabled on the OpenHIM Core.
            </p>
          </>
        )}
        {authType === 'mutualTLS' && (
          <>
          <br />
          <br />  
            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Mutual TLS</Typography>
            <br />
            <Typography variant="caption">
              Set Up an encrypted channel by providing the client's domain and
              certificate
            </Typography>
            <Stack spacing={2} direction="row">
              <TextField
                id="domain"
                label="Domain"
                onChange={onAuthenticationChange}
              />
              <FormControl fullWidth>
                <InputLabel id="certificate-label">Certificate</InputLabel>
                <Select
                  labelId="certificate-label"
                  onChange={e => {
                    onAuthenticationChange({
                      target: {
                        id: 'certificate',
                        value: e.target.value
                      }
                    })
                  }}
                  value={authentication.mutualTLS.certificate}
                  id="certificate"
                >
                  <MenuItem value="">
                    <em>No Certificate Selected</em>
                  </MenuItem>
                  {certificates.map((certificate: any) => (
                    <MenuItem
                      key={certificate.fingerprint}
                      value={certificate.fingerprint}
                    >
                      {certificate.commonName}, {certificate.organization}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </>
        )}
        {authType === 'basicAuth' && (
          <>
          <br />
          <br />
            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Basic Auth</Typography>
            <br />
            <Typography variant="caption">
              Requires a username and password. Set the password below
            </Typography>
            <Stack spacing={2} direction="row">
              <TextField
                fullWidth
                id="clientID"
                value={basicInfo.clientID}
                disabled
              />
              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                onChange={onAuthenticationChange}
              />
            </Stack>
          </>
        )}
      </Box>
    </div>
  )
}
