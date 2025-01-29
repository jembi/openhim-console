import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import {ChannelRoute as ChannelRouteDef, ChannelRouteType} from '../../../types'

const defaultRoute: ChannelRouteDef = {
  status: 'enabled',
  name: '',
  type: 'http'
}

export function ChannelRoute(props: {
  route?: ChannelRouteDef
  onChange?: (event: {route: ChannelRouteDef; isValid: boolean}) => unknown
  onCancel?: () => unknown
}) {
  const isEditMode = !!props.route
  const [isFormTouched, setFormIsTouched] = React.useState(false)
  const isCreateMode = !isEditMode
  const [route, setRoute] = React.useState(
    structuredClone(
      props.route ?? {...defaultRoute, _id: Math.random().toString()}
    )
  )

  return (
    <Box>
      <Typography variant="h5" sx={{pb: '10px'}}>
        {isCreateMode ? 'Add New Route' : 'Edit Route'}
      </Typography>

      <Divider />

      <Grid spacing={1} container sx={{pt: '10px'}}>
        <Grid item xs={12}>
          <Typography sx={{fontWeight: 'bold'}} variant="h6">
            Essential Details
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Route Name"
            variant="outlined"
            fullWidth
            margin="normal"
            size="small"
            value={route.name}
            onChange={e => {
              setFormIsTouched(true)
              setRoute({...route, name: e.target.value})
            }}
            error={route.name.trim() === '' && isFormTouched}
            helperText={
              route.name.trim() === '' && isFormTouched
                ? 'Route Name cannot be empty'
                : undefined
            }
          />
        </Grid>

        {route.type === 'http' && (
          <React.Fragment key="http">
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Host"
                    variant="outlined"
                    fullWidth
                    size="small"
                    margin="normal"
                    value={route.host}
                    onChange={e => setRoute({...route, host: e.target.value})}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Port"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="number"
                    margin="normal"
                    value={route.port}
                    onChange={e =>
                      setRoute({...route, port: Number(e.target.value)})
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Route Path"
                    variant="outlined"
                    fullWidth
                    size="small"
                    margin="normal"
                    value={route.path}
                    onChange={e => setRoute({...route, path: e.target.value})}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Route Path Transform"
                    variant="outlined"
                    fullWidth
                    size="small"
                    margin="normal"
                    value={route.pathTransform}
                    onChange={e =>
                      setRoute({...route, pathTransform: e.target.value})
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Basic Authentication Username"
                    variant="outlined"
                    fullWidth
                    size="small"
                    margin="normal"
                    value={route.username}
                    onChange={e =>
                      setRoute({...route, username: e.target.value})
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Basic Authentication Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    margin="normal"
                    size="small"
                    value={route.password}
                    onChange={e =>
                      setRoute({...route, password: e.target.value})
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        )}

        {route.type === 'kafka' && (
          <React.Fragment key="kafka">
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Client ID"
                    variant="outlined"
                    fullWidth
                    size="small"
                    margin="normal"
                    value={route.kafkaClientId}
                    onChange={e =>
                      setRoute({...route, kafkaClientId: e.target.value})
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Topic Name"
                    variant="outlined"
                    fullWidth
                    size="small"
                    margin="normal"
                    value={route.kafkaTopic}
                    onChange={e =>
                      setRoute({...route, kafkaTopic: e.target.value})
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        )}

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={route.status === 'enabled'}
                onChange={e =>
                  setRoute({
                    ...route,
                    status: e.target.checked ? 'enabled' : 'disabled'
                  })
                }
              />
            }
            label="Enable Route"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography sx={{fontWeight: 'bold'}} variant="h6">
            Route Type
          </Typography>
          <RadioGroup
            style={{paddingLeft: '10px'}}
            defaultValue="http"
            value={route.type}
            onChange={e =>
              setRoute({
                ...route,
                type: e.target.value as ChannelRouteType
              })
            }
          >
            <FormControlLabel value="http" control={<Radio />} label="HTTP" />
            <FormControlLabel value="kafka" control={<Radio />} label="KAFKA" />
          </RadioGroup>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography sx={{fontWeight: 'bold'}} variant="h6">
          Settings
        </Typography>
        <FormHelperText>Choose all that apply.</FormHelperText>
      </Grid>

      {route.type === 'http' && (
        <React.Fragment>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={route.primary}
                  onChange={e =>
                    setRoute({...route, primary: e.target.checked})
                  }
                />
              }
              label="Primary Route?"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={route.waitPrimaryResponse}
                  onChange={e =>
                    setRoute({...route, waitPrimaryResponse: e.target.checked})
                  }
                />
              }
              label="Wait for Primary Response?"
            />
          </Grid>
        </React.Fragment>
      )}

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={route.secured}
              onChange={e => setRoute({...route, secured: e.target.checked})}
            />
          }
          label="Secured Route?"
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={route.forwardAuthHeader}
              onChange={e =>
                setRoute({
                  ...route,
                  forwardAuthHeader: e.target.checked
                })
              }
            />
          }
          label="Forward Auth Header?"
        />
      </Grid>

      <Divider sx={{pt: '10px'}} />

      <Grid container>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Grid container spacing={1} sx={{pt: '20px'}}>
            <Grid item xs={6}>
              <Button variant="text" color="info" onClick={props.onCancel}>
                CANCEL
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  props.onChange?.({
                    route: structuredClone(route),
                    isValid: !!route.name.trim()
                  })
                }
                disabled={!route.name.trim()}
              >
                {isCreateMode ? 'ADD ROUTE' : 'EDIT ROUTE'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
