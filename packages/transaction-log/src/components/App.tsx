import React from 'react'
import {Container, Tab, Tabs, Box, Typography, Card, Stack} from '@mui/material'
import CustomFilters from './CustomFilters'
import BasicFilters from './BasicFilters'
import TransactionLogTable from './TransactionLogTable'

const App: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Container 
      sx={{
        backgroundColor: '#F1F1F1', 
        maxWidth: '100% !important'
      }}>
      <Box sx={{}}>
        <Typography
          variant='h4'
          sx={{
            fontFamily: 'Roboto',
            fontSize: '34px',
            fontWeight: 400,
            lineHeight: '41.99px',
            letterSpacing: '0.25px',
            textAlign: 'left'
          }}
        >
          Transactions Log
        </Typography>
        <Typography
        variant="subtitle1"
        sx={{
          fontFamily: 'Roboto',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '28px',
          letterSpacing: '0.15px',
          textAlign: 'left',
          marginTop: '8px'
        }}>
          A log of the recent transactions through the system. Use Basic or
          Advanced filters to find specific transactions to investigate or
          rerun. Use settings to modify the list behaviour.
        </Typography>
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
        <TransactionLogTable />
      </Card>
    </Container>
  )
}

export default App
