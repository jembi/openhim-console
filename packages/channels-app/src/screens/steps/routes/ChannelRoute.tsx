import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import {makeStyles} from '@mui/styles'
import React from 'react'
import {
  ChannelRoute as ChannelRouteDef,
  ChannelRouteType,
  ChannelType
} from '../../../types'

const useStyles = makeStyles(_theme => ({
  divider: {
    marginTop: '10px',
    margin: '0px',
    width: '100%',
    marginBottom: '10px',
    overflow: 'visible'
  },
  switchHelperText: {
    marginLeft: '45px'
  },
  routeTypeRadioGroup: {
    paddingLeft: '10px'
  }
}))

const defaultRoute: ChannelRouteDef = {
  name: '',
  type: 'http'
}

export function ChannelRoute(props: {
  route?: ChannelRouteDef
  onChange?: (event: {route: ChannelRouteDef; isValid: boolean}) => unknown
  onCancel?: () => unknown
}) {
  const isEditMode = !!props.route
  const isCreateMode = !isEditMode
  const classes = useStyles()
  const [route, setRoute] = React.useState(
    structuredClone(props.route ?? defaultRoute)
  )

  return (
    <Box>
      <Typography variant="h5">
        {isCreateMode ? 'Add New Route' : 'Edit Route'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Route Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={route.name}
            onChange={e => setRoute({...route, name: e.target.value})}
            error={route.name.trim() === ''}
            helperText={
              route.name.trim() === ''
                ? 'Route Name cannot be empty'
                : undefined
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={route.primary}
                onChange={e => setRoute({...route, primary: e.target.checked})}
              />
            }
            label="Primary Route?"
          />
          <FormHelperText className={classes.switchHelperText}>
            Toggle on if this is the primary route.
          </FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={route.waitPrimaryResponse}
                onChange={e =>
                  setRoute({...route, waitPrimaryResponse: e.target.checked})
                }
              />
            }
            label="Wait for Primary Response?"
          />
          <FormHelperText className={classes.switchHelperText}>
            Toggle on to wait for the response from the primary route before
            proceeding.
          </FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={route.status === 'enabled'}
                onChange={e =>
                  setRoute({
                    ...route,
                    status: e.target.checked ? 'enabled' : 'disabled'
                  })
                }
              />
            }
            label="Status"
          />
          <FormHelperText className={classes.switchHelperText}>
            Toggle on to enable this route.
          </FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={2}>
              <Typography variant="subtitle1">Route Type</Typography>
            </Grid>
            <Grid item xs={10}>
              <RadioGroup
                className={classes.routeTypeRadioGroup}
                defaultValue="http"
                value={route.type}
                row
                onChange={e =>
                  setRoute({
                    ...route,
                    type: e.target.value as ChannelRouteType
                  })
                }
              >
                <FormControlLabel
                  value="http"
                  control={<Radio />}
                  label="HTTP"
                />
                <FormControlLabel
                  value="kafka"
                  control={<Radio />}
                  label="KAFKA"
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={route.secured}
                onChange={e => setRoute({...route, secured: e.target.checked})}
              />
            }
            label="Secured Route?"
          />
          <FormHelperText className={classes.switchHelperText}>
            Toggle on if the route is secured. Uses default certificate
            authority.
          </FormHelperText>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Host"
                variant="outlined"
                fullWidth
                margin="normal"
                value={route.host}
                onChange={e => setRoute({...route, host: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Host"
                variant="outlined"
                fullWidth
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
                margin="normal"
                value={route.username}
                onChange={e => setRoute({...route, username: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Basic Authentication Password"
                variant="outlined"
                fullWidth
                type="password"
                margin="normal"
                value={route.password}
                onChange={e => setRoute({...route, password: e.target.value})}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={route.forwardAuthHeader}
                onChange={e =>
                  setRoute({...route, forwardAuthHeader: e.target.checked})
                }
              />
            }
            label="Forward Auth Header?"
          />
          <FormHelperText className={classes.switchHelperText}>
            Toggle on to foward the existing authorization header
          </FormHelperText>
        </Grid>

        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                variant="text"
                color="info"
                onClick={() => props.onCancel?.()}
              >
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
