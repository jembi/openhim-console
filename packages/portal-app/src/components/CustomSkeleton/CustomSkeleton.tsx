import Skeleton from '@mui/material/Skeleton'
import {Grid, Card, CardHeader} from '@mui/material'

function CustomSkeleton() {
  return (
    <Grid container spacing={2} sx={{ml: 5, mt: 5}}>
      <Grid item xs={12}>
        <Skeleton
          animation="wave"
          height={10}
          width="20%"
          style={{marginBottom: 6}}
        />
      </Grid>
      {['AppCard-Skeleton-1', 'AppCard-Skeleton-2'].map(value => (
        <Grid item xs={8} sm={4} md={4} sx={{mb: 3}} key={value}>
          <Card sx={{maxWidth: 345, m: 1}}>
            <CardHeader
              avatar={
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  width={40}
                  height={40}
                />
              }
              title={
                <Skeleton
                  animation="wave"
                  height={10}
                  width="80%"
                  style={{marginBottom: 6}}
                />
              }
              subheader={<Skeleton animation="wave" height={10} width="40%" />}
            ></CardHeader>
          </Card>
          <Skeleton width={345} />
          <Skeleton width={345} />
        </Grid>
      ))}
    </Grid>
  )
}

export default CustomSkeleton
