import { Card, Button, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'

interface EditUserRoleProps {
  returnToRolesList: () => void
}

export const EditUserRole: React.FC<EditUserRoleProps> = ({
  returnToRolesList
}) => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }

  return (
    <>
      <h1>Edit User Role</h1>
      <Card variant="outlined" sx={{margin: 'auto', maxWidth: 670}}>
        <Tabs value={tabValue} onChange={handleTabChange} variant='fullWidth'>
          <Tab label="Channels & Clients" />
          <Tab label="Transactions, Users & Mediators"/>
          <Tab label="Additional Perms."/>
        </Tabs>
        <Button variant="outlined" color="primary" onClick={returnToRolesList}>
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Save
        </Button>
      </Card>
    </>
  )
}
