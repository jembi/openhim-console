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
  Typography
} from '@mui/material'

const logs = [
  {
    type: 'POST',
    method: 'openhimcore.ndr-test.jembi.cloud',
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
                <TableCell>{log.type}</TableCell>
                <TableCell>{log.method}</TableCell>
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
