import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, Divider, FormControlLabel, FormGroup, Step, StepLabel, Stepper, Switch, TextField, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const steps: {key: string, label: string}[] = [
  {key: 'basic-info', label: 'Basic Info'},
  {key: 'request-matching', label: 'Request Matching'},
  {key: 'routes', label: 'Routes'}
]

const allowedMethods: string[][] = [
  ['GET', 'HEAD'], ['POST', 'TRACE'], ['DELETE', 'CONNECT'], ['PUT', 'PATCH'], ['OPTIONS']
]

const channelTypes: string[] = ['HTTP', 'TCP', 'TLS', 'Polling']

const BasicInfo = ({ setDisplay, setActiveStep }) => {
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
          onChange={() => {}}
        />
        <br/>
        <br/>
        <br/>
        <Typography variant="h5">Allowed Methods</Typography>
        <br/>
        {
          allowedMethods.map(methods =>
            <FormGroup key={methods[0]} style={{flexDirection: 'row', paddingLeft: 20}}>
              {methods[0] && <FormControlLabel style={{width: '10%', paddingRight: '40%'}} control={<input type='checkbox'/>} label={methods[0]}/>}
              {methods[1] && <FormControlLabel control={<input type='checkbox'/>} label={methods[1]}/>}
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
              onChange={() => {}}
            />
            <br/>
            <br/>
            <Typography variant="h5">Channel Type</Typography>
            <br/>
            {
              channelTypes.map(channel =>
                <FormGroup key={channel} style={{ paddingLeft: 20}}>
                  <FormControlLabel control={<input type='radio'/>} label={channel}/>
                </FormGroup>
              )
            }
            <br/>
            <TextField
              id="channelTimeout"
              label="Channel Timeout ms"
              placeholder=""
              variant='outlined'
              onChange={() => {}}
            />
            <br/>
            <br/>
            <FormControlLabel control={<Switch checked />} label='Enable Channel'/>
            <br/>
          </AccordionDetails>
        </Accordion>
        <Divider/>
        <CardActions>
          <Button onClick={() => setDisplay('list')}>Cancel</Button>
          <Button onClick={() => {
            setActiveStep(1)
          }}>Save</Button>
        </CardActions>
      </Card>
    </Box>
  )
}

const RequestMatching = ({ setActiveStep, setDisplay }) => {
  return (
    <Box>
      <Typography paddingLeft={1} variant="h5">Request Matching</Typography>
      <Typography paddingLeft={1}>
        Set criteria for requests to be forwarded to this channel.
      </Typography>
      <br/>
      <Divider />
      <br />
      <Card>
      <CardActions>
          <Button onClick={() => setDisplay('list')}>Cancel</Button>
          <Button onClick={() => {

          }}>Save</Button>
        </CardActions>
      </Card>
    </Box>
  )
}

export const EditAdd = ({ setDisplay }) => {
  const [activeStep, setActiveStep] = useState(0)
  const labelProps: {optional?: React.ReactNode} = {}

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
            activeStep === 0 ?
              <BasicInfo setActiveStep={setActiveStep} setDisplay={setDisplay}/> :
              <RequestMatching setActiveStep={setActiveStep} setDisplay={setDisplay}/>
          }
        </Card>
      </Box>
    </>
  )
}