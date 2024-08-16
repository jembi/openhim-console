import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import MenuIcon from '@mui/icons-material/Menu'
import Person from '@mui/icons-material/Person'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import {makeStyles} from '@mui/styles'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {useConfirmation} from '../contexts/confirmation.context'

const useStyles = makeStyles(_theme => ({
  appBar: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    color: '#000000',
    boxShadow: 'none',
    borderBottom: '1px solid #e0e0e0',
    position: 'relative',
    zIndex: 1
  },
  toolbar: {
    minHeight: 64
  },
  logoContainer: {
    paddingTop: '10px',
    paddingRight: '30px'
  },
  logo: {
    width: '100px',
    height: '30px',
    textDecoration: 'none'
  },
  menuButton: {
    color: 'grey'
  },
  menu: {
    marginTop: 4
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
    marginRight: '20px',
    color: '#00000099',
    '&:hover': {
      color: '#388e3c'
    }
  },
  selectedButton: {
    textTransform: 'none',
    fontWeight: 500,
    marginRight: '20px',
    color: '#388e3c'
  },
  avatar: {
    width: 26,
    height: 26
  },
  moreMenuButton: {
    display: 'flex',
    alignItems: 'center'
  },
  gradientBar: {
    margin: 0,
    padding: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 5,
    background: 'linear-gradient(90deg, #5EF26F 0%, #058568 100%)'
  }
}))

type Page = {
  name: string
  link?: string
  children?: Page[]
  onClick?: () => void
}

const DIVIDER_MENU_ITEM: Readonly<Page> = Object.freeze({
  name: '__',
  children: [],
  link: ''
})

const pages: Page[] = [
  {name: 'DASHBOARD', link: '#!/dashboard'},
  {name: 'TRANSACTIONS', link: '#!/transactions'},
  {name: 'CHANNELS', link: '#!/channels'},
  {
    name: 'CLIENTS',
    children: [
      {name: 'Manage Client', link: '#!/clients'},
      {name: 'Add Client', link: '#!/clients/add'},
      DIVIDER_MENU_ITEM,
      {name: 'Manage Client Roles', link: '#!/client-roles'},
      {name: 'Add User Role', link: '#!/client-roles/add'}
    ]
  },
  {
    name: 'USERS',
    children: [
      {name: 'Manage Users', link: '#!/users'},
      {name: 'Add User', link: '#!/users/create-user'},
      DIVIDER_MENU_ITEM,
      {name: 'Role Based Access Control', link: '#!/rbac'},
      //{name: 'Add RBAC', link: '#!/rbac/create-user'}
    ]
  },
  {
    name: 'MORE',
    children: [{name: 'About', link: '#!/about'}]
  },
  {
    name: 'APPS',
    children: [
      {name: 'MANAGE APPS', link: '#!/portal-admin'},
      {name: 'AUDIT LOG', link: '#!/audits'},
      {name: 'TASKS', link: '#!/tasks'},
      {name: 'VISUALIZER', link: '#!/visualizer'},
      {name: 'CONTACT LISTS', link: '#!/groups'},
      {name: 'MEDIATORS', link: '#!/mediators'},
      {name: 'CERTIFICATES', link: '#!/certificates'},
      {name: 'IMPORT/EXPORT', link: '#!/export-import'},
      {name: 'SERVER LOGS', link: '#!/logs'}
    ]
  }
]

