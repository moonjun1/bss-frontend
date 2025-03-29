// src/admin/UsersManagement.js
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
  Avatar,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Tooltip,
  Fade,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Block as BlockIcon,
  LockOpen as LockOpenIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { adminAPI } from '../api';

// 사용자 상태별 색상 및 라벨
const USER_STATUS = {
  'ACTIVE': { color: 'success', label: '활성화' },
  'INACTIVE': { color: 'error', label: '비활성화' }
};

// 사용자 역할별 색상 및 라벨
const USER_ROLE = {
  'ROLE_ADMIN': { color: 'secondary', label: '관리자' },
  'ROLE_USER': { color: 'primary', label: '사용자' }
};

const UsersManagement = () => {
  // 상태 관리
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'ROLE_USER'
  });
  const [newUserErrors, setNewUserErrors] = useState({});
  const [newUserLoading, setNewUserLoading] = useState(false);
  
  // 메뉴 상태 관리
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuUser, setMenuUser] = useState(null);
  
  // 계정 상태 변경 다이얼로그
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusDialogUser, setStatusDialogUser] = useState(null);
  
  // 역할 변경 다이얼로그
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleDialogUser, setRoleDialogUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  
  // 사용자 목록 로드
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);
  
  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminAPI.getUsers(page, rowsPerPage);
      
      if (response.data?.status === 200 && response.data?.data) {
        setUsers(response.data.data.content || []);
        setTotalCount(response.data.data.totalElements || 0);
      } else {
        setError('사용자 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('사용자 로드 중 오류:', err);
      setError('사용자 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };
  
  // 검색 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      fetchUsers();
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // 검색 API는 이메일 또는 이름으로 검색한다고 가정
      const response = await adminAPI.searchUsers(searchTerm);
      
      if (response.data?.status === 200 && response.data?.data) {
        setUsers(response.data.data.content || []);
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
  
  // 삭제 다이얼로그 핸들러
  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };
  
  // 사용자 삭제 핸들러
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      
      const response = await adminAPI.deleteUser(selectedUser.id);
      
      if (response.data?.status === 200) {
        // 삭제 성공, 목록 다시 로드
        fetchUsers();
      } else {
        setError('사용자 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('사용자 삭제 중 오류:', err);
      setError('사용자 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };
  
  // 새로고침 핸들러
  const handleRefresh = () => {
    fetchUsers();
  };
  
  // 새 사용자 다이얼로그 핸들러
  const handleOpenNewUserDialog = () => {
    setNewUserDialogOpen(true);
    setNewUserData({
      username: '',
      email: '',
      password: '',
      role: 'ROLE_USER'
    });
    setNewUserErrors({});
  };
  
  const handleCloseNewUserDialog = () => {
    setNewUserDialogOpen(false);
  };
  
  // 새 사용자 입력 변경 핸들러
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 유효성 검사 오류 초기화
    if (newUserErrors[name]) {
      setNewUserErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // 새 사용자 생성 핸들러
  const handleCreateUser = async () => {
    // 간단한 유효성 검사
    const errors = {};
    
    if (!newUserData.username.trim()) {
      errors.username = '사용자명을 입력해주세요.';
    }
    
    if (!newUserData.email.trim()) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserData.email)) {
      errors.email = '유효한 이메일 주소를 입력해주세요.';
    }
    
    if (!newUserData.password.trim()) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (newUserData.password.length < 8) {
      errors.password = '비밀번호는 8자 이상이어야 합니다.';
    }
    
    if (Object.keys(errors).length > 0) {
      setNewUserErrors(errors);
      return;
    }
    
    try {
      setNewUserLoading(true);
      
      const response = await adminAPI.createUser(newUserData);
      
      if (response.data?.status === 201) {
        // 생성 성공, 목록 다시 로드
        fetchUsers();
        handleCloseNewUserDialog();
      } else {
        setNewUserErrors({
          general: response.data?.message || '사용자 생성에 실패했습니다.'
        });
      }
    } catch (err) {
      console.error('사용자 생성 중 오류:', err);
      setNewUserErrors({
        general: err.response?.data?.message || '사용자 생성 중 오류가 발생했습니다.'
      });
    } finally {
      setNewUserLoading(false);
    }
  };
  
  // 메뉴 핸들러
  const handleOpenMenu = (event, user) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuUser(user);
  };
  
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setMenuUser(null);
  };
  
  // 상태 변경 다이얼로그 핸들러
  const handleOpenStatusDialog = (user) => {
    setStatusDialogUser(user);
    setStatusDialogOpen(true);
    handleCloseMenu();
  };
  
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setStatusDialogUser(null);
  };
  
  // 사용자 상태 변경 핸들러
  const handleChangeUserStatus = async () => {
    if (!statusDialogUser) return;
    
    try {
      setLoading(true);
      
      const newStatus = statusDialogUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      const response = await adminAPI.updateUserStatus(statusDialogUser.id, {
        status: newStatus
      });
      
      if (response.data?.status === 200) {
        // 상태 변경 성공, 해당 사용자 정보 업데이트
        setUsers(prev => 
          prev.map(user => 
            user.id === statusDialogUser.id 
              ? { ...user, status: newStatus } 
              : user
          )
        );
      } else {
        setError('사용자 상태 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error('사용자 상태 변경 중 오류:', err);
      setError('사용자 상태 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      handleCloseStatusDialog();
    }
  };
  
  // 역할 변경 다이얼로그 핸들러
  const handleOpenRoleDialog = (user) => {
    setRoleDialogUser(user);
    setNewRole(user.role);
    setRoleDialogOpen(true);
    handleCloseMenu();
  };
  
  const handleCloseRoleDialog = () => {
    setRoleDialogOpen(false);
    setRoleDialogUser(null);
  };
  
  // 사용자 역할 변경 핸들러
  const handleChangeUserRole = async () => {
    if (!roleDialogUser || roleDialogUser.role === newRole) return;
    
    try {
      setLoading(true);
      
      const response = await adminAPI.updateUserRole(roleDialogUser.id, {
        role: newRole
      });
      
      if (response.data?.status === 200) {
        // 역할 변경 성공, 해당 사용자 정보 업데이트
        setUsers(prev => 
          prev.map(user => 
            user.id === roleDialogUser.id 
              ? { ...user, role: newRole } 
              : user
          )
        );
      } else {
        setError('사용자 역할 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error('사용자 역할 변경 중 오류:', err);
      setError('사용자 역할 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      handleCloseRoleDialog();
    }
  };
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
          사용자 관리
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
            startIcon={<PersonAddIcon />}
            onClick={handleOpenNewUserDialog}
          >
            사용자 추가
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
      
      {/* 검색 폼 */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSearch}>
          <TextField
            fullWidth
            placeholder="사용자명 또는 이메일로 검색"
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
      </Paper>
      
      {/* 사용자 목록 테이블 */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          mb: 2
        }}
      >
        {loading && users.length === 0 ? (
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
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>사용자</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>역할</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>상태</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>생성일</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>최종 수정일</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">관리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <motion.tr
                      key={user.id}
                      variants={rowVariants}
                      style={{ backgroundColor: 'inherit' }}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 2, 
                              bgcolor: user.role === 'ROLE_ADMIN' ? 'secondary.main' : 'primary.main' 
                            }}
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              {user.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={user.role === 'ROLE_ADMIN' ? <AdminIcon /> : <PersonIcon />}
                          label={USER_ROLE[user.role]?.label || user.role}
                          color={USER_ROLE[user.role]?.color || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={USER_STATUS[user.status]?.label || user.status}
                          color={USER_STATUS[user.status]?.color || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{formatDate(user.updatedAt)}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="상세 보기">
                          <IconButton
                            color="primary"
                            component={RouterLink}
                            to={`/admin/users/${user.id}`}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="수정">
                          <IconButton
                            color="primary"
                            component={RouterLink}
                            to={`/admin/users/edit/${user.id}`}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="더 보기">
                          <IconButton
                            onClick={(e) => handleOpenMenu(e, user)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
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
                          사용자가 없습니다.
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
      
      {/* 사용자 메뉴 */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        {menuUser && (
          <>
            <MenuItem onClick={() => handleOpenStatusDialog(menuUser)}>
              {menuUser.status === 'ACTIVE' ? (
                <>
                  <BlockIcon fontSize="small" sx={{ mr: 1 }} />
                  계정 비활성화
                </>
              ) : (
                <>
                  <LockOpenIcon fontSize="small" sx={{ mr: 1 }} />
                  계정 활성화
                </>
              )}
            </MenuItem>
            <MenuItem onClick={() => handleOpenRoleDialog(menuUser)}>
              <AdminIcon fontSize="small" sx={{ mr: 1 }} />
              역할 변경
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleOpenDeleteDialog(menuUser)} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              사용자 삭제
            </MenuItem>
          </>
        )}
      </Menu>
      
      {/* 새 사용자 생성 다이얼로그 */}
      <Dialog
        open={newUserDialogOpen}
        onClose={handleCloseNewUserDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>새 사용자 생성</DialogTitle>
        <DialogContent>
          {newUserErrors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {newUserErrors.general}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="사용자명"
            name="username"
            value={newUserData.username}
            onChange={handleNewUserChange}
            error={Boolean(newUserErrors.username)}
            helperText={newUserErrors.username}
            margin="normal"
            autoFocus
          />
          
          <TextField
            fullWidth
            label="이메일"
            name="email"
            type="email"
            value={newUserData.email}
            onChange={handleNewUserChange}
            error={Boolean(newUserErrors.email)}
            helperText={newUserErrors.email}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="비밀번호"
            name="password"
            type="password"
            value={newUserData.password}
            onChange={handleNewUserChange}
            error={Boolean(newUserErrors.password)}
            helperText={newUserErrors.password || '최소 8자 이상'}
            margin="normal"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={newUserData.role === 'ROLE_ADMIN'}
                onChange={(e) => setNewUserData(prev => ({
                  ...prev,
                  role: e.target.checked ? 'ROLE_ADMIN' : 'ROLE_USER'
                }))}
                color="secondary"
              />
            }
            label="관리자 권한 부여"
            sx={{ mt: 2 }}
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewUserDialog}>취소</Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            disabled={newUserLoading}
          >
            {newUserLoading ? <CircularProgress size={24} /> : '생성'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 상태 변경 확인 다이얼로그 */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleCloseStatusDialog}
      >
        <DialogTitle>계정 상태 변경</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {statusDialogUser && (
              statusDialogUser.status === 'ACTIVE' ? (
                <>
                  <strong>{statusDialogUser.username}</strong> 계정을 비활성화하시겠습니까?<br />
                  비활성화된 계정은 로그인할 수 없습니다.
                </>
              ) : (
                <>
                  <strong>{statusDialogUser.username}</strong> 계정을 활성화하시겠습니까?<br />
                  활성화된 계정은 로그인할 수 있습니다.
                </>
              )
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>취소</Button>
          <Button 
            onClick={handleChangeUserStatus} 
            variant="contained"
            color={statusDialogUser?.status === 'ACTIVE' ? 'error' : 'success'}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              statusDialogUser?.status === 'ACTIVE' ? '비활성화' : '활성화'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 역할 변경 다이얼로그 */}
      <Dialog
        open={roleDialogOpen}
        onClose={handleCloseRoleDialog}
      >
        <DialogTitle>사용자 역할 변경</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {roleDialogUser && (
              <>
                <strong>{roleDialogUser.username}</strong> 사용자의 역할을 변경합니다.
              </>
            )}
          </DialogContentText>
          
          {roleDialogUser && (
            <FormControlLabel
              control={
                <Switch
                  checked={newRole === 'ROLE_ADMIN'}
                  onChange={(e) => setNewRole(e.target.checked ? 'ROLE_ADMIN' : 'ROLE_USER')}
                  color="secondary"
                />
              }
              label={newRole === 'ROLE_ADMIN' ? '관리자' : '일반 사용자'}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog}>취소</Button>
          <Button 
            onClick={handleChangeUserRole} 
            variant="contained"
            disabled={loading || (roleDialogUser && roleDialogUser.role === newRole)}
          >
            {loading ? <CircularProgress size={24} /> : '변경'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>사용자 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedUser && (
              <>
                <strong>{selectedUser.username}</strong> 사용자를 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없으며, 해당 사용자와 관련된 모든 데이터가 삭제됩니다.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button 
            onClick={handleDeleteUser} 
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

export default UsersManagement;