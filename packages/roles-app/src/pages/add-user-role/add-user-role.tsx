import {Button, Card, Step, StepLabel, Stepper} from '@mui/material'
import React, {useState} from 'react'

interface AddUserRoleProps {
  returnToRolesList: () => void
}

export const AddUserRole: React.FC<AddUserRoleProps> = ({
  returnToRolesList
}) => {
  const [activeStep, setActiveStep] = useState(0)
  const labelProps: {optional?: React.ReactNode} = {}
  return (
    <>
      <h1>Add User Role</h1>
      <Card variant="outlined" sx={{margin: 'auto', maxWidth: 610}}>
        <Stepper sx={{paddingTop: 2}} activeStep={activeStep}>
          <Step key={'channels-&-clients'}>
            <StepLabel sx={{fontSize: 20}} {...labelProps}>
              <p>Channels & Clients</p>
            </StepLabel>
          </Step>
          <Step key={'transactions-users-&-clients'}>
          <StepLabel sx={{fontSize: 20}} {...labelProps}>
              <p>Transactions, Users & Mediators</p>
            </StepLabel>
          </Step>
          <Step key={'additional-perms'}>
          <StepLabel sx={{fontSize: 20}} {...labelProps}>
              <p>Additional Perms.</p>
            </StepLabel>
          </Step>
        </Stepper>



        <Button variant="outlined" color="primary" onClick={returnToRolesList}>
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Next
        </Button>
      </Card>
    </>
  )
}
