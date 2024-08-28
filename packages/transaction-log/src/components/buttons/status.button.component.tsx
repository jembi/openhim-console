import {Button} from '@mui/material'

const StatusButton: React.FC = () => {
  const buttonColor =
    status === 'Processing'
      ? 'info'
      : status === 'Pending Async'
      ? 'info'
      : status === 'Successful'
      ? 'success'
      : status === 'Completed'
      ? 'warning'
      : status === 'Completed with error(s)'
      ? 'warning'
      : 'error'

  return (
    <Button variant="contained" color={buttonColor}>
      {/* {buttonText} */}
    </Button>
  )
}

export default StatusButton
