import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import React from 'react'
import {Channel, ChannelAuthType} from '../../types'
import {TagInputAutocomplete} from '../../components/helpers/tags.input.autocomplete'

type MatchBodyType = 'NO MATCHING' | 'REGEX' | 'XML' | 'JSON'

export function RequestMatching(props: {
  channel: Channel
  onChange: (event: {channel: Channel; isValid: boolean}) => unknown
}) {
  const [formTouched, setFormTouched] = React.useState(false)
  const [channel, setChannel] = React.useState(props.channel)
  const [isMatchSpecificRequestContent, setIsMatchSpecificRequestContent] =
    React.useState(false)
  const [matchBodyType, setMatchBodyType] =
    React.useState<MatchBodyType>('NO MATCHING')

  React.useEffect(() => {
    props.onChange({
      channel: channel,
      isValid: !!channel.urlPattern.trim()
    })
  }, [channel])

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="URL Patterns"
            variant="outlined"
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: channel.addAutoRewriteRules ? (
                <span style={{marginRight: '5px'}}>^</span>
              ) : undefined,
              endAdornment: channel.addAutoRewriteRules ? (
                <span style={{marginLeft: '5px'}}>$</span>
              ) : undefined
            }}
            value={
              channel.addAutoRewriteRules
                ? channel.urlPattern
                    .trim()
                    .replace(/^\^/, '')
                    .replace(/\$$/, '')
                : channel.urlPattern
            }
            onChange={e => {
              setFormTouched(true)
              if (channel.addAutoRewriteRules) {
                if (!e.target.value.startsWith('^')) {
                  e.target.value = '^' + e.target.value
                }
                if (!e.target.value.endsWith('$')) {
                  e.target.value = e.target.value + '$'
                }
              } else {
                e.target.value = e.target.value
                  .trim()
                  .replace(/^\^/, '')
                  .replace(/\$$/, '')
              }

              setChannel({...channel, urlPattern: e.target.value})
            }}
            error={channel.urlPattern.trim() === '' && formTouched}
            helperText={
              formTouched && channel.urlPattern.trim() === ''
                ? 'URL patterns cannot be empty'
                : undefined
            }
            FormHelperTextProps={{
              sx: {
                marginLeft: '0',
                color: 'rgba(0, 0, 0, 0.6)',
              }
            }}
          />
          <FormHelperText>
            Which URL patterns will match this channel?
          </FormHelperText>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={channel.addAutoRewriteRules}
                onChange={e => {
                  let urlPattern = channel.urlPattern

                  if (e.target.checked) {
                    if (!channel.urlPattern.startsWith('^')) {
                      urlPattern = `^${urlPattern}`
                    }
                    if (!channel.urlPattern.endsWith('$')) {
                      urlPattern = `${urlPattern}$`
                    }
                  } else {
                    urlPattern = urlPattern
                      .trim()
                      .replace(/^\^/, '')
                      .replace(/\$$/, '')
                  }

                  setChannel({
                    ...channel,
                    urlPattern,
                    addAutoRewriteRules: e.target.checked
                  })
                }}
                sx={{
                  '&.Mui-checked': {
                    color: '#007F68'
                  }
                }}
              />
            }
            label="Auto-add regex delimiters (Recommended)"
          />
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
                  label="Channel priority"
                  variant="outlined"
                  fullWidth
                  type="number"
                  margin="normal"
                  value={channel.priority}
                  onChange={e =>
                    setChannel({...channel, priority: Number(e.target.value)})
                  }
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '0',
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }}
                />
                <FormHelperText>
                  Transactions matched to multiple channels go to the highest
                  channel. Priority 1 is highest; higher numbers are lower
                  priority.
                </FormHelperText>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Is this channel public or private?
                </Typography>

                <RadioGroup
                  defaultValue="public"
                  value={channel.authType}
                  onChange={e =>
                    setChannel({
                      ...channel,
                      authType: e.target.value as ChannelAuthType
                    })
                  }
                  sx={{ pl: 2 }}
                >
                  <FormControlLabel
                    value="public"
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
                    label="Public"
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    value="private"
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
                    label="Private"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" sx={{ pl: 2, color: 'rgba(0, 0, 0, 0.6)' }}>
                    Private requires authentication.
                  </Typography>
                </RadioGroup>

                <Grid item xs={12} sx={{ mt: 3 }}>
                  <TagInputAutocomplete
                    tags={channel.whitelist}
                    onChange={whitelist => setChannel({...channel, whitelist})}
                    helperText="Should any IP addresses be automatically trusted?"
                    label="Whitelist IP Address"
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isMatchSpecificRequestContent}
                        onChange={e =>
                          setIsMatchSpecificRequestContent(
                            !isMatchSpecificRequestContent
                          )
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
                    label="Match specific request content"
                  />
                </Grid>

                {isMatchSpecificRequestContent && (
                  <React.Fragment>
                    <Grid item xs={12} sx={{ mt: 3 }}>
                      <TagInputAutocomplete
                        tags={channel.matchContentTypes}
                        onChange={matchContentTypes =>
                          setChannel({...channel, matchContentTypes})
                        }
                        label="Which Content-Types should be matched?"
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 3 }}>
                      <FormLabel sx={{ mb: 2, display: 'block' }}>Match on BODY Content?</FormLabel>
                      <ButtonGroup size="small" variant="outlined">
                        <Button
                          onClick={() => setMatchBodyType('NO MATCHING')}
                          variant={matchBodyType == 'NO MATCHING' ? 'contained' : 'outlined'}
                          sx={{
                            '&.MuiButton-contained': {
                              backgroundColor: '#007F68',
                              color: '#fff',
                              '&:hover': {
                                backgroundColor: '#006854'
                              }
                            },
                            '&.MuiButton-outlined': {
                              borderColor: '#007F68',
                              color: '#007F68',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 127, 104, 0.04)'
                              }
                            }
                          }}
                        >
                          NO MATCHING
                        </Button>
                        <Button
                          onClick={() => setMatchBodyType('REGEX')}
                          variant={matchBodyType == 'REGEX' ? 'contained' : 'outlined'}
                          sx={{
                            '&.MuiButton-contained': {
                              backgroundColor: '#007F68',
                              color: '#fff',
                              '&:hover': {
                                backgroundColor: '#006854'
                              }
                            },
                            '&.MuiButton-outlined': {
                              borderColor: '#007F68',
                              color: '#007F68',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 127, 104, 0.04)'
                              }
                            }
                          }}
                        >
                          REGEX
                        </Button>
                        <Button
                          onClick={() => setMatchBodyType('XML')}
                          variant={matchBodyType == 'XML' ? 'contained' : 'outlined'}
                          sx={{
                            '&.MuiButton-contained': {
                              backgroundColor: '#007F68',
                              color: '#fff',
                              '&:hover': {
                                backgroundColor: '#006854'
                              }
                            },
                            '&.MuiButton-outlined': {
                              borderColor: '#007F68',
                              color: '#007F68',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 127, 104, 0.04)'
                              }
                            }
                          }}
                        >
                          XML
                        </Button>
                        <Button
                          onClick={() => setMatchBodyType('JSON')}
                          variant={matchBodyType == 'JSON' ? 'contained' : 'outlined'}
                          sx={{
                            '&.MuiButton-contained': {
                              backgroundColor: '#007F68',
                              color: '#fff',
                              '&:hover': {
                                backgroundColor: '#006854'
                              }
                            },
                            '&.MuiButton-outlined': {
                              borderColor: '#007F68',
                              color: '#007F68',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 127, 104, 0.04)'
                              }
                            }
                          }}
                        >
                          JSON
                        </Button>
                      </ButtonGroup>

                      {matchBodyType === 'REGEX' && (
                        <TextField
                          label="Enter Regular Expression for Matching"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={channel.matchContentRegex}
                          onChange={e =>
                            setChannel({
                              ...channel,
                              matchContentRegex: e.target.value
                            })
                          }
                          helperText="E.g. [abc]+"
                          FormHelperTextProps={{
                            sx: {
                              marginLeft: '0',
                              color: 'rgba(0, 0, 0, 0.6)',
                            }
                          }}
                        />
                      )}

                      {matchBodyType === 'XML' && (
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <TextField
                              label="XPath expression"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              value={channel.matchContentXpath}
                              onChange={e =>
                                setChannel({
                                  ...channel,
                                  matchContentXpath: e.target.value
                                })
                              }
                              helperText="E.g. /bookstore/book[1]/title"
                              FormHelperTextProps={{
                                sx: {
                                  marginLeft: '0',
                                  color: 'rgba(0, 0, 0, 0.6)',
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="Desired expression result"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              value={channel.matchContentValue}
                              onChange={e =>
                                setChannel({
                                  ...channel,
                                  matchContentValue: e.target.value
                                })
                              }
                              FormHelperTextProps={{
                                sx: {
                                  marginLeft: '0',
                                  color: 'rgba(0, 0, 0, 0.6)',
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      )}

                      {matchBodyType === 'JSON' && (
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <TextField
                              label="JSON Path"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              value={channel.matchContentJson}
                              onChange={e =>
                                setChannel({
                                  ...channel,
                                  matchContentJson: e.target.value
                                })
                              }
                              helperText="E.g. store.book[0].title"
                              FormHelperTextProps={{
                                sx: {
                                  marginLeft: '0',
                                  color: 'rgba(0, 0, 0, 0.6)',
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              label="Desired expression result"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              value={channel.matchContentValue}
                              onChange={e =>
                                setChannel({
                                  ...channel,
                                  matchContentValue: e.target.value
                                })
                              }
                              FormHelperTextProps={{
                                sx: {
                                  marginLeft: '0',
                                  color: 'rgba(0, 0, 0, 0.6)',
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  )
}
