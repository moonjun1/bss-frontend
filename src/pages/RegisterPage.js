// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import ScienceIcon from '@mui/icons-material/Science';
import { authAPI } from '../api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // 비밀번호 표시 토글
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 초기화
    if (error) setError('');
  };
  
  // 유효성 검사
  const validateForm = () => {
    // 사용자명 검사
    if (!formData.username.trim()) {
      setError('사용자명을 입력해주세요.');
      return false;
    }
    
    // 이메일 검사
    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return false;
    }
    
    // 비밀번호 검사
    if (!formData.password) {
      setError('비밀번호를 입력해주세요.');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return false;
    }
    
    // 비밀번호 확인 검사
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    
    return true;
  };
  
  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      
      // 회원가입 API 호출
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('회원가입 응답:', response);
      
      if (response.data?.status === 201) {
        // 회원가입 성공
        setSuccess(true);
        
        // 폼 초기화
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data?.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      console.error('회원가입 중 오류 발생:', err);
      setError(
        err.response?.data?.message || 
        '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.'
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
                BSS-LAB 회원가입
              </Typography>
              <Typography variant="body1" color="text.secondary">
                새 계정을 만들어 BSS-LAB의 회원이 되어보세요
              </Typography>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                회원가입이 성공적으로 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="사용자명"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading || success}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="이메일"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading || success}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="비밀번호"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading || success}
                    required
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
                            disabled={loading || success}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                    helperText="비밀번호는 최소 8자 이상이어야 합니다."
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="비밀번호 확인"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading || success}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                            disabled={loading || success}
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading || success}
                    sx={{
                      py: 1.5,
                      mt: 1,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      '회원가입'
                    )}
                  </Button>
                </Grid>
              </Grid>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  이미 계정이
                   있으신가요?{' '}
                  <Link component={RouterLink} to="/login" color="primary" fontWeight={600} underline="hover">
                    로그인
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

export default RegisterPage;