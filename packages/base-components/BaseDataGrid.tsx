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

interface BaseDataGridProps <T> {
  rows: T[]
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

export function BaseDataGrid<T>({
  rows,
  getRowId,
  onRowClick,
  columns,
  customToolbar = DefaultCustomToolbar,
  noRowsOverlay = DefaultNoRowsOverlay
}: BaseDataGridProps<T>) {
  return (
    <>
      <Paper
        elevation={2}
        sx={{paddingX: '15px', borderRadius: '4px', paddingTop: '30px'}}
      >
        <DataGrid
          getRowId={getRowId}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            '.css-1iyq7zh-MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8f8f8',
              borderRadius: '8px'
            },
            '&, [class^=MuiDataGrid]': {border: 'none'}
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
