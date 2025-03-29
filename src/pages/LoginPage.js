// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import ScienceIcon from '@mui/icons-material/Science';
import { authAPI } from '../api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
    
    // 입력 시 에러 메시지 초기화
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 간단한 유효성 검사
    if (!formData.username.trim()) {
      setError('사용자명을 입력해주세요.');
      return;
    }
    if (!formData.password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // 로그인 API 호출 (스웨거 문서에 맞춤)
      const response = await authAPI.login({
        username: formData.username,
        password: formData.password
      });
      
      // 응답 구조 확인 및 토큰 추출
      console.log('로그인 응답:', response);
      
      if (response.data?.status === 200) {
        // 스웨거 문서 기준 토큰 저장
        const userData = response.data.data;
        
        if (userData?.token) {
          localStorage.setItem('token', userData.token);
          
          // 사용자 정보 저장
          localStorage.setItem('user', JSON.stringify({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role
          }));
          
          // 로그인 상태 유지 설정
          if (formData.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          
          // 메인 페이지로 리다이렉트
          navigate('/');
        } else {
          setError('토큰이 없습니다. 서버 응답을 확인해주세요.');
        }
      } else {
        setError(response.data?.message || '로그인에 실패했습니다.');
      }
      
    } catch (err) {
      console.error('로그인 에러:', err);
      setError(
        err.response?.data?.message || 
        '로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8f9fa',
        py: 5
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              height: 8,
              background: 'linear-gradient(90deg, #1a237e 0%, #f50057 100%)'
            }}
          />
          
          <CardContent sx={{ p: 5 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <ScienceIcon sx={{ fontSize: 50, color: 'primary.main' }} />
              </Box>
              <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
                BSS-LAB 로그인
              </Typography>
              <Typography variant="body1" color="text.secondary">
                계정을 통해 연구실 시스템에 접속하세요
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="사용자명"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="비밀번호"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      color="primary" 
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  }
                  label="로그인 유지"
                />
                <Link component={RouterLink} to="/forgot-password" color="primary" underline="hover">
                  비밀번호를 잊으셨나요?
                </Link>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  mb: 3
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  '로그인'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  계정이 없으신가요?{' '}
                  <Link component={RouterLink} to="/register" color="primary" fontWeight={600} underline="hover">
                    가입하기
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
          >
            홈으로 돌아가기
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;