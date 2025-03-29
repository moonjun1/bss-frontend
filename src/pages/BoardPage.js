// src/pages/BoardPage.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { postAPI } from '../api';

// 카테고리 매핑
const CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'notice', label: '공지사항' },
  { value: 'research', label: '연구 소식' },
  { value: 'seminar', label: '세미나' },
  { value: 'general', label: '자유게시판' }
];

const BoardPage = () => {
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 게시글 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        
        if (category === 'all') {
          // 전체 게시글 조회
          response = await postAPI.getPosts(page - 1, 10);
        } else {
          // 카테고리별 게시글 조회
          response = await postAPI.getPostsByCategory(category, page - 1, 10);
        }
        
        console.log('게시글 조회 응답:', response);
        
        // 응답 구조 처리
        if (response.data?.status === 200 && response.data?.data) {
          const data = response.data.data;
          setPosts(data.content || []);
          setTotalPages(data.totalPages || 1);
        } else {
          setError('게시글을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('게시글을 불러오는데 실패했습니다:', err);
        setError('게시글을 불러오는데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, category]);

  // 페이지 변경 핸들러
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
    setPage(1);
  };

  // 검색 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await postAPI.searchPosts(searchTerm, 0, 10);
      
      if (response.data?.status === 200 && response.data?.data) {
        const data = response.data.data;
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 1);
        setPage(1);
      } else {
        setError('검색에 실패했습니다.');
      }
    } catch (err) {
      console.error('검색 중 오류 발생:', err);
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 글쓰기 페이지로 이동
  const handleWritePost = () => {
    // 토큰 확인 (간단한 인증 체크)
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/board/create');
    } else {
      navigate('/login', { state: { from: '/board' } });
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <MainLayout>
      <Box
        sx={{
          pt: 12,
          pb: 8,
          bgcolor: '#1a237e',
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2
            }}
          >
            게시판
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, mb: 4 }}>
            BSS 연구실의 최신 소식과 공지사항을 확인하세요
          </Typography>

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Tabs
                value={category}
                onChange={handleCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  mb: { xs: 2, md: 0 },
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  '& .MuiTab-root': {
                    color: 'white',
                    opacity: 0.7,
                    '&.Mui-selected': {
                      color: 'white',
                      opacity: 1,
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#f50057',
                  }
                }}
              >
                {CATEGORIES.map((cat) => (
                  <Tab key={cat.value} value={cat.value} label={cat.label} />
                ))}
              </Tabs>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box component="form" onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  placeholder="검색어를 입력하세요"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'white' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f50057',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        opacity: 1,
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      }
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleWritePost}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            글쓰기
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : posts.length > 0 ? (
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={
                          CATEGORIES.find(cat => cat.value === post.category)?.label || 
                          '기타'
                        }
                        size="small"
                        color={post.category === 'notice' ? 'secondary' : 'primary'}
                        sx={{ mr: 2 }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                          <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(post.createdAt)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                          <PersonIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {post.username || '익명'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <VisibilityIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {post.viewCount}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Typography
                      variant="h5"
                      component={RouterLink}
                      to={`/board/${post.id}`}
                      sx={{
                        color: 'text.primary',
                        textDecoration: 'none',
                        fontWeight: 600,
                        display: 'block',
                        mb: 2,
                        '&:hover': {
                          color: 'primary.main',
                        }
                      }}
                    >
                      {post.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {post.content}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      component={RouterLink}
                      to={`/board/${post.id}`}
                      color="primary"
                    >
                      자세히 보기
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              게시글이 없습니다
            </Typography>
          </Box>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
    </MainLayout>
  );
};

export default BoardPage;