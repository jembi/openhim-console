import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import ArrowDropUp from '@mui/icons-material/ArrowDropUp'
import {makeStyles} from '@mui/styles'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Channel, ChannelAuthType, ChannelMethod, ChannelType} from '../../types'
import {TagInputAutocomplete} from '../../components/helpers/tags.input.autocomplete'

type MatchBodyType = 'NO MATCHING' | 'REGEX' | 'XML' | 'JSON'

export function RequestMatching(props: {
  channel: Channel
  onChange: (event: {channel: Channel; isValid: boolean}) => unknown
}) {

  const navigate = useNavigate()
  const [channel, setChannel] = React.useState(props.channel)
  const [expandOptionalSettings, setExpandOptionalSettings] =
    React.useState(false)
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
      <Typography variant="h5">Request Matching</Typography>
      <Typography variant="subtitle1">
        Set criteria for requests to be forwarded to this channel.
      </Typography>

      <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="URL Patterns"
            variant="outlined"
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <span style={{ marginRight: '5px' }}>^</span>
              ),
              endAdornment: (
                <span style={{ marginLeft: '5px' }}>$</span>
              )
            }}
            value={channel.urlPattern}
            onChange={e => setChannel({ ...channel, urlPattern: e.target.value })}
            error={channel.urlPattern.trim() === ''}
            helperText={
              channel.urlPattern.trim() === ''
                ? 'URL patterns cannot be empty'
                : undefined
            }
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={channel.addAutoRewriteRules}
                onChange={e =>
                  setChannel({
                    ...channel,
                    addAutoRewriteRules: e.target.checked
                  })
                }
              />
            }
            label="Auto-add regex delimiters (Recommended)"
          />
        </Grid>

        <Grid item xs={12}>
          <TagInputAutocomplete
            tags={channel.txViewAcl}
            onChange={txViewAcl => setChannel({ ...channel, txViewAcl })}
            label="Which user groups are allowed to view this channel's transactions?"
          />
        </Grid>

        <Grid item xs={12}>
          <TagInputAutocomplete
            tags={channel.txViewAcl}
            onChange={txViewFullAcl => setChannel({ ...channel, txViewFullAcl })}
            label="Which user groups are allowed to view this channel's transactions full request/response body?"
          />
        </Grid>

        <Grid item xs={12}>
          <TagInputAutocomplete
            tags={channel.txViewAcl}
            onChange={txRerunAcl => setChannel({ ...channel, txRerunAcl })}
            label="Which user groups are allowed to rerun this channel's transactions?"
          />
        </Grid>
      </Grid>

      <br />
      <Divider style={{ marginTop: '10px', marginBottom: '30px' }} />
      <br />

      <Paper elevation={2} style={{ borderRadius: '20px', padding: '12px' }}>
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
              <Grid item xs={12}>
                <TextField
                  label="Channel priority"
                  variant="outlined"
                  fullWidth
                  type="number"
                  margin="normal"
                  value={channel.priority}
                  onChange={e =>
                    setChannel({ ...channel, priority: Number(e.target.value) })
                  }
                />
              </Grid>
              <Grid item xs={12} style={{ marginBottom: '20px' }}>
                <Typography variant="h6">
                  Is this channel public or private?
                </Typography>

                <Box style={{ padding: '10px' }}>
                  <RadioGroup
                    defaultValue="public"
                    value={channel.authType}
                    onChange={e =>
                      setChannel({
                        ...channel,
                        authType: e.target.value as ChannelAuthType
                      })
                    }
                  >
                    <FormControlLabel
                      value="public"
                      control={<Radio />}
                      label="Public"
                    />
                    <FormControlLabel
                      value="private"
                      control={<Radio />}
                      label="Private"
                    />
                    <Typography variant="caption">
                      Private requires authentication.
                    </Typography>
                  </RadioGroup>
                </Box>

                <Grid item xs={12} style={{ marginBottom: '20px' }}>
                  <TagInputAutocomplete
                    tags={channel.whitelist}
                    onChange={whitelist => setChannel({ ...channel, whitelist })}
                    helperText="Should any IP addresses be automatically trusted?"
                    label="Whitelist IP Address"
                  />
                </Grid>

                <Grid item xs={12} style={{ marginBottom: '20px' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isMatchSpecificRequestContent}
                        onChange={e =>
                          setIsMatchSpecificRequestContent(
                            !isMatchSpecificRequestContent
                          )
                        }
                      />
                    }
                    label="Match specific request content"
                  />
                </Grid>

                {isMatchSpecificRequestContent && (
                  <React.Fragment>
                    <br />
                    <Grid item xs={12} style={{ marginBottom: '20px' }}>
                      <TagInputAutocomplete
                        tags={channel.matchContentTypes}
                        onChange={matchContentTypes =>
                          setChannel({ ...channel, matchContentTypes })
                        }
                        label="Which Content-Types should be matched?"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormLabel>Match on BODY Content?</FormLabel>
                      <br />
                      <ButtonGroup size="small" variant="outlined">
                        <Button
                          onClick={() => setMatchBodyType('NO MATCHING')}
                          variant={
                            matchBodyType == 'NO MATCHING'
                              ? 'contained'
                              : 'outlined'
                          }
                        >
                          NO MATCHING
                        </Button>
                        <Button
                          onClick={() => setMatchBodyType('REGEX')}
                          variant={
                            matchBodyType == 'REGEX' ? 'contained' : 'outlined'
                          }
                        >
                          REGEX
                        </Button>
                        <Button
                          onClick={() => setMatchBodyType('XML')}
                          variant={
                            matchBodyType == 'XML' ? 'contained' : 'outlined'
                          }
                        >
                          XML
                        </Button>
                        <Button
                          onClick={() => setMatchBodyType('JSON')}
                          variant={
                            matchBodyType == 'JSON' ? 'contained' : 'outlined'
                          }
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
                            />
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </Paper>
    </Box>
  )
}
