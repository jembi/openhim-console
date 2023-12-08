import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

type alert = {
  severity: String
  message: String
}

const AlertSection = (alert: alert) => {
  return (
    <Box>{alert ? <Alert severity="error">{alert.message} </Alert> : null}</Box>
  )
}

export default AlertSection
