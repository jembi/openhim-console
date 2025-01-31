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
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import {makeStyles} from '@mui/styles'
import React from 'react'
import {Channel, ChannelMethod, ChannelType} from '../../types'

export function BasicInfo(props: {
  channel: Channel
  onChange: (event: {channel: Channel; isValid: boolean}) => unknown
}) {
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
  const [formTouched, setFormTouched] = React.useState(false)
  const channelTypes: Array<ChannelType> = ['http', 'polling']
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Channel Name"
            variant="outlined"
            fullWidth
            value={channel.name}
            onChange={e => {
              setFormTouched(true)
              setChannel({...channel, name: e.target.value})
            }}
            error={channel.name.trim() === '' && formTouched}
            helperText={
              channel.name.trim() === '' && formTouched
                ? 'Channel Name cannot be empty'
                : 'Choose a short but descriptive name.'
            }
            FormHelperTextProps={{
              style: {
                marginLeft: '0'
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>Allowed Methods</Typography>
          <Grid container sx={{ pl: 2 }}>
            {allowedMethods.map(method => (
              <Grid item xs={6} key={method}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={channel.methods?.includes(method)}
                      onChange={e => handleCheckToggle(method, e.target.checked)}
                      sx={{
                        '&.Mui-checked': {
                          color: '#007F68'
                        }
                      }}
                    />
                  }
                  label={method}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Accordion 
          elevation={0}
          sx={{
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '8px !important',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            '&:before': {
              display: 'none',
            },
            '& .MuiAccordionSummary-root': {
              minHeight: '48px',
              padding: '0 16px',
            },
            '& .MuiAccordionSummary-content': {
              margin: '12px 0',
            },
            '& .MuiAccordionDetails-root': {
              padding: '16px',
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            },
            '&.Mui-expanded': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ArrowDropDown />}
            sx={{
              '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                transform: 'rotate(180deg)',
              },
              '& .MuiAccordionSummary-expandIconWrapper': {
                color: 'rgba(0, 0, 0, 0.54)',
              },
            }}
          >
            <Typography>Optional settings</Typography>
          </AccordionSummary>
          
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Channel Description"
                  variant="outlined"
                  fullWidth
                  value={channel.description}
                  onChange={e =>
                    setChannel({...channel, description: e.target.value})
                  }
                  helperText="Help other users understand this channel"
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '0',
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Channel Type
                </Typography>
                
                <RadioGroup
                  value={channel.type}
                  onChange={e =>
                    setChannel({
                      ...channel,
                      type: e.target.value as ChannelType
                    })
                  }
                  sx={{ pl: 2 }}
                >
                  {channelTypes.map(type => (
                    <FormControlLabel
                      key={type}
                      value={type}
                      control={
                        <Radio 
                          sx={{
                            '&.Mui-checked': {
                              color: '#007F68'
                            },
                            '&:hover': {
                              backgroundColor: 'rgba(0, 127, 104, 0.04)'
                            }
                          }}
                        />
                      }
                      label={type.toUpperCase()}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
                
                <Box sx={{ mt: 2, maxWidth: '400px' }}>
                  {channel.type === 'polling' && (
                    <TextField
                      label="Polling Schedule"
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                      value={channel.pollingSchedule}
                      onChange={e =>
                        setChannel({
                          ...channel,
                          pollingSchedule: e.target.value
                        })
                      }
                      error={
                        channel.type === 'polling' &&
                        channel.pollingSchedule === ''
                      }
                      helperText={
                        channel.type === 'polling' &&
                        channel.pollingSchedule === ''
                          ? `Cron format: '*/10 * * * *'\nor Written format: '10 minutes'`
                          : undefined
                      }
                    />
                  )}
                  <TextField
                    label="Timeout ms"
                    variant="outlined"
                    fullWidth
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
                </Box>

                <Box sx={{ mt: 3 }}>
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
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#007F68',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 127, 104, 0.04)'
                            }
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#007F68'
                          },
                          '& .MuiSwitch-track': {
                            backgroundColor: 'rgba(0, 0, 0, 0.38)'
                          }
                        }}
                      />
                    }
                    label="Enable channel"
                  />
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  )
}
