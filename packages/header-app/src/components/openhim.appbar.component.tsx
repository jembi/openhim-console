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
      src='data:image/png;base64,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'
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
