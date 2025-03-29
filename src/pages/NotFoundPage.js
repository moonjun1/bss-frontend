// src/pages/NotFoundPage.js
import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

const NotFoundPage = () => {
  return (
    <MainLayout>
      <Container sx={{ textAlign: 'center' }}>
        <Box sx={{ py: 8 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            페이지를 찾을 수 없습니다
          </Typography>
          <Button 
            component={Link} 
            to="/" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3 }}
          >
            홈으로 돌아가기
          </Button>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default NotFoundPage;