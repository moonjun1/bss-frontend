// src/admin/PostsManagement.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { adminAPI } from '../api';

// 게시글 상태별 색상 및 라벨
const POST_STATUS = {
  'PUBLISHED': { color: 'success', label: '게시됨' },
  'DRAFT': { color: 'default', label: '임시저장' },
  'DELETED': { color: 'error', label: '삭제됨' }
};

// 카테고리 정보
const CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'notice', label: '공지사항' },
  { value: 'research', label: '연구 소식' },
  { value: 'seminar', label: '세미나' },
  { value: 'general', label: '자유게시판' }
];

const PostsManagement = () => {
  // 상태 관리
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  // 게시글 목록 로드
  useEffect(() => {
    fetchPosts();
  }, [page, rowsPerPage, statusFilter, categoryFilter]);
  
  // 게시글 목록 가져오기
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      // 검색어가 있는 경우
      if (searchTerm.trim()) {
        response = await adminAPI.searchPosts(searchTerm, page, rowsPerPage);
      } 
      // 상태와 카테고리 모두 필터링
      else if (statusFilter !== 'all' && categoryFilter !== 'all') {
        // Swagger에 해당 API가 없다면, 전체 목록을 가져온 후 프론트엔드에서 필터링
        response = await adminAPI.getAllPosts(page, rowsPerPage);
        if (response.data?.status === 200 && response.data?.data) {
          const allPosts = response.data.data.content || [];
          const filteredPosts = allPosts.filter(
            post => post.status === statusFilter && post.category === categoryFilter
          );
          setPosts(filteredPosts);
          setTotalCount(filteredPosts.length);
          setLoading(false);
          return;
        }
      } 
      // 상태별 필터링 (API에 있다면 사용, 없으면 클라이언트에서 필터링)
      else if (statusFilter !== 'all') {
        response = await adminAPI.getAllPosts(page, rowsPerPage);
        if (response.data?.status === 200 && response.data?.data) {
          const allPosts = response.data.data.content || [];
          const filteredPosts = allPosts.filter(post => post.status === statusFilter);
          setPosts(filteredPosts);
          setTotalCount(filteredPosts.length);
          setLoading(false);
          return;
        }
      }
      // 카테고리별 필터링 (API에 있다면 사용, 없으면 클라이언트에서 필터링)
      else if (categoryFilter !== 'all') {
        response = await adminAPI.getAllPosts(page, rowsPerPage);
        if (response.data?.status === 200 && response.data?.data) {
          const allPosts = response.data.data.content || [];
          const filteredPosts = allPosts.filter(post => post.category === categoryFilter);
          setPosts(filteredPosts);
          setTotalCount(filteredPosts.length);
          setLoading(false);
          return;
        }
      } 
      // 모든 게시글 가져오기
      else {
        response = await adminAPI.getAllPosts(page, rowsPerPage);
      }
      
      if (response.data?.status === 200 && response.data?.data) {
        setPosts(response.data.data.content || []);
        setTotalCount(response.data.data.totalElements || 0);
      } else {
        setError('게시글을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('게시글 로드 중 오류:', err);
      setError('게시글을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };
  
  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };
  
  // 페이지 변경 핸들러
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // 페이지당 행 수 변경 핸들러
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // 상태 필터 변경 핸들러
  const handleStatusFilterChange = (event, newValue) => {
    setStatusFilter(newValue);
    setPage(0);
  };
  
  // 카테고리 필터 변경 핸들러
  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };
  
  // 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = (post) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };
  
  // 삭제 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPost(null);
  };
  
  // 상태 변경 다이얼로그 열기
  const handleOpenStatusDialog = (post) => {
    setSelectedPost(post);
    setNewStatus(post.status);
    setStatusDialogOpen(true);
  };
  
  // 상태 변경 다이얼로그 닫기
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedPost(null);
  };
  
  // 게시글 삭제 핸들러
  const handleDeletePost = async () => {
    try {
      setLoading(true);
      
      const response = await adminAPI.deletePost(selectedPost.id);
      
      if (response.data?.status === 200) {
        // 삭제 성공, 목록 다시 로드
        fetchPosts();
      } else {
        setError('게시글 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('게시글 삭제 중 오류:', err);
      setError('게시글 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };
  
  // 게시글 상태 변경 핸들러
  const handleChangePostStatus = async () => {
    try {
      setLoading(true);
      
      const response = await adminAPI.updatePostStatus(selectedPost.id, newStatus);
      
      if (response.data?.status === 200) {
        // 상태 변경 성공, 목록 다시 로드
        fetchPosts();
      } else {
        setError('게시글 상태 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error('게시글 상태 변경 중 오류:', err);
      setError('게시글 상태 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      handleCloseStatusDialog();
    }
  };
  
  // 새로고침 핸들러
  const handleRefresh = () => {
    setSearchTerm('');
    fetchPosts();
  };
  
  // 카테고리 라벨 가져오기
  const getCategoryLabel = (categoryValue) => {
    const category = CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };
  
  // 테이블 애니메이션을 위한 variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      } 
    }
  };
  
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          게시글 관리
        </Typography>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ mr: 1 }}
          >
            새로고침
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/board/create"
          >
            새 게시글
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Fade in={Boolean(error)}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Fade>
      )}
      
      {/* 검색 및 필터링 */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* 검색 폼 */}
          <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              placeholder="제목 또는 내용으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button type="submit" size="small">검색</Button>
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Box>
          
          {/* 카테고리 필터 */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="category-filter-label">카테고리</InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
              label="카테고리"
              size="small"
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              {CATEGORIES.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* 상태 필터 탭 */}
        <Box sx={{ mt: 2 }}>
          <Tabs
            value={statusFilter}
            onChange={handleStatusFilterChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="전체" value="all" />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="게시됨" 
                    size="small" 
                    color="success" 
                    sx={{ mr: 1 }} 
                  />
                  게시됨
                </Box>
              } 
              value="PUBLISHED" 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="임시저장" 
                    size="small" 
                    color="default" 
                    sx={{ mr: 1 }} 
                  />
                  임시저장
                </Box>
              } 
              value="DRAFT" 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="삭제됨" 
                    size="small" 
                    color="error" 
                    sx={{ mr: 1 }} 
                  />
                  삭제됨
                </Box>
              } 
              value="DELETED" 
            />
          </Tabs>
        </Box>
      </Paper>
      
      {/* 게시글 목록 테이블 */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          mb: 2
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <motion.div
            variants={tableVariants}
            initial="hidden"
            animate="visible"
          >
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>제목</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>카테고리</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>작성자</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>상태</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>조회수</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>작성일</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">관리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <motion.tr
                      key={post.id}
                      variants={rowVariants}
                      style={{ backgroundColor: 'inherit' }}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                    >
                      <TableCell>
                        <Typography variant="body1" fontWeight={500} noWrap sx={{ maxWidth: 300 }}>
                          {post.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getCategoryLabel(post.category)}
                          size="small"
                          color={post.category === 'notice' ? 'secondary' : 'primary'}
                        />
                      </TableCell>
                      <TableCell>{post.username}</TableCell>
                      <TableCell>
                        <Chip
                          label={POST_STATUS[post.status]?.label || post.status}
                          color={POST_STATUS[post.status]?.color || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{post.viewCount}</TableCell>
                      <TableCell>{formatDate(post.createdAt)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          component={RouterLink}
                          to={`/board/${post.id}`}
                          title="상세 보기"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenStatusDialog(post)}
                          title="상태 변경"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(post)}
                          title="삭제"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        게시글이 없습니다.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </motion.div>
        )}
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="페이지당 행 수:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </TableContainer>
      
      {/* 상태 변경 다이얼로그 */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleCloseStatusDialog}
      >
        <DialogTitle>게시글 상태 변경</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {selectedPost && (
              <>
                <strong>{selectedPost.title}</strong> 게시글의 상태를 변경합니다.
              </>
            )}
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="status-change-label">상태</InputLabel>
            <Select
              labelId="status-change-label"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="상태"
            >
              <MenuItem value="PUBLISHED">게시됨</MenuItem>
              <MenuItem value="DRAFT">임시저장</MenuItem>
              <MenuItem value="DELETED">삭제됨</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>취소</Button>
          <Button 
            onClick={handleChangePostStatus} 
            variant="contained"
            color="primary"
            disabled={selectedPost && selectedPost.status === newStatus}
          >
            변경
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>게시글 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedPost && (
              <>
                <strong>{selectedPost.title}</strong> 게시글을 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button 
            onClick={handleDeletePost} 
            color="error" 
            variant="contained"
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostsManagement;