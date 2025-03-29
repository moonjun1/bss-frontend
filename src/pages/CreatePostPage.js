// src/pages/CreatePostPage.js
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { postAPI } from '../api';

// 카테고리 옵션
const CATEGORIES = [
  { value: 'notice', label: '공지사항' },
  { value: 'research', label: '연구 소식' },
  { value: 'seminar', label: '세미나' },
  { value: 'general', label: '자유게시판' }
];

const CreatePostPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    status: 'PUBLISHED'
  });
  
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
  
  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      // 미리보기 URL 생성
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  // 파일 제거 핸들러
  const handleRemoveFile = (index) => {
    // 파일 제거
    setFiles(prev => prev.filter((_, i) => i !== index));
    
    // 미리보기 URL 제거 및 해제
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  // 유효성 검사
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return false;
    }
    
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
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
      
      // 게시글 생성 API 호출
      const response = await postAPI.createPost(formData);
      console.log('게시글 생성 응답:', response);
      
      if (response.data?.status === 201 && response.data?.data) {
        const postId = response.data.data;
        
        // 이미지 업로드 (이미지가 있는 경우)
        if (files.length > 0) {
          const formData = new FormData();
          files.forEach(file => {
            formData.append('images', file);
          });
          
          await postAPI.uploadPostImage(postId, formData);
        }
        
        // 게시글 상세 페이지로 이동
        navigate(`/board/${postId}`);
      } else {
        setError(response.data?.message || '게시글 작성에 실패했습니다.');
      }
    } catch (err) {
      console.error('게시글 작성 중 오류 발생:', err);
      setError(
        err.response?.data?.message || 
        '게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            component={RouterLink}
            to="/board"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            목록으로 돌아가기
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            게시글 작성
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="카테고리"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  >
                    {CATEGORIES.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="제목"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="내용"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    multiline
                    rows={10}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      이미지 업로드 (선택)
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{ borderRadius: 2, mr: 1 }}
                        disabled={loading}
                      >
                        이미지 선택
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                          disabled={loading}
                        />
                      </Button>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                        {files.length > 0 ? `${files.length}개의 파일 선택됨` : '이미지를 선택해주세요'}
                      </Typography>
                    </Box>
                    
                    {/* 이미지 미리보기 */}
                    {previewUrls.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                        {previewUrls.map((url, index) => (
                          <Box
                            key={index}
                            sx={{
                              position: 'relative',
                              width: 150,
                              height: 150,
                              borderRadius: 1,
                              overflow: 'hidden',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          >
                            <Box
                              component="img"
                              src={url}
                              alt={`미리보기 ${index}`}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                bgcolor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                '&:hover': {
                                  bgcolor: 'rgba(0,0,0,0.7)',
                                }
                              }}
                              onClick={() => handleRemoveFile(index)}
                              disabled={loading}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button
                      variant="outlined"
                      component={RouterLink}
                      to="/board"
                      disabled={loading}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        '저장'
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default CreatePostPage;