import React from 'react'
import {Container, Tab, Tabs, Box, Typography, Card, Stack} from '@mui/material'
import LogTable from './LogTable'
import CustomFilters from './CustomFilters'
import BasicFilters from './BasicFilters'

const App: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Container sx={{backgroundColor: '#F1F1F1'}}>
      <Box sx={{}}>
        <Typography
          sx={{
            fontFamily: 'Roboto',
            fontSize: 34,
            fontWeight: 400,
            letterSpacing: 0.25,
            textAlign: 'left'
          }}
        >
          Transactions Log
        </Typography>
        <Stack>
          A log of the recent transactions through the system. Use Basic or
          Advanced filters to find specific transactions to investigate or
          rerun. Use settings to modify the list behaviour.
        </Stack>
      </Box>
      <Card>
        <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: 2}}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs"
            TabIndicatorProps={{style: {backgroundColor: '#54C4A4'}}}
          >
            <Tab
              label="Basic Filters"
              sx={{color: tabValue === 0 ? '#54C4A4' : '#54C4A4'}}
            />
            <Tab
              label="Custom Filters"
              sx={{color: tabValue === 1 ? '#54C4A4' : 'inherit'}}
            />
          </Tabs>
        </Box>

        {tabValue === 0 && <BasicFilters />}
        {tabValue === 1 && <CustomFilters />}
        <LogTable />
      </Card>
    </Container>
  )
}

export default App
