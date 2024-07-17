import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';

const pages = ['Portal', 'Dashboard', 'Transaction Log'];
const adminPages = [
  'Audit Log',
  'Clients',
  'Channels',
  'Tasks',
  'Visualizer', 
  'Contact Lists',
  'Mediators',
  'Users',
  'Certificates', 
  'Import/Export',
  'Server Logs'
];
const otherPages = ['About'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function OpenhimAppBar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  useEffect(() => {
    async function fetchMe() {
      const resConf = await fetch('/config/default.json');
      if (!resConf.ok) {
        return console.error(
          '[sidebar-app] Failed to fetch OpenHIM console config'
        );
      }
      const { protocol, host, hostPath, port } = await resConf.json();
      const resMe = await fetch(
        `${protocol}://${host}:${port}${
          /^\s*$/.test(hostPath) ? '' : '/' + hostPath
        }/me`,
        { credentials: 'include' }
      );
      if (!resMe.ok) {
        return console.error('[sidebar-app] Failed to fetch user profile');
      }
      const me = await resMe.json();
      setIsAdmin(me.user.groups.includes('admin'));
    }

    if (!location.href.includes('#!/login')) {
      fetchMe();
    }
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            OpenHIM
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu} component="a" href={`#!/${page.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              {isAdmin && adminPages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu} component="a" href={`#!/${page.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              {otherPages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu} component="a" href={`#!/${page.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            OpenHIM
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href={`#!/${page.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {page}
              </Button>
            ))}
            {isAdmin && adminPages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href={`#!/${page.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {page}
              </Button>
            ))}
            {otherPages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href={`#!/${page.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
