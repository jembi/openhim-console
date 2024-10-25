import {
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter
} from '@mui/x-data-grid'
import React from 'react'

export function CustomToolbar() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px 10px'
      }}
    >
      <div>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div>
      <GridToolbarQuickFilter variant="outlined" />
    </div>
  )
}
