import React, {useEffect, useState} from 'react'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Link,
  Stack,
  Typography
} from '@mui/material'
import {DataGrid, GridToolbar} from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import {fetchChannels, deleteChannel} from '@jembi/openhim-core-api'

export const Channels = ({setDisplay}) => {
  const [channels, setChannels] = useState([])

  useEffect(() => {
    fetchChannels().then(channels => {
      setChannels(channels)
    })
  }, [])

  const columns = [
    {field: 'name', headerName: 'Channel Name', flex: 0.3},
    {field: 'urlPattern', headerName: 'Url Pattern', flex: 0.2},
    {field: 'priority', headerName: 'Priority', flex: 0.1},
    {field: 'allow', headerName: 'Access', flex: 0.2},
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      renderCell: params => (
        <>
          <CreateIcon style={{cursor: 'pointer'}} onClick={() => {}} />
          <DeleteIcon
            style={{cursor: 'pointer'}}
            onClick={() => {
              setChannelId(params.row['_id'])
            }}
          />
        </>
      )
    }
  ]
  const [ChannelId, setChannelId] = useState(null)
  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.currentTarget.id === 'confirm') {
      deleteChannel(ChannelId)
        .then(() => {})
        .catch((error: any) => {
          console.error(error)
        })
      const newChannels = channels.filter(chan => chan['_id'] !== ChannelId)
      setChannels(newChannels)
    }
    setChannelId(null)
  }

  return (
    <>
      <Box
        sx={{
          display: {xs: 'block'},
          '& .MuiDrawer-paper': {boxSizing: 'border-box', width: '150px'}
        }}
        padding={15}
        display={'flex'}
      >
        <Typography variant="h4">Channels List</Typography>
        <br />
        <Stack
          direction="row"
          alignContent={'center'}
          spacing={'74%'}
          sx={{marginBottom: 1}}
        >
          <Typography variant="body1">
            Set up and control your channels.<Link>How do channels work?</Link>
          </Typography>
          <Button
            style={{backgroundColor: '#29AC96'}}
            variant="contained"
            onClick={() => {
              setDisplay('add')
            }}
          >
            <AddIcon /> Add
          </Button>
        </Stack>
        <Divider />
        <br />
        <Card>
          <DataGrid
            getRowId={row => row._id}
            columns={columns}
            slots={{toolbar: GridToolbar}}
            rows={channels}
            initialState={{
              pagination: {
                paginationModel: {page: 0, pageSize: 10}
              }
            }}
            pageSizeOptions={[10, 25, 50]}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: {disableToolbarButton: true},
                csvOptions: {disableToolbarButton: true}
              }
            }}
          />
        </Card>

        <Dialog
          open={!!ChannelId}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Are you sure you want to delete this channel?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Warning: This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="confirm" onClick={handleClose}>
              Confirm
            </Button>
            <Button id="cancel" onClick={handleClose} autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}
