import {makeStyles} from '@mui/styles'
import {
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter
} from '@mui/x-data-grid'

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
      <GridToolbarQuickFilter />
    </div>
  )
}
