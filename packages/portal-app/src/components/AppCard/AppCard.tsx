import {Avatar, Card, IconButton, CardActionArea, Link} from '@mui/material'
import CardHeader from '@mui/material/CardHeader'
import LaunchIcon from '@mui/icons-material/Launch'
import AppsIcon from '@mui/icons-material/Apps'
import AppCardActionsMenu from './AppCardActionsMenu'

const AppCard = ({app}) => {
  return (
    <div>
      <Card sx={{maxWidth: '400px'}}>
        <CardActionArea>
          <CardHeader
            href={app.url}
            avatar={
              <Link href={app.url} target="_blank" rel="noopener noreferrer">
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
                <AppCardActionsMenu app={app} />
              </div>
            }
            title={app.name}
            subheader={app.description}
          />
        </CardActionArea>
      </Card>
    </div>
  )
}
export default AppCard
