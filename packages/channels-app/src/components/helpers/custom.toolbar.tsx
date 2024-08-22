import {makeStyles} from '@mui/styles'
import {
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter
} from '@mui/x-data-grid'

const useStyles = makeStyles(_theme => ({
  main: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 10px'
  }
}))

export function CustomToolbar() {
  const classes = useStyles()

  return (
    <div className={classes.main}>
      <div>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div>
      <GridToolbarQuickFilter />
    </div>
  )
}
