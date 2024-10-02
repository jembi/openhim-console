import {
  Box,
  Button,
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
        <h3 style={{fontSize: 24, fontWeight: 'normal', marginBottom: -10}}>
          Authentication
        </h3>
        <p style={{opacity: 0.6, fontSize: '12px'}}>
          Choose and configure the authentication type for securing
          client-server communication.
        </p>
      </Box>

      <Divider />
      <Box sx={{marginLeft: 6, marginTop: 2, marginBottom: 4, width: 450}}>
        <p>Select Type</p>
        <Button
          variant="outlined"
          className={authType === 'jwt' ? 'selected' : ''}
          color="success"
          id="jwt"
          style={{
            ...buttonStyle,
            backgroundColor: authType === 'jwt' ? '#F3F3F3' : 'white'
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
            backgroundColor: authType === 'customToken' ? '#F3F3F3' : 'white'
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
            backgroundColor: authType === 'mutualTLS' ? '#F3F3F3' : 'white'
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
            backgroundColor: authType === 'basicAuth' ? '#F3F3F3' : 'white'
          }}
          onClick={selectAuthenticationType}
        >
          BASIC AUTH
        </Button>
        {authType === 'jwt' && (
          <>
            <h3 style={{fontSize: 20}}>JSON Web Token (JWT)</h3>
            <p style={{fontSize: 12}}>
              Securely transmit information between a client and server as JSON
              object, signed using a secret or key pair
            </p>
            <p
              style={{color: '#E65100', fontSize: 12, textAlign: 'center'}}
              hidden={authTypes.find(auth => auth === 'jwt') !== undefined}
            >
              JWT authentication is disabled on the OpenHIM Core.
            </p>
          </>
        )}
        {authType === 'customToken' && (
          <>
            <h3 style={{fontSize: 20}}>Custom Token</h3>
            <p style={{fontSize: 12}}>
              Set an ID to verify the client. The ID can be any unique string
            </p>
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
              style={{color: '#E65100', fontSize: 12, textAlign: 'center'}}
              hidden={checkAuthType('custom-token-auth')}
            >
              Custom Token Authentication is disabled on the OpenHIM Core.
            </p>
          </>
        )}
        {authType === 'mutualTLS' && (
          <>
            <h3 style={{fontSize: 20}}>Mutual TLS</h3>
            <p style={{fontSize: 12}}>
              Set Up an encrypted channel by providing the client's domain and
              certificate
            </p>
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
            <h3 style={{fontSize: 20}}>Basic Auth</h3>
            <p style={{fontSize: 12}}>
              Requires a username and password. Set the password below
            </p>
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
