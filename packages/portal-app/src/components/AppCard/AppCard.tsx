import {Avatar, Card, IconButton, CardActionArea, Link} from '@mui/material'
import CardHeader from '@mui/material/CardHeader'
import LaunchIcon from '@mui/icons-material/Launch'
import AppsIcon from '@mui/icons-material/Apps'
import AppCardActionsMenu from './AppCardActionsMenu'

const AppCard = ({app, onSuccess}) => {
  return (
    <div>
      <Card sx={{maxWidth: '400px'}}>
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
                  edge="end"
                >
                  <LaunchIcon />
                </IconButton>
              )}
              <AppCardActionsMenu app={app} onSuccess={onSuccess} />
            </div>
          }
          title={
            <Link color="inherit" underline="hover" href={app.url}>
              {app.name}
            </Link>
          }
          subheader={
            <Link color="inherit" underline="hover" href={app.url}>
              {app.description}
            </Link>
          }
        />
      </Card>
    </div>
  )
}
export default AppCard
