// src/components/common/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // 로딩 중일 때 표시할 컴포넌트
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 인증되지 않은 사용자라면 로그인 페이지로 리다이렉트
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 관리자 권한이 필요한 페이지인데 관리자가 아니라면
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // 인증된 사용자라면 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;