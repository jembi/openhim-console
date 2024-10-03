import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import MenuIcon from '@mui/icons-material/Menu'
import Person from '@mui/icons-material/Person'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {useConfirmation} from '../contexts/confirmation.context'
import {Page, Role, UserProfile} from '../types'
import {getApps, getUser, getUserPermissionRoles} from '../services/api'
import {useAlert} from '../contexts/alert.context'
import {OpenhimLogo} from './common/openhim.logo'

const DIVIDER_MENU_ITEM: Readonly<Page> = Object.freeze({
  name: '__',
  children: [],
  link: ''
})

export default function OpenhimAppBar() {
  const [pages, setPages] = useState<Page[]>([
    {name: 'DASHBOARD', link: '#!/dashboard'},
    {
      name: 'TRANSACTIONS',
      link: '#!/transactions',
      permissions: ['transaction-view-all']
    },
    {name: 'CHANNELS', link: '#!/channels', permissions: ['channel-view-all']},
    {
      name: 'CLIENTS',
      permissions: ['client-view-all'],
      children: [
        {
          name: 'Manage Client',
          link: '#!/clients',
          permissions: ['client-manage-all']
        },
        {
          name: 'Add Client',
          link: '#!/clients/add',
          permissions: ['client-manage-all']
        },
        DIVIDER_MENU_ITEM,
        {
          name: 'Manage Client Roles',
          link: '#!/client-roles',
          permissions: ['client-role-manage-all']
        },
        {
          name: 'Add Client Role',
          link: '#!/client-roles/add',
          permissions: ['client-role-manage-all']
        }
      ]
    },
    {
      name: 'USERS',
      permissions: ['user-view'],
      children: [
        {name: 'Manage Users', link: '#!/users', permissions: ['user-manage']},
        {
          name: 'Add User',
          link: '#!/users/create-user',
          permissions: ['user-manage']
        },
        DIVIDER_MENU_ITEM,
        {
          name: 'Role Based Access Control',
          link: '#!/rbac',
          permissions: ['user-role-manage']
        },
        {
          name: 'Role Based Access Control - Add',
          link: '#!/rbac/create-role',
          permissions: ['user-role-manage']
        }
      ]
    },
    {
      name: 'MORE',
      children: [
        {name: 'About', link: '#!/about'},
        {name: 'Portal', link: '#!/portal'},
        {
          name: 'Manage Apps',
          link: '#!/portal-admin',
          permissions: ['app-manage-all']
        },
        {
          name: 'Audit Log',
          link: '#!/audits',
          permissions: ['audit-trail-manage']
        },
        {name: 'Tasks', link: '#!/tasks'},
        {
          name: 'Visualizer',
          link: '#!/visualizer',
          permissions: ['visualizer-manage']
        },
        {
          name: 'Contact Lists',
          link: '#!/groups',
          permissions: ['contact-list-manage']
        },
        {
          name: 'Mediators',
          link: '#!/mediators',
          permissions: ['metadata-manage-all']
        },
        {
          name: 'Certificates',
          link: '#!/certificates',
          permissions: ['certificates-manage']
        },
        {
          name: 'Import/Export',
          link: '#!/export-import',
          permissions: ['import-export']
        },
        {
          name: 'Server Logs',
          link: '#!/logs',
          permissions: ['logs-view']
        }
      ]
    },
    {
      name: 'APPS',
      children: []
    }
  ])
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
  const [roles, setRoles] = useState<Role[] | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const {showAlert} = useAlert()

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

  const fetchMe = async () => {
    if (window.location.href.includes('#!/forgot-password')) return

    const me = await getUser()
    setUser(me)
    setIsAdmin(me.user.groups.includes('admin'))
  }

  const fetchApps = async () => {
    try {
      const apps = await getApps()
      if (apps.length === 0) {
        return
      }
      const updatedPages = pages.map((page, index) =>
        index === pages.length - 1
          ? {
              ...page,
              children: apps.map(app => ({
                name: app.name,
                link: `#!/` + app.url.split('/').pop().split('.')[0]
              }))
            }
          : page
      )

      setPages(updatedPages)
    } catch (err: any) {
      console.error(err)
      showAlert(
        'Error fetching user apps. ' + err?.response?.data,
        'Error',
        'error'
      )
    }
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

  useEffect(() => {
    if (!isLoggedIn || !user) return

    getUserPermissionRoles(user.user.groups)
      .then(roles => {
        setRoles(roles)
      })
      .catch((err: any) => {
        console.error(err)
        showAlert(
          'Error fetching user permissions. ' + err?.response?.data,
          'Error',
          'error'
        )
      })
  }, [user])

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

  const canViewPageBasedOnPermissions = (page: Page) => {
    if (!page.permissions) return true
    if (!roles) return false
    return roles.some(role =>
      page.permissions?.some(permission => role.permissions[permission])
    )
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
                    disabled={!canViewPageBasedOnPermissions(page)}
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
                            disabled={!canViewPageBasedOnPermissions(child)}
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
                  disabled={!canViewPageBasedOnPermissions(page)}
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
                          disabled={!canViewPageBasedOnPermissions(child)}
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
