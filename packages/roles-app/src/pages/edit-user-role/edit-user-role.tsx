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
        
      </Card>
    </>
  )
}
