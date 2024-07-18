import {Box, Typography} from '@mui/material'
import {makeStyles} from '@mui/styles'

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: '#F1F1F1',
    padding: 10,
    textAlign: 'center'
  }
}))

export function Footer() {
  const classes = useStyles()

  return (
    <Box className={classes.footer}>
      <Typography color={'grey'} fontSize={14} fontWeight={400} variant="body2">
        OpenHIM {'v7.0.2'}
        <br />
        Community-driven, powered by Jembi
      </Typography>
    </Box>
  )
}
