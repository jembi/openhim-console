import React from 'react'
import {Box, Paper} from '@mui/material'
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  GridRowParams
} from '@mui/x-data-grid'
import ErrorIcon from '@mui/icons-material/Error'

interface BaseDataGridProps {
  rows: any[]
  getRowId: (row: any) => any
  onRowClick?: (params: GridRowParams) => void
  columns: any[]
  customToolbar?: React.JSXElementConstructor<any>
  noRowsOverlay?: React.JSXElementConstructor<any>
}

const DefaultCustomToolbar = () => {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div>
      <GridToolbarQuickFilter variant="standard" />
    </div>
  )
}

const DefaultNoRowsOverlay = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <ErrorIcon fontSize="large" color="disabled" />
      <Box sx={{m: 1}}>No Rows Found</Box>
    </div>
  )
}

export function BaseDataGrid({
  rows,
  getRowId,
  onRowClick,
  columns,
  customToolbar = DefaultCustomToolbar,
  noRowsOverlay = DefaultNoRowsOverlay
}: BaseDataGridProps) {
  return (
    <>
      <Paper
        elevation={4}
        sx={{paddingX: '15px', borderRadius: '12px', paddingTop: '30px'}}
      >
        <DataGrid
          getRowId={getRowId}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            '&, [class^=MuiDataGrid]': {border: 'none'},
            '--DataGrid-containerBackground': '#f8f8f8'
          }}
          rows={rows}
          onRowClick={onRowClick}
          slots={{
            toolbar: customToolbar,
            noRowsOverlay: noRowsOverlay
          }}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {page: 0, pageSize: 10}
            }
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              printOptions: {disableToolbarButton: true},
              csvOptions: {disableToolbarButton: true}
            }
          }}
        />
      </Paper>
    </>
  )
}
