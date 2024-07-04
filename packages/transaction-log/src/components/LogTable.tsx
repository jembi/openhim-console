import React from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Container
} from '@mui/material'
import {Lock} from '@mui/icons-material'

const logs = [
  {
    type: '',
    method: 'POST',
    host: 'openhimcore.ndr-test.jembi.cloud',
    port: 5000,
    path: '/regiony/fhir/',
    params: '',
    channel: 'FHIR Server - Dire Dawa (Region Y)',
    client: 'Region Y',
    time: '2023-12-05 17:03:28 +0200'
  }
  // Add more logs here
]

const LogTable: React.FC = () => {
  return (
    <Box sx={{padding: '16px'}}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>Port</TableCell>
              <TableCell>Path</TableCell>
              <TableCell>Params</TableCell>
              <TableCell>Channel</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="32" height="32" rx="4" fill="#FECDD2" />
                    <path
                      d="M22 12H21V10C21 7.24 18.76 5 16 5C13.24 5 11 7.24 11 10V12H10C8.9 12 8 12.9 8 14V24C8 25.1 8.9 26 10 26H22C23.1 26 24 25.1 24 24V14C24 12.9 23.1 12 22 12ZM16 21C14.9 21 14 20.1 14 19C14 17.9 14.9 17 16 17C17.1 17 18 17.9 18 19C18 20.1 17.1 21 16 21ZM19.1 12H12.9V10C12.9 8.29 14.29 6.9 16 6.9C17.71 6.9 19.1 8.29 19.1 10V12Z"
                      fill="#C62828"
                    />
                  </svg>
                </TableCell>
                <TableCell>{log.method}</TableCell>
                <TableCell>{log.host}</TableCell>
                <TableCell>{log.port}</TableCell>
                <TableCell>{log.path}</TableCell>
                <TableCell>{log.params}</TableCell>
                <TableCell>{log.channel}</TableCell>
                <TableCell>{log.client}</TableCell>
                <TableCell>{log.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="body2" sx={{marginTop: '16px'}}>
        Load 20 more results
      </Typography>
    </Box>
  )
}

export default LogTable
