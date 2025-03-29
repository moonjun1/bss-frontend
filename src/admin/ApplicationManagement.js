// src/pages/admin/ApplicationsManagement.js
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
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { adminAPI } from '../api';

// 지원서 상태별 색상 및 라벨
const APPLICATION_STATUS = {
  'DRAFT': { color: 'default', label: '작성중' },
  'SUBMITTED': { color: 'info', label: '제출됨' },
  'UNDER_REVIEW': { color: 'warning', label: '검토중' },
  'ACCEPTED': { color: 'success', label: '합격' },
  'REJECTED': { color: 'error', label: '불합격' },
  'CANCELLED': { color: 'default', label: '취소됨' }
};

const ApplicationsManagement = () => {
  // 상태 관리
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formFilter, setFormFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [forms, setForms] = useState([]); // 지원 양식 목록
  
  // 지원서 목록 로드
  useEffect(() => {
    fetchApplications();
    // 지원 양식 목록 로드
    fetchForms();
  }, [page, rowsPerPage, statusFilter, formFilter]);
  
  // 지원서 목록 가져오기
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      if (statusFilter !== 'all' && formFilter !== 'all') {
        // 상태와 양식 모두 필터링
        response = await adminAPI.getApplicationsByStatusAndForm(statusFilter, parseInt(formFilter), page, rowsPerPage);
      } else if (statusFilter !== 'all') {
        // 상태별 필터링
        response = await adminAPI.getApplicationsByStatus(statusFilter, page, rowsPerPage);
      } else if (formFilter !== 'all') {
        // 양식별 필터링
        response = await adminAPI.getApplicationsByForm(parseInt(formFilter), page, rowsPerPage);
      } else {
        // 모든 지원서 가져오기
        response = await adminAPI.getApplications(page, rowsPerPage);
      }
      
      if (response.data?.status === 200 && response.data?.data) {
        setApplications(response.data.data.content || []);
        setTotalCount(response.data.data.totalElements || 0);
      } else {
        setError('지원서를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('지원서 로드 중 오류:', err);
      setError('지원서를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };
  
  // 지원 양식 목록 가져오기
  const fetchForms = async () => {
    try {
      const response = await adminAPI.getForms(0, 100); // 모든 양식 가져오기
      
      if (response.data?.status === 200 && response.data?.data) {
        setForms(response.data.data.content || []);
      }
    } catch (err) {
      console.error('지원 양식 로드 중 오류:', err);
    }
  };
  
  // 검색 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      fetchApplications();
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // 검색 API는 이메일 또는 이름으로 검색한다고 가정
      const response = await adminAPI.searchApplications(searchTerm);
      
      if (response.data?.status === 200 && response.data?.data) {
        setApplications(response.data.data.content || []);
        setTotalCount(response.data.data.totalElements || 0);
        setPage(0);
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
  
  // 양식 필터 변경 핸들러
  const handleFormFilterChange = (event) => {
    setFormFilter(event.target.value);
    setPage(0);
  };
  
  // 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = (application) => {
    setSelectedApplication(application);
    setDeleteDialogOpen(true);
  };
  
  // 삭제 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedApplication(null);
  };
  
  // 지원서 삭제 핸들러
  const handleDeleteApplication = async () => {
    if (!selectedApplication) return;
    
    try {
      setLoading(true);
      
      const response = await adminAPI.deleteApplication(selectedApplication.id);
      
      if (response.data?.status === 200) {
        // 삭제 성공, 목록 다시 로드
        fetchApplications();
      } else {
        setError('지원서 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('지원서 삭제 중 오류:', err);
      setError('지원서 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };
  
  // 새로고침 핸들러
  const handleRefresh = () => {
    fetchApplications();
  };
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
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
          지원서 관리
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          새로고침
        </Button>
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
              placeholder="이름 또는 이메일로 검색"
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
          
          {/* 양식 필터 */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="form-filter-label">지원 양식</InputLabel>
            <Select
              labelId="form-filter-label"
              value={formFilter}
              onChange={handleFormFilterChange}
              label="지원 양식"
              size="small"
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">모든 양식</MenuItem>
              {forms.map((form) => (
                <MenuItem key={form.id} value={form.id.toString()}>
                  {form.title}
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
                    label="제출됨" 
                    size="small" 
                    color="info" 
                    sx={{ mr: 1 }} 
                  />
                  제출됨
                </Box>
              } 
              value="SUBMITTED" 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="검토중" 
                    size="small" 
                    color="warning" 
                    sx={{ mr: 1 }} 
                  />
                  검토중
                </Box>
              } 
              value="UNDER_REVIEW" 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="합격" 
                    size="small" 
                    color="success" 
                    sx={{ mr: 1 }} 
                  />
                  합격
                </Box>
              } 
              value="ACCEPTED" 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label="불합격" 
                    size="small" 
                    color="error" 
                    sx={{ mr: 1 }} 
                  />
                  불합격
                </Box>
              } 
              value="REJECTED" 
            />
          </Tabs>
        </Box>
      </Paper>
      
      {/* 지원서 목록 테이블 */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          mb: 2
        }}
      >
        {loading && applications.length === 0 ? (
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
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>지원자</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>지원 양식</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>상태</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>제출일</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>검토일</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">관리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length > 0 ? (
                  applications.map((application) => (
                    <motion.tr
                      key={application.id}
                      variants={rowVariants}
                      style={{ backgroundColor: 'inherit' }}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                    >
                      <TableCell>
                        <Typography variant="body1" fontWeight={500}>
                          {application.applicantName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {application.applicantEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {application.applicationFormTitle}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={APPLICATION_STATUS[application.status]?.label || application.status}
                          color={APPLICATION_STATUS[application.status]?.color || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(application.submittedAt)}</TableCell>
                      <TableCell>{formatDate(application.reviewedAt)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          component={RouterLink}
                          to={`/admin/applications/${application.id}`}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(application)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      {loading ? (
                        <CircularProgress size={30} />
                      ) : (
                        <Typography color="text.secondary">
                          지원서가 없습니다.
                        </Typography>
                      )}
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
      
      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>지원서 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedApplication && (
              <>
                <strong>{selectedApplication.applicantName}</strong>님의 지원서를 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button 
            onClick={handleDeleteApplication} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '삭제'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationsManagement;