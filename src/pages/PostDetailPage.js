// src/pages/PostDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { postAPI } from '../api';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await postAPI.getPost(id);
        console.log('게시글 상세 응답:', response);
        
        // 응답 구조 처리
        if (response.data?.status === 200 && response.data?.data) {
          setPost(response.data.data);
          
          // 작성자 확인 (현재 사용자가 작성자인지)
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          setIsOwner(user.id === response.data.data.userId);
        } else {
          setError('게시글을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('게시글 상세를 불러오는데 실패했습니다:', err);
        setError('게시글을 불러오는데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // 삭제 다이얼로그 핸들러
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  // 게시글 삭제 핸들러
  const handleDeletePost = async () => {
    try {
      setLoading(true);
      
      const response = await postAPI.deletePost(id);
      
      if (response.data?.status === 200) {
        // 삭제 성공 시 게시판 목록으로 이동
        navigate('/board', { replace: true });
      } else {
        setError('게시글 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('게시글 삭제 중 오류 발생:', err);
      setError('게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  // 카테고리 레이블 가져오기
  const getCategoryLabel = (categoryValue) => {
    const categories = {
      'notice': '공지사항',
      'research': '연구 소식',
      'seminar': '세미나',
      'general': '자유게시판'
    };
    return categories[categoryValue] || '기타';
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : post ? (
          <>
            <Box sx={{ mb: 3 }}>
              <Button
                component={RouterLink}
                to="/board"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 2 }}
              >
                목록으로 돌아가기
              </Button>
              
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={getCategoryLabel(post.category)}
                      size="small"
                      color={post.category === 'notice' ? 'secondary' : 'primary'}
                    />
                    
                    {/* 수정/삭제 버튼 (작성자만 표시) */}
                    {isOwner && (
                      <Box sx={{ ml: 'auto', display: 'flex' }}>
                        <IconButton
                          component={RouterLink}
                          to={`/board/edit/${post.id}`}
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={handleDeleteDialogOpen}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      mt: 2,
                      mb: 3,
                      wordBreak: 'break-word'
                    }}
                  >
                    {post.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 4, mb: 1 }}>
                      <PersonIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {post.username || '익명'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 4, mb: 1 }}>
                      <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(post.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <VisibilityIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {post.viewCount}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  {/* 게시글 본문 */}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap', 
                      wordBreak: 'break-word',
                      mb: 4
                    }}
                  >
                    {post.content}
                  </Typography>
                  
                  {/* 이미지 표시 */}
                  {post.images && post.images.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" gutterBottom>
                        첨부된 이미지
                      </Typography>
                      <Grid container spacing={2}>
                        {post.images.map((image) => (
                          <Grid item xs={12} sm={6} md={4} key={image.id}>
                            <Box
                              component="img"
                              src={`/api/files/${image.imageUrl}`}
                              alt={`첨부 이미지 ${image.id}`}
                              sx={{
                                width: '100%',
                                borderRadius: 1,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
            
            {/* 삭제 확인 다이얼로그 */}
            <Dialog
              open={deleteDialogOpen}
              onClose={handleDeleteDialogClose}
            >
              <DialogTitle>게시글 삭제</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  이 게시글을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteDialogClose}>취소</Button>
                <Button 
                  onClick={handleDeletePost} 
                  color="error" 
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : '삭제'}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              게시글이 존재하지 않습니다
            </Typography>
            <Button
              component={RouterLink}
              to="/board"
              variant="contained"
              sx={{ mt: 3 }}
            >
              게시판으로 돌아가기
            </Button>
          </Box>
        )}
      </Container>
    </MainLayout>
  );
};

export default PostDetailPage;