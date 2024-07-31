import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, InputAdornment, InputLabel, ListItemText, MenuItem, stackClasses, Step, StepLabel, Stepper, Switch, TextField, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { fetchClients, fetchRoles, createChannel } from '@jembi/openhim-core-api'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const steps: {key: string, label: string}[] = [
  {key: 'basic-info', label: 'Basic Info'},
  {key: 'request-matching', label: 'Request Matching'},
  {key: 'routes', label: 'Routes'}
]

const allowedMethods: string[][] = [
  ['GET', 'HEAD'], ['POST', 'TRACE'], ['DELETE', 'CONNECT'], ['PUT', 'PATCH'], ['OPTIONS']
]

const channelTypes: string[] = ['HTTP', 'TCP', 'TLS', 'Polling']

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Channel {
  name: string;
  description: string;
  urlPattern: string;
  isAsynchronousProcess: boolean;
  maxBodyAgeDays: number;
  timeout: number;
  status: string;
  methods: string[];
  type: string;
  priority: number;
  tcpPort: number;
  tcpHost: string;
  pollingSchedule: string;
  requestBody: boolean;
  allow: string[];
  whitelist: string[];
  authType: string;
  routes: any[]
}

const channelTemplate: Channel = {
  name: '',
  description: '',
  urlPattern: '',
  isAsynchronousProcess: false,
  maxBodyAgeDays: null,
  timeout: null,
  status: 'Enabled',
  methods: [],
  type: '',
  priority: null,
  tcpPort: null,
  tcpHost: '',
  pollingSchedule: '',
  requestBody: false,
  allow: [],
  whitelist: [],
  authType: '',
  routes: []
}

const BasicInfo = ({ setDisplay, setActiveStep, channel, setChannel }) => {
  const [name, setName] = useState<string>(channel.name)
  const [channelMethods, setMethods] = useState<string[]>(channel.methods || [])
  const [description, setDescription] = useState<string>(channel.description)
  const [type, setChannelType] = useState<string>(channel.type)
  const [timeout, setChannelTimeout] = useState<string>(channel.timeout)
  const [enabled, setChannelEnabled] = useState<string>(channel.status)

  return (
    <Box>
      <Typography paddingLeft={1} variant="h5">Basic Info</Typography>
      <Typography paddingLeft={1}>
        Describe some basic information about the channel and choose its overall type.
      </Typography>
      <br/>
      <Divider />
      <br />
      <Card style={{paddingLeft: 10}}>
        <br />
        <TextField
          id="channelName"
          label="Channel Name"
          placeholder=""
          helperText="Choose a short but descriptive name."
          variant='outlined'
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        <br/>
        <br/>
        <br/>
        <Typography variant="h5">Allowed Methods</Typography>
        <br/>
        {
          allowedMethods.map(methods =>
            <FormGroup key={methods[0]} style={{flexDirection: 'row', paddingLeft: 20}}>
              {methods[0] && <FormControlLabel style={{width: '10%', paddingRight: '40%'}} control={<input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target?.checked) {
                  setMethods([...channelMethods, methods[0]])
                } else {
                  setMethods(channelMethods.filter(meth => meth != methods[0]))
                }
              }} type='checkbox' checked={channelMethods.includes(methods[0])}/>} label={methods[0]}/>}
              {methods[1] && <FormControlLabel control={<input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target?.checked) {
                  setMethods([...channelMethods, methods[1]])
                } else {
                  setMethods(channelMethods.filter(meth => meth != methods[1]))
                }
              }} type='checkbox' checked={channelMethods.includes(methods[1])}/>} label={methods[1]}/>}
            </FormGroup>
          )
        }
        <br/>
        <Accordion style={{ width: '98%'}}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>Optional Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              id="channelDescription"
              label="Channel Description"
              placeholder=""
              helperText="Help others understand this channel."
              variant='outlined'
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              value={description}
              style={{width: '80%'}}
            />
            <br/>
            <br/>
            <Typography variant="h5">Channel Type</Typography>
            <br/>
            {
              channelTypes.map(chanType =>
                <FormGroup key={chanType} style={{ paddingLeft: 20}}>
                  <FormControlLabel control={<input checked={type === chanType} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target?.checked) {
                      setChannelType(chanType)
                    } else {
                      setChannelType('')
                    }
                  }} type='radio'/>} label={chanType}/>
                </FormGroup>
              )
            }
            <br/>
            <TextField
              id="channelTimeout"
              label="Channel Timeout ms"
              placeholder=""
              value={timeout}
              variant='outlined'
              inputProps={{ inputMode: 'numeric' }}
              onChange={(e) => {
                setChannelTimeout(e.target.value)
              }}
            />
            <br/>
            <br/>
            <FormControlLabel control={<Switch onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setChannelEnabled(e.target?.checked ? "enabled" : "disabled")
            }} checked={enabled === "enabled"} />} label='Enable Channel'/>
            <br/>
          </AccordionDetails>
        </Accordion>
        <Divider/>
        <CardActions>
          <Button variant="outlined" color="success" onClick={() => setDisplay('list')}>Cancel</Button>
          <Button variant="contained" color="success" onClick={() => {
            setChannel({...channel, name, description, methods: channelMethods, type, timeout, status: enabled})
            setActiveStep(1)
          }}>Next</Button>
        </CardActions>
      </Card>
    </Box>
  )
}

