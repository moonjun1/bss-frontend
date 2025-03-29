// src/components/common/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Avatar,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ScienceIcon from '@mui/icons-material/Science';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { authAPI } from '../../api';

const pages = [
  { title: '홈', path: '/' },
  { title: '소개', path: '/about' },
  { title: '연구', path: '/research' },
  { title: '게시판', path: '/board' },
  { title: '지원', path: '/apply' }
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 사용자 정보 로드
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      setUser(JSON.parse(userJson));
    } else {
      setUser(null);
    }
  }, [location.pathname]); // URL이 변경될 때마다 사용자 정보 확인

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      // 로컬 스토리지 토큰 및 사용자 정보 삭제
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      handleCloseUserMenu();
      navigate('/');
    }
  };

  return (
    <AppBar 
      position="fixed"
      sx={{
        backgroundColor: scrolled ? 'rgba(26, 35, 126, 0.95)' : 'transparent',
        boxShadow: scrolled ? '0px 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* 데스크톱 로고 */}
          <ScienceIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: 32 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            BSS-LAB
          </Typography>

          {/* 모바일 햄버거 메뉴 */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
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
                <MenuItem 
                  key={page.title} 
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to={page.path}
                  selected={location.pathname === page.path}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* 모바일 로고 */}
          <ScienceIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            BSS-LAB
          </Typography>

          {/* 데스크톱 메뉴 아이템 */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ 
                  my: 2, 
                  mx: 1,
                  color: 'white', 
                  display: 'block',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: location.pathname === page.path ? '100%' : '0',
                    height: '2px',
                    bottom: '10px',
                    left: '0',
                    backgroundColor: 'white',
                    transition: 'width 0.3s ease-in-out'
                  },
                  '&:hover::after': {
                    width: '100%'
                  }
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* 로그인/사용자 메뉴 */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="사용자 메뉴 열기">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'secondary.main',
                        color: 'white'
                      }}
                    >
                      {user.username?.charAt(0).toUpperCase() || <AccountCircleIcon />}
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
                    <Typography variant="subtitle1" fontWeight={600} color="primary">
                      {user.username}님
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <MenuItem 
                    component={Link} 
                    to="/mypage"
                    onClick={handleCloseUserMenu}
                  >
                    <Typography textAlign="center">마이페이지</Typography>
                  </MenuItem>
                  {user.role === 'ROLE_ADMIN' && (
                    <MenuItem 
                      component={Link} 
                      to="/admin"
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">관리자 페이지</Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">로그아웃</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
                component={Link} 
                to="/login"
                variant="outlined" 
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  }
                }}
              >
                로그인
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;