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

let pages: Page[] = [
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
      {name: 'Add Client Role', link: '#!/client-roles/add'}
    ]
  },
  {
    name: 'USERS',
    children: [
      {name: 'Manage Users', link: '#!/users'},
      {name: 'Add User', link: '#!/users/create-user'},
      DIVIDER_MENU_ITEM,
      {name: 'Role Based Access Control', link: '#!/rbac'},
      {name: 'Role Based Access Control - Add', link: '#!/rbac/create-role'}
    ]
  },
  {
    name: 'MORE',
    children: [
      {name: 'About', link: '#!/about'},
      {name: 'Portal', link: '#!/portal'},
      {name: 'Manage Apps', link: '#!/portal-admin'},
      {name: 'Audit Log', link: '#!/audits'},
      {name: 'Tasks', link: '#!/tasks'},
      {name: 'Visualizer', link: '#!/visualizer'},
      {name: 'Contact Lists', link: '#!/groups'},
      {name: 'Mediators', link: '#!/mediators'},
      {name: 'Certificates', link: '#!/certificates'},
      {name: 'Import/Export', link: '#!/export-import'},
      {name: 'Server Logs', link: '#!/logs'}
    ]
  },
  {
    name: 'APPS',
    children: []
  }
]

export default function OpenhimAppBar() {
  const {hideConfirmation, showConfirmation} = useConfirmation()
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
    !window.location.href.includes('#!/logout') &&
    !window.location.href.includes('#!/forgot-password')

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
      width="100"
      height="40"
      style={{
        textDecoration: 'none',
        marginLeft: '32px'
      }}
      src="data:image/png;base64,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"
    />
  )

  const fetchMe = async () => {
    if (window.location.href.includes('#!/forgot-password')) return

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

  const fetchApps = async () => {
    const resConf = await fetch('/config/default.json')
    if (!resConf.ok) {
      return console.error(
        '[header-app] Failed to fetch OpenHIM console config'
      )
    }
    const {protocol, host, hostPath, port} = await resConf.json()
    const resApps = await fetch(
      `${protocol}://${host}:${port}${
        /^\s*$/.test(hostPath) ? '' : '/' + hostPath
      }/apps`,
      {credentials: 'include'}
    )
    if (!resApps.ok) {
      return console.error('[header-app] Failed to fetch apps')
    }
    const apps = await resApps.json()
    if (apps.length === 0) {
      return
    }
    const updatedPages = pages.map((page, index) =>
      index === pages.length - 1
        ? {
            ...page,
            children: apps.map((app: any) => ({
              name: app.name,
              link: `#!/` + app.url.split('/').pop().split('.')[0]
            }))
          }
        : page
    )
    pages = updatedPages
  }

  useEffect(() => {
    const loadEvent = function (e?: PopStateEvent | HashChangeEvent) {
      const newRef = document.location.href
      fetchApps()
      fetchMe()
      setCurrentPage(newRef)
    }

    window.addEventListener('popstate', loadEvent)

    loadEvent()

    return () => {
      window.removeEventListener('popstate', loadEvent)
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
      sx={{backgroundColor: '#ffffff'}}
      style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        color: '#000000',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Toolbar disableGutters>
        {isLoggedIn && isAdmin && (
          <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              style={{color: 'grey'}}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              sx={{
                marginLeft: 1,
                display: {xs: 'inline-block', md: 'none', lg: 'none'}
              }}
              variant="body1"
              noWrap
              component={isAdmin && isLoggedIn ? 'a' : undefined}
              href={isAdmin && isLoggedIn ? '#!/dashboard' : undefined}
              style={{paddingRight: '30px'}}
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
                    selected={window.location.href.endsWith(page.link)}
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
                      style={{marginTop: 4}}
                    >
                      {page.children.map((child, index, items) =>
                        child === DIVIDER_MENU_ITEM ? null : (
                          <MenuItem
                            divider={items[index + 1] === DIVIDER_MENU_ITEM}
                            key={child.name}
                            onClick={() =>
                              handleCloseMoreMenu(getCorrectAnchorEl(page)[1])
                            }
                            selected={window.location.href.endsWith(child.link)}
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
        <Box sx={{display: {xs: 'none', md: 'flex'}}}>
          <OpenhimLogo />
        </Box>

        {isLoggedIn && isAdmin && (
          <Box
            sx={{
              flexGrow: 1,
              display: {xs: 'none', md: 'flex', marginLeft: '64px'}
            }}
          >
            {pages.map(page =>
              page.link ? (
                <Button
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  style={
                    window.location.href.includes(page.link)
                      ? {
                          textTransform: 'none',
                          fontWeight: 500,
                          marginRight: '20px',
                          color: '#388e3c'
                        }
                      : {
                          textTransform: 'none',
                          fontWeight: 500,
                          marginRight: '20px',
                          color: '#00000099'
                        }
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
                    style={
                      page.children?.some(
                        child =>
                          child != DIVIDER_MENU_ITEM &&
                          window.location.href.includes(child.link)
                      )
                        ? {
                            display: 'flex',
                            alignItems: 'center',
                            textTransform: 'none',
                            fontWeight: 500,
                            marginRight: '20px',
                            color: '#388e3c'
                          }
                        : {
                            display: 'flex',
                            alignItems: 'center',
                            textTransform: 'none',
                            fontWeight: 500,
                            marginRight: '20px',
                            color: '#00000099'
                          }
                    }
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
                    style={{marginTop: 4}}
                  >
                    {page.children.map((child, index, items) =>
                      child === DIVIDER_MENU_ITEM ? null : (
                        <MenuItem
                          divider={items[index + 1] === DIVIDER_MENU_ITEM}
                          key={child.name}
                          onClick={() =>
                            handleCloseMoreMenu(getCorrectAnchorEl(page)[1])
                          }
                          selected={window.location.href.endsWith(child.link)}
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
                <Person style={{width: 26, height: 26, marginRight: '32px'}} />
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
              style={{marginTop: 40}}
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
      <Box
        sx={{height: 5, background: 'linear-gradient(90deg, #5EF26F, #058568)'}}
      />
    </AppBar>
  )
}
