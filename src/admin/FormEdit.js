// src/admin/FormEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { adminAPI } from '../api';

// FormCreate 컴포넌트와 거의 동일하지만, 기존 양식 데이터를 불러와서 수정하는 기능이 추가됩니다.
// 실제 구현에서는 FormCreate 컴포넌트의 로직을 재사용하는 것이 좋습니다.

const FormEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 양식 데이터 로드
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await adminAPI.getForm(id);
        
        if (response.data?.status === 200 && response.data?.data) {
          // 여기서 양식 데이터를 불러와 초기화합니다.
          console.log('양식 데이터:', response.data.data);
        } else {
          setError('지원 양식을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('지원 양식 로드 중 오류:', err);
        setError('지원 양식을 불러오는데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchFormData();
    }
  }, [id]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            component={RouterLink} 
            to={`/admin/forms/${id}`}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            지원 양식 수정
          </Typography>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Alert severity="info">
        이 페이지는 아직 개발 중입니다. FormCreate 컴포넌트와 유사하게 구현되어야 합니다.
      </Alert>
    </Box>
  );
};

export default FormEdit;