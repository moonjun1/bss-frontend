// src/pages/admin/FormsManagement.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { adminAPI } from '../../api';

const FormsManagement = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // 지원 양식 목록 로드
  useEffect(() => {
    fetchForms();
  }, [page, rowsPerPage, statusFilter]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      if (statusFilter === 'all') {
        // 모든 양식 조회
        response = await adminAPI.getForms(page, rowsPerPage);
      } else {
        // 상태별 양식 조회
        response = await adminAPI.getFormsByStatus(statusFilter, page, rowsPerPage);
      }
      
      if (response.data?.status === 200 && response.data?.data) {
        const { content, totalElements } = response.data.data;
        setForms(content || []);
        setTotalCount(totalElements || 0);
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

  // 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = (form) => {
    setSelectedForm(form);
    setDeleteDialogOpen(true);
  };

  // 삭제 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedForm(null);
  };

  // 양식 삭제 핸들러
  const handleDeleteForm = async () => {
    if (!selectedForm) return;
    
    try {
      setLoading(true);
      
      const response = await adminAPI.deleteForm(selectedForm.id);
      
      if (response.data?.status === 200) {
        // 삭제 성공, 목록 다시 로드
        fetchForms();
      } else {
        setError('지원 양식 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('지원 양식 삭제 중 오류:', err);
      setError('지원 양식 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  // 상태에 따른 색상 반환
  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'PUBLISHED': return 'success';
      case 'CLOSED': return 'error';
      default: return 'default';
    }
  };

  // 상태 레이블 반환
  const getStatusLabel = (status) => {
    switch (status) {
      case 'DRAFT': return '임시저장';
      case 'PUBLISHED': return '모집중';
      case 'CLOSED': return '마감';
      default: return status;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          지원 양식 관리
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/admin/forms/create"
        >
          새 양식 작성
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={statusFilter}
          onChange={handleStatusFilterChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ px: 2, pt: 2 }}
        >
          <Tab label="전체" value="all" />
          <Tab label="임시저장" value="DRAFT" />
          <Tab label="모집중" value="PUBLISHED" />
          <Tab label="마감" value="CLOSED" />
        </Tabs>
      </Paper>
      
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        {loading && forms.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)' }}>
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>모집 기간</TableCell>
                <TableCell>질문 수</TableCell>
                <TableCell>지원자 수</TableCell>
                <TableCell>생성일</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forms.length > 0 ? (
                forms.map((form) => (
                  <TableRow key={form.id} hover>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body1" noWrap>
                        {form.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(form.status)}
                        color={getStatusColor(form.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {form.startDate && form.endDate ? (
                        <>
                          {formatDate(form.startDate)}
                          <br />
                          ~ {formatDate(form.endDate)}
                        </>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{form.questionCount || 0}</TableCell>
                    <TableCell>{form.applicationCount || 0}</TableCell>
                    <TableCell>{formatDate(form.createdAt)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="info"
                        component={RouterLink}
                        to={`/admin/forms/${form.id}`}
                        title="상세 보기"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        component={RouterLink}
                        to={`/admin/forms/edit/${form.id}`}
                        title="수정"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(form)}
                        title="삭제"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    {loading ? (
                      <CircularProgress size={30} />
                    ) : (
                      <Typography color="text.secondary">
                        지원 양식이 없습니다.
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
        <DialogTitle>지원 양식 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedForm && (
              <>
                <strong>{selectedForm.title}</strong> 양식을 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없으며, 관련된 모든 지원서 데이터도 삭제될 수 있습니다.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button 
            onClick={handleDeleteForm} 
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

export default FormsManagement;