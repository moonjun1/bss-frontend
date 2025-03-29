// src/pages/MainPage.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Alert, AlertTitle } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import Hero from '../components/main/Hero';
import About from '../components/main/About';

const MainPage = () => {
  const [user, setUser] = useState(null);
  
  // 사용자 정보 로드
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);
  
  return (
    <MainLayout>
      <Box component="div">
        {/* 로그인 환영 메시지 */}
        {user && (
          <Container maxWidth="lg" sx={{ pt: 12, pb: 2 }}>
            <Alert 
              severity="success" 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '& .MuiAlert-message': { 
                  width: '100%'
                }
              }}
            >
              <AlertTitle>환영합니다!</AlertTitle>
              <strong>{user.username}</strong>님, BSS-LAB에 오신 것을 환영합니다. 
              최신 연구 정보와 공지사항을 확인하실 수 있습니다.
            </Alert>
          </Container>
        )}
        
        <Hero />
        <About />
        {/* 나머지 섹션들... */}
      </Box>
    </MainLayout>
  );
};

export default MainPage;