import {Avatar, Card, IconButton, Link, Typography} from '@mui/material'
import CardHeader from '@mui/material/CardHeader'
import LaunchIcon from '@mui/icons-material/Launch'
import AppsIcon from '@mui/icons-material/Apps'
import ExtensionIcon from '@mui/icons-material/Extension'
import {useEffect, useState} from 'react'

function generateRoutingPathFromURL(url: string): string {
  const urlObj = new URL(url)
  const path = urlObj.pathname
  const appName = path.split('/').pop()?.replace('.js', '') || ''
  return appName
}
const AppCard = ({app}) => {
  const [appPath, setAppPath] = useState(app.url)
  useEffect(() => {
    if (app.type == 'esmodule') {
      setAppPath(
        'http://localhost:9000/#!/' + generateRoutingPathFromURL(app.url)
      )
    }
  }, [])
  return (
    <div>
      <Card sx={{width: '320px'}} elevation={3}>
        <CardHeader
          href={appPath}
          avatar={
            <Link href={appPath}>
              <Avatar variant="rounded" aria-label="application icon">
                {app.icon ? (
                  <img src={app.icon} alt={app.name[0]} width={24} />
                ) : (
                  <AppsIcon fontSize="large" />
                )}
              </Avatar>
            </Link>
          }
          action={
            <div>
              {app.type == 'external' && (
                <IconButton
                  aria-label="link"
                  href={appPath}
                  size="large"
                  color="primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LaunchIcon />
                </IconButton>
              )}
              {app.type == 'esmodule' && (
                <IconButton
                  aria-label="embedded"
                  href={appPath}
                  size="large"
                  color="primary"
                >
                  <ExtensionIcon />
                </IconButton>
              )}
            </div>
          }
          title={
            <Link color="inherit" underline="hover" href={appPath}>
              <Typography variant="body1"> {app.name}</Typography>
            </Link>
          }
          subheader={
            <Link color="inherit" underline="hover" href={appPath}>
              <Typography variant="body2">{app.description}</Typography>
            </Link>
          }
        />
      </Card>
    </div>
  )
}
export default AppCard
