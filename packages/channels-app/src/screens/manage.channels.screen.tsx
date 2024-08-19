import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import Search from '@mui/icons-material/Search'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
  Typography,
  Grid,
  Input,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  TablePagination
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {getChannels} from '../services/api'
import {useQuery} from '@tanstack/react-query'
import Loader from '../components/helpers/loader.component'
import {useConfirmation} from '../contexts/confirmation.context'

const ManageChannelsScreen: React.FC = () => {
  const {isLoading, isError, data, error} = useQuery({
    queryKey: ['query.ManageChannelsScreen'],
    queryFn: getChannels
  })
  const {showConfirmation, hideConfirmation} = useConfirmation()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page, setPage] = React.useState(0)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const onActionDisableChannel = () => {
    handleClose()
    showConfirmation(
      'Are you sure you want to disable this channel?',
      'Disable Channel',
      () => {
        handleClose()
      },
      handleClose
    )
  }

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <div>{error}</div>
  }

  return (
    <Box padding={3} sx={{backgroundColor: '#F1F1F1'}}>
      <Typography variant="h4" gutterBottom>
        Manage Channels
      </Typography>

      <Grid container>
        <Grid item xs={11}>
          <Typography variant="subtitle1" gutterBottom>
            Setup and control your channels.&nbsp;
            <a href="?">How do channels work?</a>
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => 1}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{marginTop: '10px', marginBottom: '30px'}} />

      <Card elevation={4}>
        <CardContent>
          <Grid container>
            <Grid item xs={2}>
              <Input
                placeholder="Search..."
                fullWidth
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />
            </Grid>
          </Grid>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Channel Name</TableCell>
                  <TableCell>URL Pattern</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Access</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((channel, index) => (
                  <TableRow key={index}>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>{channel.name}</TableCell>
                    <TableCell>{channel.urlPattern}</TableCell>
                    <TableCell>{channel.priority ?? '-'}</TableCell>
                    <TableCell>{channel.allow.join(', ')}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={handleClick}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleClose}>Edit Channel</MenuItem>
                        <MenuItem onClick={handleClose}>View Metrics</MenuItem>
                        <MenuItem divider onClick={handleClose}>
                          View Logs
                        </MenuItem>
                        <MenuItem onClick={onActionDisableChannel}>
                          Disable Channel
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="section"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default ManageChannelsScreen
