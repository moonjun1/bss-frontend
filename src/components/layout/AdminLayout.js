// src/components/layout/AdminLayout.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  AssignmentInd as AssignmentIndIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// 사이드바 너비
const drawerWidth = 240;

// 스타일드 컴포넌트
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AdminAppBar = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // 관리자 권한 확인 및 사용자 정보 로드
  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        // 인증되지 않은, 로그인페이지로 리다이렉트
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
      
      try {
        const userData = JSON.parse(userStr);
        if (userData.role !== 'ROLE_ADMIN') {
          // 관리자가 아닌 경우 홈으로 리다이렉트
          navigate('/', { replace: true });
          return;
        }
        
        setUser(userData);
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        navigate('/login', { state: { from: location.pathname } });
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate, location.pathname]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 사이드바 메뉴 항목
  const menuItems = [
    { text: '대시보드', icon: <DashboardIcon />, path: '/admin' },
    { text: '사용자 관리', icon: <PeopleIcon />, path: '/admin/users' },
    { text: '게시글 관리', icon: <ArticleIcon />, path: '/admin/posts' },
    { text: '지원 양식 관리', icon: <DescriptionIcon />, path: '/admin/forms' },
    { text: '지원서 관리', icon: <AssignmentIndIcon />, path: '/admin/applications' },
    { text: '설정', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  // 현재 활성화된 메뉴 아이템 확인
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminAppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            BSS-LAB 관리자 페이지
          </Typography>
          
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/" 
            sx={{ mr: 2 }}
          >
            홈페이지
          </Button>
          
          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="계정 메뉴 열기">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {user.username ? user.username.charAt(0).toUpperCase() : <AccountCircleIcon />}
                  </Avatar>
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
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>로그아웃</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AdminAppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            관리자 메뉴
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        
        <Divider />
        
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              disablePadding
              component={RouterLink}
              to={item.path}
              sx={{
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              <ListItemButton
                selected={isActive(item.path)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.12)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: 4,
                      bgcolor: 'primary.main'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

export default AdminLayout;