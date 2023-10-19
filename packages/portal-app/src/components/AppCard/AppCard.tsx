import {Avatar, Card, IconButton, CardActionArea, Button} from '@mui/material'
import CardHeader from '@mui/material/CardHeader'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import LaunchIcon from '@mui/icons-material/Launch'
import AppsIcon from '@mui/icons-material/Apps'

const AppCard = ({
  applicationIcon,
  applicationName,
  applicationDescription,
  applicationType,
  applicationUrl
}) => {
  return (
    <div>
      <Card sx={{maxWidth: '400px'}}>
        <CardActionArea href={applicationUrl}>
          <CardHeader
            avatar={
              <Avatar variant="rounded" aria-label="application icon">
                {applicationIcon ? (
                  <img
                    src={applicationIcon}
                    alt="application icon"
                    width={24}
                  />
                ) : (
                  <AppsIcon fontSize="large" />
                )}
              </Avatar>
            }
            action={
              <div>
                {applicationType == 'link' && (
                  <IconButton aria-label="launch">
                    <Button
                      href={applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LaunchIcon />
                    </Button>
                  </IconButton>
                  /*
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>*/
                )}
              </div>
            }
            title={applicationName}
            subheader={applicationDescription}
          />
        </CardActionArea>
      </Card>
    </div>
  )
}
export default AppCard
