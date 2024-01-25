import {Avatar, Card, IconButton, Link, Typography} from '@mui/material'
import CardHeader from '@mui/material/CardHeader'
import LaunchIcon from '@mui/icons-material/Launch'
import AppsIcon from '@mui/icons-material/Apps'

const AppCard = ({app}) => {
  return (
    <div>
      <Card sx={{width: '320px'}} elevation={3}>
        <CardHeader
          href={app.url}
          avatar={
            <Link href={app.url}>
              <Avatar variant="rounded" aria-label="application icon">
                {app.icon ? (
                  <img src={app.icon} alt="application icon" width={24} />
                ) : (
                  <AppsIcon fontSize="large" />
                )}
              </Avatar>
            </Link>
          }
          action={
            <div>
              {app.type == 'link' && (
                <IconButton
                  aria-label="launch"
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="large"
                  color="primary"
                >
                  <LaunchIcon />
                </IconButton>
              )}
            </div>
          }
          title={
            <Link color="inherit" underline="hover" href={app.url}>
              <Typography variant="body1"> {app.name}</Typography>
            </Link>
          }
          subheader={
            <Link color="inherit" underline="hover" href={app.url}>
              <Typography variant="body2">{app.description}</Typography>
            </Link>
          }
        />
      </Card>
    </div>
  )
}
export default AppCard