export default function OpenhimAppBar() {
  const {hideConfirmation, showConfirmation} = useConfirmation()
  const classes = useStyles()
  const [isAdmin, setIsAdmin] = useState(false)
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const [anchorElClients, setAnchorElClients] = useState<null | HTMLElement>(
    null
  )
  const [anchorElUsers, setAnchorElUsers] = useState<null | HTMLElement>(null)
  const [anchorElMore, setAnchorElMore] = useState<null | HTMLElement>(null)
  const [anchorElApps, setAnchorElApps] = useState<null | HTMLElement>(null)
  const [currentPage, setCurrentPage] = useState<string>(window.location.href)
  const isLoggedIn =
    !window.location.href.includes('#!/login') &&
    !window.location.href.includes('#!/logout')

  const getCorrectAnchorEl = (
    page: Page
  ): [HTMLElement, React.Dispatch<React.SetStateAction<HTMLElement>>] => {
    if (page.name.toUpperCase() === 'MORE') {
      return [anchorElMore, setAnchorElMore]
    } else if (page.name.toUpperCase() === 'APPS') {
      return [anchorElApps, setAnchorElApps]
    } else if (page.name.toUpperCase() === 'USERS') {
      return [anchorElUsers, setAnchorElUsers]
    } else if (page.name.toUpperCase() === 'CLIENTS') {
      return [anchorElClients, setAnchorElClients]
    }
    throw new Error(`[-] Could not getCorrectAnchorEl() from: ${page.name}`)
  }

  const settings: Page[] = [
    {name: 'Profile', link: '#!/profile'},
    {
      name: 'Logout',
      link: '#!/logout',
      onClick: () =>
        showConfirmation('Are you sure you want to logout?', 'Logout', () => {
          hideConfirmation()
          setIsAdmin(false)
          window.setTimeout(() => (window.location.href = '#!/logout'), 100)
        })
    }
  ]

  const OpenhimLogo = () => (
    <img
      alt="OpenHIM Console"
      className={classes.logo}
      src="data:image/png;base64,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"
    />
  )

  const fetchMe = async () => {
    setIsAdmin(false)

    const resConf = await fetch('/config/default.json')
    if (!resConf.ok) {
      return console.error(
        '[header-app] Failed to fetch OpenHIM console config'
      )
    }
    const {protocol, host, hostPath, port} = await resConf.json()
    const resMe = await fetch(
      `${protocol}://${host}:${port}${
        /^\s*$/.test(hostPath) ? '' : '/' + hostPath
      }/me`,
      {credentials: 'include'}
    )
    if (!resMe.ok) {
      return console.error('[header-app] Failed to fetch user profile')
    }
    const me = await resMe.json()
    setIsAdmin(me.user.groups.includes('admin'))
  }

  useEffect(() => {
    const loadEvent = function (e?: PopStateEvent | HashChangeEvent) {
      const newRef = document.location.href

      fetchMe()
      setCurrentPage(newRef)
    }

    window.addEventListener('popstate', loadEvent)
    // window.addEventListener('hashchange', loadEvent)

    loadEvent()

    return () => {
      window.removeEventListener('popstate', loadEvent)
      // window.removeEventListener('hashchange', loadEvent)
    }
  }, [])

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleOpenMoreMenu = (
    event: React.MouseEvent<HTMLElement>,
    setAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>
  ) => {
    setAnchor(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleCloseMoreMenu = (
    setAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>
  ) => {
    setAnchor(null)
  }

  return (
    <AppBar
      position="static"
      sx={{backgroundColor: '#ffffff'}}
      className={classes.appBar}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters className={classes.toolbar}>
          {isLoggedIn && isAdmin && (
            <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
              <IconButton
                size="large"
                aria-label="open navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                sx={{marginLeft: 1, display: {xs: 'inline-block', md: 'none'}}}
                variant="h6"
                noWrap
                component={isAdmin && isLoggedIn ? 'a' : undefined}
                href={isAdmin && isLoggedIn ? '#!/dashboard' : undefined}
                className={classes.logoContainer}
              >
                <OpenhimLogo />
              </Typography>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: {xs: 'block', md: 'none'}
                }}
              >
                {pages.map(page =>
                  page.link ? (
                    <MenuItem
                      key={page.name}
                      onClick={handleCloseNavMenu}
                      component="a"
                      href={page.link}
                      selected={window.location.href.includes(page.link)}
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key={page.name}
                      onClick={event =>
                        handleOpenMoreMenu(event, getCorrectAnchorEl(page)[1])
                      }
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                      <ArrowDropDownIcon />
                      <Menu
                        anchorEl={
                          page.name.toUpperCase() === 'MORE'
                            ? anchorElMore
                            : anchorElApps
                        }
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                        open={
                          page.name.toUpperCase() === 'MORE'
                            ? Boolean(anchorElMore)
                            : Boolean(anchorElApps)
                        }
                        onClose={() =>
                          handleCloseMoreMenu(getCorrectAnchorEl(page)[1])
                        }
                        className={classes.menu}
                      >
                        {page.children.map((child, index, items) =>
                          child === DIVIDER_MENU_ITEM ? null : (
                            <MenuItem
                              divider={items[index + 1] === DIVIDER_MENU_ITEM}
                              key={child.name}
                              onClick={() =>
                                handleCloseMoreMenu(getCorrectAnchorEl(page)[1])
                              }
                              component="a"
                              href={child.link}
                            >
                              {child.name}
                            </MenuItem>
                          )
                        )}
                      </Menu>
                    </MenuItem>
                  )
                )}
              </Menu>
            </Box>
          )}

          <Typography
            sx={{display: {xs: 'none', md: 'block'}}}
            variant="h6"
            noWrap
            component={isAdmin && isLoggedIn ? 'a' : undefined}
            href={isAdmin && isLoggedIn ? '#!/dashboard' : undefined}
            className={classes.logoContainer}
          >
            <OpenhimLogo />
          </Typography>

          {isLoggedIn && isAdmin && (
            <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
              {pages.map(page =>
                page.link ? (
                  <Button
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    className={
                      window.location.href.includes(page.link)
                        ? classes.selectedButton
                        : classes.button
                    }
                    href={page.link}
                    variant="text"
                  >
                    {page.name}
                  </Button>
                ) : (
                  <Box key={page.name}>
                    <Button
                      onClick={event =>
                        handleOpenMoreMenu(event, getCorrectAnchorEl(page)[1])
                      }
                      className={`${classes.button} ${classes.moreMenuButton}`}
                    >
                      {page.name}
                      <ArrowDropDownIcon />
                    </Button>
                    <Menu
                      anchorEl={getCorrectAnchorEl(page)[0]}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                      open={Boolean(getCorrectAnchorEl(page)[0])}
                      onClose={() =>
                        handleCloseMoreMenu(getCorrectAnchorEl(page)[1])
                      }
                      className={classes.menu}
                    >
                      {page.children.map((child, index, items) =>
                        child === DIVIDER_MENU_ITEM ? null : (
                          <MenuItem
                            divider={items[index + 1] === DIVIDER_MENU_ITEM}
                            key={child.name}
                            onClick={() =>
                              handleCloseMoreMenu(getCorrectAnchorEl(page)[1])
                            }
                            component="a"
                            href={child.link}
                          >
                            {child.name}
                          </MenuItem>
                        )
                      )}
                    </Menu>
                  </Box>
                )
              )}
            </Box>
          )}

          {isLoggedIn && isAdmin && (
            <Box sx={{flexGrow: 0}}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                  <Person className={classes.avatar} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                className={classes.menu}
              >
                {settings.map(setting =>
                  !setting.onClick ? (
                    <MenuItem
                      component="a"
                      href={setting.link}
                      key={setting.name}
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key={setting.name}
                      onClick={() => {
                        handleCloseUserMenu()
                        setting.onClick?.()
                      }}
                    >
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  )
                )}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
      <Box className={classes.gradientBar}></Box>
    </AppBar>
  )
}
