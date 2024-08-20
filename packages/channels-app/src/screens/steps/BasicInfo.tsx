import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import ArrowDropUp from '@mui/icons-material/ArrowDropUp'
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import {makeStyles} from '@mui/styles'
import React from 'react'
import {Channel, ChannelMethod, ChannelType} from '../../types'

const useStyles = makeStyles(_theme => ({
  divider: {
    marginTop: '10px',
    margin: '0px',
    width: '100%',
    marginBottom: '10px',
    overflow: 'visible'
  },
  divider2: {
    marginTop: '10px',
    margin: '0px',
    width: '100%',
    marginBottom: '30px',
    overflow: 'visible'
  },
  allowedMethodsContainer: {
    padding: '10px'
  },
  optionalSettingsContainer: {
    borderRadius: '15px',
    padding: '12px'
  },
  channelTypeRadioGroup: {
    padding: '10px'
  }
}))

export function BasicInfo(props: {
  channel: Channel
  onChange: (event: {channel: Channel; isValid: boolean}) => unknown
}) {
  const classes = useStyles()
  const [channel, setChannel] = React.useState(props.channel)
  const allowedMethods: Array<ChannelMethod> = [
    'GET',
    'HEAD',
    'POST',
    'TRACE',
    'DELETE',
    'CONNECT',
    'PUT',
    'PATCH',
    'OPTIONS'
  ]
  const channelTypes: Array<ChannelType> = ['http', 'tcp', 'tls', 'polling']
  const [expandOptionalSettings, setExpandOptionalSettings] =
    React.useState(false)

  React.useEffect(() => {
    props.onChange({
      channel: channel,
      isValid: !!channel.name.trim()
    })
  }, [channel])

  const handleCheckToggle = (method: ChannelMethod, checked: boolean) => {
    let methods = []

    if (!channel.methods) channel.methods = []

    if (checked) {
      methods = [...channel.methods, method]
    } else {
      methods = channel.methods.filter(m => m !== method)
    }

    setChannel({...channel, methods: Array.from(new Set(methods))})
  }

  return (
    <Box>
      <Typography variant="h5">Basic Info</Typography>
      <Typography variant="subtitle1">
        Describe some basic information about the channel and choose its overall
        type.
      </Typography>

      <Divider className={classes.divider} />
      <br />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Channel Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={channel.name}
            onChange={e => setChannel({...channel, name: e.target.value})}
            error={channel.name.trim() === ''}
            helperText={
              channel.name.trim() === ''
                ? 'Channel Name cannot be empty'
                : undefined
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Box className={classes.allowedMethodsContainer}>
            <Typography variant="h6">Allowed Methods</Typography>
            <Grid container>
              {allowedMethods.map(method => (
                <Grid item xs={6} key={method}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={channel.methods?.includes(method)}
                        onChange={e =>
                          handleCheckToggle(method, e.target.checked)
                        }
                      />
                    }
                    label={method}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Divider className={classes.divider2} />

      <Paper elevation={1} className={classes.optionalSettingsContainer}>
        <Grid container>
          <Grid item xs={11}>
            <Typography variant="body1">Optional Settings</Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              onClick={() => setExpandOptionalSettings(!expandOptionalSettings)}
            >
              {expandOptionalSettings ? <ArrowDropUp /> : <ArrowDropDown />}
            </IconButton>
          </Grid>
        </Grid>

        {expandOptionalSettings && (
          <React.Fragment>
            <Divider />
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  label="Channel Description"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={channel.description}
                  onChange={e =>
                    setChannel({...channel, description: e.target.value})
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Channel Type</Typography>

                <Box className={classes.channelTypeRadioGroup}>
                  <RadioGroup
                    defaultValue="http"
                    value={channel.type}
                    onChange={e =>
                      setChannel({
                        ...channel,
                        type: e.target.value as ChannelType
                      })
                    }
                  >
                    {channelTypes.map(type => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio />}
                        label={type.toUpperCase()}
                      />
                    ))}
                  </RadioGroup>
                </Box>

                <Grid item xs={5}>
                  <TextField
                    label="Timeout ms"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={channel.timeout}
                    onChange={e =>
                      setChannel({...channel, timeout: Number(e.target.value)})
                    }
                    error={
                      Number.isSafeInteger(channel.timeout) &&
                      channel.timeout < 0
                    }
                    helperText={
                      Number.isSafeInteger(channel.timeout) &&
                      channel.timeout < 0
                        ? 'Timeout cannot be negative'
                        : undefined
                    }
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={channel.status === 'enabled'}
                        onChange={e =>
                          setChannel({
                            ...channel,
                            status: e.target.checked ? 'enabled' : 'disabled'
                          })
                        }
                      />
                    }
                    label="Enable channel"
                  />
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </Paper>
    </Box>
  )
}