const RequestMatching = ({ setActiveStep, setChannel, channel }) => {
  const [allowedClients, setAllowedClients] = useState<string[]>(channel.allow)
  const [clients, setClients] = useState<string[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [allowedRoles, setAllowedRoles] = useState<string[]>([])
  const [urlPattern, setUrlPattern] = useState<string>(channel.urlPattern)
  const [autoRegexEnabled, setAutoRegexEnabled] = useState<boolean>(true)

  useEffect(() => {
    fetchClients().then(clients => {
      setClients(clients.map(client => client.clientID))
      setAllowedClients(clients.map(client => client.clientID).filter(id => channel.allow.includes(id)))
    })

    fetchRoles().then(roles => {
      // @ts-ignore
      setRoles(roles.map(role => role.name))
      setAllowedRoles(roles.map(role => role.name).filter(name => channel.allow.includes(name)))
    })
  }, [])

  const handleChange = (event: SelectChangeEvent<typeof clients>) => {
    const {
      target: { value },
    } = event;
    setAllowedClients(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleChangeRoles = (event: SelectChangeEvent<typeof roles>) => {
    const {
      target: { value },
    } = event;
    setAllowedRoles(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Box>
      <Typography paddingLeft={1} variant="h5">Request Matching</Typography>
      <Typography paddingLeft={1}>
        Set criteria for requests to be forwarded to this channel.
      </Typography>
      <br/>
      <Divider />
      <br />
      <Card style={{paddingLeft: 10}}>
        <br/>
        <TextField
          id="channelUrlPattern"
          label="Channel Url Pattern"
          placeholder="/fhir.*"
          helperText="Which URL patterns will match the channel?"
          variant='outlined'
          required={true}
          onChange={(e) => {
            setUrlPattern(e.target.value)
          }}
          value={urlPattern}
          style={{width: '80%'}}
          InputProps={{
            startAdornment: <InputAdornment position="start">^</InputAdornment>,
            endAdornment: <InputAdornment position="end">$</InputAdornment>
          }}
        />
        <br/>
        <br/>
        <FormControlLabel control={<Switch value={autoRegexEnabled} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setAutoRegexEnabled(e.target.checked)
        }} checked />} label='Auto-add regex delimiters (Recommended)'/>
        <br/>
        <br/>
        <FormControl sx={{width: '80%',}}>
          <InputLabel>
            Clients
          </InputLabel>
          <Select
            multiple
            onChange={handleChange}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            value={allowedClients}
          >
            {
              clients.map(client => (
                <MenuItem key={client} value={client}>
                  <Checkbox checked={allowedClients.indexOf(client) > -1} />
                  <ListItemText primary={client} />
                </MenuItem>
              ))
            }
          </Select>
          <FormHelperText>Which clients should be able to access the channel?</FormHelperText>
        </FormControl>
        <br/>
        <br/>
        <FormControl sx={{width: '80%',}}>
          <InputLabel>
            Roles
          </InputLabel>
          <Select
            multiple
            onChange={handleChangeRoles}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            value={allowedRoles}
          >
            {
              roles.map(role => (
                <MenuItem key={role} value={role}>
                  <Checkbox checked={allowedRoles.indexOf(role) > -1} />
                  <ListItemText primary={role} />
                </MenuItem>
              ))
            }
          </Select>
          <FormHelperText>Which roles should be able to access the channel?</FormHelperText>
        </FormControl>
        <br/>
        <br/>
        <CardActions>
          <Button variant="outlined" color="success" onClick={() => setActiveStep(0)}>Back</Button>
          <Button variant="contained" color="success" onClick={() => {
            setChannel({...channel, urlPattern, allow: allowedRoles.concat(allowedClients)})
            setActiveStep(2)
          }}>Next</Button>
        </CardActions>
      </Card>
    </Box>
  )
}

const Routes = ({ setDisplay, setActiveStep, setChannel, channel }) => {
  const [routeID, setRouteId] = useState<string>('')
  const [routes, setRoutes] = useState(channel.routes || [])
  const [displayAddRoute, setDisplayAddRoute] = useState<boolean>(false)
  const [name, setRouteName] = useState<string>('')
  const [primary, setPrimaryRoute] = useState<boolean>(!routes.length)
  const [waitForPrimary, setWaitForPrimary] = useState<boolean>(true)
  const [enableRoute, setEnableRoute] = useState<boolean>(true)
  const [routeType, setRouteType] = useState<string>('')
  const [secured, setSecured] = useState<boolean>(false)
  const [host, setHost] = useState<string>('')
  const [port, setPort] = useState<string>('')
  const [path, setPath] = useState<string>('')
  const [pathTransform, setPathTransform] = useState<string>('')
  const [routeAuthPassword, setRouteAuthPassword] = useState<string>('')
  const [routeAuthUsername, setRouteAuthUsername] = useState<string>('')
  const [forwardHeaders, setForwardHeaders] = useState<boolean>(false)

  const columns = [
    {field: 'name', headerName: 'Name', flex: 0.3},
    {field: 'type', headerName: 'Type', flex: 0.1},
    {field: 'host', headerName: 'Host', flex: 0.2},
    {field: 'port', headerName: 'Port', flex: 0.2},
    {field: 'path', headerName: 'Path', flex: 0.2},
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      renderCell: params => (
        <>
          <CreateIcon
            style={{cursor: 'pointer'}}
            onClick={() => {
            }}
          />
          <DeleteIcon
            style={{cursor: 'pointer'}}
            onClick={() => {
              setRouteId(params.row['_id'])
            }}
          />
        </>
      )
    }
  ]

  return (
    <Box>
      <Typography paddingLeft={1} variant="h5">Routes</Typography>
      <Typography paddingLeft={1}>
        Set the routes to route to.
      </Typography>
      <br/>
      <Divider />
      <br />
      <Card style={{paddingLeft: 10, paddingRight: 10}}>
        <DataGrid
          getRowId={row => row.name}
          columns={columns}
          slots={{toolbar: GridToolbar}}
          rows={routes}
          initialState={{
            pagination: {
              paginationModel: {page: 0, pageSize: 10}
            }
          }}
          pageSizeOptions={[10, 25, 50]}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
              printOptions: {disableToolbarButton: true},
              csvOptions: {disableToolbarButton: true}
            }
          }}
        />
        <br/>
        {
          !displayAddRoute ? <Button style={{paddingLeft: '80%'}} color="primary" variant="text" onClick={() => setDisplayAddRoute(true)}>
            Add new route
          </Button> :
          <Box>
            <Typography paddingLeft={1} variant="h5">Add new route</Typography>
            <br/>
            <TextField
              id="routeName"
              label="Route Name"
              helperText="Choose descriptive name for this route."
              variant='outlined'
              required={true}
              value={name}
              onChange={(e) => setRouteName(e.target.value)}
              style={{width: '80%'}}
            />
            <br/>
            <br/>
            <FormControl>
              <FormControlLabel control={<Switch value={primary} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPrimaryRoute(e.target?.checked)
              }} checked />} label='Primary Route?'/>
              <FormHelperText style={{ paddingLeft: 30 }}>Toogle on if this is the primary route.</FormHelperText>
            </FormControl>
            <br/>
            <FormControl>
              <FormControlLabel control={<Switch value={waitForPrimary} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setWaitForPrimary(e.target?.checked)
              }} checked />} label='Wait for Primary Response?'/>
              <FormHelperText style={{ paddingLeft: 30 }}>Toogle on to wait for the response from the primary route before processing.</FormHelperText>
            </FormControl>
            <br/>
            <FormControl>
              <FormControlLabel control={<Switch value={enableRoute} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEnableRoute(e.target?.checked)
              }} checked />} label='Status'/>
              <FormHelperText style={{ paddingLeft: 30 }}>Toogle on to enable this route.</FormHelperText>
            </FormControl>
            <br/>
            <br/>
            <FormGroup style={{ flexDirection: 'row'}}>
              <Typography paddingLeft={1} variant="h5">Route Type</Typography>
              <FormControlLabel style={{width: '10%', paddingLeft: '10%'}} control={<input checked={routeType === "HTTP"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.checked) {
                  setRouteType("HTTP")
                } else {
                  setRouteType("")
                }
              }} type='checkbox'/>} label="HTTP"/>
              <FormControlLabel control={<input checked={routeType === "KAFKA"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.checked) {
                  setRouteType("KAFKA")
                } else {
                  setRouteType("")
                }
              }} type='checkbox'/>} label='KAFKA'/>
            </FormGroup>
            <br/>
            <br/>
            <FormControl>
              <FormControlLabel control={<Switch checked={secured} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSecured(e.target.checked)
              }} />} label='Secured Route?'/>
              <FormHelperText style={{ paddingLeft: 30 }}>Toogle on if the route is secured. Uses default certificate  authority.</FormHelperText>
            </FormControl>
            <br/>
            <br/>
            <FormGroup style={{ flexDirection: 'row'}}>
              <TextField
                id="host"
                label="Host"
                helperText=""
                variant="outlined"
                required={true}
                style={{ width: "48%", paddingRight: 20 }}
                value={host}
                onChange={e => {
                  setHost(e.target.value)
                }}
              />
              <TextField
                id="port"
                label="Port"
                helperText=""
                variant="outlined"
                required={true}
                style={{ width: "48%" }}
                value={port}
                onChange={e => setPort(e.target.value)}
              />
            </FormGroup>
            <br/>
            <FormGroup style={{ flexDirection: 'row' }}>
              <TextField
                id="routePath"
                label="Path"
                helperText=""
                variant="outlined"
                style={{ width: "48%", paddingRight: 20}}
                value={path}
                onChange={e => setPath(e.target.value)}
              />
              <TextField
                id="routePathTransform"
                label="Route Path Transform"
                helperText="Using defined format eg s/from/to/g"
                variant="outlined"
                style={{width: "48%"}}
                value={pathTransform}
                onChange={e => setPathTransform(e.target.value)}
              />
            </FormGroup>
            <br/>
            <FormGroup style={{ flexDirection: 'row'}}>
              <TextField
                id="authName"
                label="Basic Authentication Username"
                helperText=""
                variant="outlined"
                style={{ width: "48%", paddingRight: 20 }}
                value={routeAuthUsername}
                onChange={e => setRouteAuthUsername(e.target.value)}
              />
              <TextField
                id="authPassword"
                label="Basic Authentication Password"
                helperText=""
                variant="outlined"
                style={{ width: "48%" }}
                value={routeAuthPassword}
                onChange={e => setRouteAuthPassword(e.target.value)}
              />
            </FormGroup>
            <br/>
            <FormControl>
              <FormControlLabel control={<Switch checked={forwardHeaders} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForwardHeaders(e.target.checked)
              }} />} label='Forward Auth Header?'/>
              <FormHelperText style={{ paddingLeft: 30 }}>Toogle on to forward existing authorization header.</FormHelperText>
            </FormControl>
            <CardActions style={{paddingLeft: '70%', justifyItems: "center"}}>
              <Button variant="outlined" color="success" onClick={() => setDisplayAddRoute(false)}>Cancel</Button>
              <Button variant="contained" color="success" onClick={() => {
                const route = {name, host, port, path, secured, type: routeType, pathTransform, primary, username: routeAuthUsername, password: routeAuthPassword, waitPrimaryResponse: waitForPrimary, forwardAuthHeaders: forwardHeaders }
                let newRoutes = routes
                if (primary) {
                  newRoutes = routes.map(route => {
                    route.primary = false
                    return route
                  })
                }
                setRoutes([...newRoutes, route])
                setChannel({...channel, routes: [...newRoutes, route]})
                setDisplayAddRoute(false)
              }}>Save</Button>
            </CardActions>
          </Box>
        }
        <CardActions>
          <Button variant="outlined" color="success" onClick={() => setActiveStep(1)}>Back</Button>
          <Button variant="contained" color="success" onClick={() => {
            createChannel(channel).then(() => {
              setActiveStep(0)
              setDisplay('list')
            }).catch(() => {})
          }}>Save</Button>
        </CardActions>
      </Card>
    </Box>
  )
}

export const EditAdd = ({ setDisplay }) => {
  const [activeStep, setActiveStep] = useState(0)
  const labelProps: {optional?: React.ReactNode} = {}
  const [channel, setChannel] = useState<Channel>(channelTemplate)

  return (
    <>
      <Box sx={{
        display: { xs: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '150px' }
      }} padding={15} display={"flex"}>
        <Typography variant='h4'>Add Channel</Typography>
        <br/>
        <Typography variant="h6">Create a channel and configure the clients and roles that can use the channel.</Typography>
        <br/>
        <Divider />
        <br/>
        <Card variant="outlined" style={{borderRadius: 5}} sx={{margin: 'auto', maxWidth: 610}}>
          <br/>
          <Stepper activeStep={activeStep}>
            {
              steps.map(step => (
                <Step key={step.key}>
                  <StepLabel {...labelProps}>
                    <Typography style={{fontSize: 14}}>{step.label}</Typography>
                  </StepLabel>
                </Step>
              ))
            }
          </Stepper>
          <br/>
          {
            activeStep === 0 &&
            <BasicInfo setActiveStep={setActiveStep} setDisplay={setDisplay} setChannel={setChannel} channel={channel}/>
          }
          {
            activeStep === 1 &&
            <RequestMatching setActiveStep={setActiveStep} setChannel={setChannel} channel={channel}/>
          }
          {
            activeStep === 2 &&
            <Routes setActiveStep={setActiveStep} setDisplay={setDisplay} setChannel={setChannel} channel={channel}/>
          }
        </Card>
      </Box>
    </>
  )
}