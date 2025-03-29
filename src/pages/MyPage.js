// src/pages/MyPage.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  TextField,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Article as ArticleIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import { authAPI, postAPI, applicationAPI } from '../api';

// 탭 패널 컴포넌트
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mypage-tabpanel-${index}`}
      aria-labelledby={`mypage-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MyPage = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    bio: ''
  });
  
  // 게시글 및 지원서 데이터
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  
  // 삭제 다이얼로그 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState('');
  const [deleteItemId, setDeleteItemId] = useState(null);
  
  // 프로필 이미지 업로드 상태
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  
  // 초기 데이터 로드
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // 사용자 정보 가져오기
        const response = await authAPI.getCurrentUser();
        
        if (response.data?.status === 200 && response.data?.data) {
          const userData = response.data.data;
          setUser(userData);
          setUserProfile({
            username: userData.username || '',
            email: userData.email || '',
            bio: userData.bio || ''
          });
          
          // 프로필 이미지 URL 설정 (있는 경우)
          if (userData.profileImageUrl) {
            setProfileImageUrl(`/api/files/${userData.profileImageUrl}`);
          }
        } else {
          setError('사용자 정보를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('사용자 정보 로드 중 오류:', err);
        setError('사용자 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
        
        // 인증 오류 시 로그인 페이지로 리다이렉트
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  // 탭 변경에 따라 데이터 로드
  useEffect(() => {
    if (tabValue === 1) {
      fetchUserPosts();
    } else if (tabValue === 2) {
      fetchUserApplications();
    }
  }, [tabValue]);
  
  // 사용자 게시글 로드
  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      
      // API가 해당 기능을 지원하는지 확인 필요 (예시 구현)
      // 실제로는 스웨거 문서에 정의된 API를 사용해야 함
      const response = await postAPI.getPosts(0, 10); // 현재 사용자의 게시글만 필터링하는 API 필요
      
      if (response.data?.status === 200 && response.data?.data) {
        const allPosts = response.data.data.content || [];
        
        // 현재 사용자가 작성한 게시글만 필터링 (백엔드에서 처리하는 것이 더 좋음)
        const myPosts = allPosts.filter(post => {
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          return post.userId === userData.id;
        });
        
        setPosts(myPosts);
      } else {
        console.error('게시글을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('게시글 로드 중 오류:', err);
    } finally {
      setPostsLoading(false);
    }
  };
  
  // 사용자 지원서 로드
  const fetchUserApplications = async () => {
    try {
      setApplicationsLoading(true);
      
      const response = await applicationAPI.getMyApplications();
      
      if (response.data?.status === 200 && response.data?.data) {
        setApplications(response.data.data.content || []);
      } else {
        console.error('지원서를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('지원서 로드 중 오류:', err);
    } finally {
      setApplicationsLoading(false);
    }
  };
  
  // 프로필 수정 모드 토글
  const toggleEditMode = () => {
    if (editMode) {
      // 편집 취소 - 원래 값으로 복원
      setUserProfile({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || ''
      });
      setSelectedImage(null);
    }
    setEditMode(!editMode);
  };
  
  // 프로필 정보 변경 핸들러
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 프로필 이미지 변경 핸들러
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      
      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImageUrl(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  // 프로필 저장 핸들러
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // 프로필 정보 업데이트
      const response = await authAPI.updateProfile({
        bio: userProfile.bio
      });
      
      // 이미지 업로드 (이미지가 선택된 경우)
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        
        await authAPI.uploadProfileImage(formData);
      }
      
      if (response.data?.status === 200) {
        setSuccess('프로필이 성공적으로 업데이트되었습니다.');
        setEditMode(false);
        
        // 사용자 정보 다시 로드
        const updatedUser = await authAPI.getCurrentUser();
        if (updatedUser.data?.status === 200 && updatedUser.data?.data) {
          setUser(updatedUser.data.data);
        }
      } else {
        setError('프로필 업데이트에 실패했습니다.');
      }
    } catch (err) {
      console.error('프로필 업데이트 중 오류:', err);
      setError('프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = (type, id) => {
    setDeleteItemType(type);
    setDeleteItemId(id);
    setDeleteDialogOpen(true);
  };
  
  // 삭제 다이얼로그 닫기
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteItemType('');
    setDeleteItemId(null);
  };
  
  // 아이템 삭제 핸들러
  const handleDeleteItem = async () => {
    try {
      setLoading(true);
      
      if (deleteItemType === 'post' && deleteItemId) {
        // 게시글 삭제
        await postAPI.deletePost(deleteItemId);
        // 게시글 목록 새로고침
        fetchUserPosts();
      } else if (deleteItemType === 'application' && deleteItemId) {
        // 지원서 삭제
        await applicationAPI.deleteApplication(deleteItemId);
        // 지원서 목록 새로고침
        fetchUserApplications();
      }
      
      setSuccess(`${deleteItemType === 'post' ? '게시글' : '지원서'}이 성공적으로 삭제되었습니다.`);
    } catch (err) {
      console.error('삭제 중 오류:', err);
      setError('삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };
  
  // 지원서 상태에 따른 칩 색상 및 라벨
  const getApplicationStatusChip = (status) => {
    const statusMap = {
      'DRAFT': { color: 'default', label: '작성중' },
      'SUBMITTED': { color: 'info', label: '제출됨' },
      'UNDER_REVIEW': { color: 'warning', label: '검토중' },
      'ACCEPTED': { color: 'success', label: '합격' },
      'REJECTED': { color: 'error', label: '불합격' },
      'CANCELLED': { color: 'default', label: '취소됨' }
    };
    
    const config = statusMap[status] || { color: 'default', label: status };
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };
  
  // 애니메이션 변수
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5 
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5 
      }
    }
  };
  
  if (loading && !user) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }
  
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
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2
            }}
          >
            마이페이지
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8 }}>
            내 정보 관리 및 활동 내역 확인
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          
          <Grid container spacing={4}>
            {/* 왼쪽: 프로필 카드 */}
            <Grid item xs={12} md={4}>
              <motion.div variants={childVariants}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* 프로필 배경 */}
                  <Box
                    sx={{
                      height: 100,
                      bgcolor: 'primary.main',
                    }}
                  />
                  
                  {/* 프로필 내용 */}
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        position: 'relative',
                        mt: -8,
                        mb: 2,
                        display: 'inline-block'
                      }}
                    >
                      <Avatar
                        src={profileImageUrl}
                        sx={{
                          width: 120,
                          height: 120,
                          border: '4px solid white',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                          bgcolor: 'secondary.main'
                        }}
                      >
                        {user?.username?.charAt(0).toUpperCase() || <PersonIcon fontSize="large" />}
                      </Avatar>
                      
                      {/* 프로필 이미지 편집 버튼 */}
                      {editMode && (
                        <label htmlFor="profile-image-input">
                          <input
                            accept="image/*"
                            id="profile-image-input"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                          />
                          <IconButton
                            component="span"
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              bgcolor: 'white',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                              }
                            }}
                          >
                            <PhotoCameraIcon />
                          </IconButton>
                        </label>
                      )}
                    </Box>
                    
                    {editMode ? (
                      <Box component="form" sx={{ mt: 3 }}>
                        <TextField
                          fullWidth
                          name="username"
                          label="사용자명"
                          value={userProfile.username}
                          onChange={handleProfileChange}
                          disabled // 사용자명은 변경 불가능하게 설정
                          margin="normal"
                          variant="outlined"
                        />
                        
                        <TextField
                          fullWidth
                          name="email"
                          label="이메일"
                          value={userProfile.email}
                          onChange={handleProfileChange}
                          disabled // 이메일도 변경 불가능하게 설정
                          margin="normal"
                          variant="outlined"
                        />
                        
                        <TextField
                          fullWidth
                          name="bio"
                          label="자기소개"
                          value={userProfile.bio}
                          onChange={handleProfileChange}
                          margin="normal"
                          variant="outlined"
                          multiline
                          rows={4}
                          placeholder="자기소개를 입력하세요"
                        />
                        
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={toggleEditMode}
                          >
                            취소
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveProfile}
                            disabled={loading}
                          >
                            {loading ? <CircularProgress size={24} /> : '저장'}
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
                          {user?.username}
                        </Typography>
                        
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          {user?.email}
                        </Typography>
                        
                        <Chip
                          label={user?.role === 'ROLE_ADMIN' ? '관리자' : '일반 사용자'}
                          color={user?.role === 'ROLE_ADMIN' ? 'secondary' : 'primary'}
                          size="small"
                          sx={{ mt: 1, mb: 3 }}
                        />
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ mt: 2, textAlign: 'left' }}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            자기소개
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                            sx={{
                              minHeight: 80,
                              whiteSpace: 'pre-line'
                            }}
                          >
                            {user?.bio || '자기소개가 없습니다. 프로필을 편집하여 자기소개를 추가해보세요.'}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={toggleEditMode}
                          sx={{ mt: 2 }}
                        >
                          프로필 편집
                        </Button>
                      </>
                    )}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
            
            {/* 오른쪽: 탭 컨텐츠 */}
            <Grid item xs={12} md={8}>
              <motion.div variants={childVariants}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="마이페이지 탭"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                  >
                    <Tab
                      label="계정 정보"
                      id="mypage-tab-0"
                      aria-controls="mypage-tabpanel-0"
                      icon={<PersonIcon />}
                      iconPosition="start"
                    />
                    <Tab
                      label="내 게시글"
                      id="mypage-tab-1"
                      aria-controls="mypage-tabpanel-1"
                      icon={<ArticleIcon />}
                      iconPosition="start"
                    />
                    <Tab
                      label="지원 내역"
                      id="mypage-tab-2"
                      aria-controls="mypage-tabpanel-2"
                      icon={<DescriptionIcon />}
                      iconPosition="start"
                    />
                  </Tabs>
                  
                  {/* 계정 정보 탭 */}
                  <TabPanel value={tabValue} index={0}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        계정 기본 정보
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            사용자명
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {user?.username}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            이메일
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {user?.email}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            계정 유형
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {user?.role === 'ROLE_ADMIN' ? '관리자' : '일반 사용자'}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        계정 활동 정보
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            가입일
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {formatDate(user?.createdAt)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            최근 접속일
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {formatDate(user?.lastLoginAt || new Date())}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            계정 상태
                          </Typography>
                          <Chip
                            label={user?.status === 'ACTIVE' ? '활성화' : '비활성화'}
                            color={user?.status === 'ACTIVE' ? 'success' : 'error'}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 4 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          component={RouterLink}
                          to="/change-password"
                        >
                          비밀번호 변경
                        </Button>
                      </Box>
                    </Box>
                  </TabPanel>
                  
                  {/* 내 게시글 탭 */}
                  <TabPanel value={tabValue} index={1}>
                    {postsLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : posts.length > 0 ? (
                      <List>
                        {posts.map((post) => (
                          <React.Fragment key={post.id}>
                            <Card sx={{ mb: 2, borderRadius: 2 }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {post.title}
                                  </Typography>
                                  <Chip
                                    label={post.category}
                                    color={post.category === 'notice' ? 'secondary' : 'primary'}
                                    size="small"
                                  />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  작성일: {formatDate(post.createdAt)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  {post.content}
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Button
                                  size="small"
                                  component={RouterLink}
                                  to={`/board/${post.id}`}
                                  startIcon={<VisibilityIcon />}
                                >
                                  보기
                                </Button>
                                <Button
                                  size="small"
                                  component={RouterLink}
                                  to={`/board/edit/${post.id}`}
                                  startIcon={<EditIcon />}
                                >
                                  수정
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => handleOpenDeleteDialog('post', post.id)}
                                >
                                  삭제
                                </Button>
                              </CardActions>
                            </Card>
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          작성한 게시글이 없습니다.
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          component={RouterLink}
                          to="/board/create"
                          sx={{ mt: 2 }}
                        >
                          게시글 작성하기
                        </Button>
                      </Box>
                    )}
                  </TabPanel>
                  
                  {/* 지원 내역 탭 */}
                  <TabPanel value={tabValue} index={2}>
                    {applicationsLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : applications.length > 0 ? (
                      <List>
                        {applications.map((application) => (
                          <React.Fragment key={application.id}>
                            <Card sx={{ mb: 2, borderRadius: 2 }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {application.applicationFormTitle}
                                  </Typography>
                                  {getApplicationStatusChip(application.status)}
                                </Box>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                      지원자: {application.applicantName}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                      제출일: {formatDate(application.submittedAt)}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                              <CardActions>
                                <Button
                                  size="small"
                                  component={RouterLink}
                                  to={`/applications/${application.id}`}
                                  startIcon={<VisibilityIcon />}
                                >
                                  상세 보기
                                </Button>
                                {application.status === 'DRAFT' && (
                                  <Button
                                    size="small"
                                    component={RouterLink}
                                    to={`/applications/edit/${application.id}`}
                                    startIcon={<EditIcon />}
                                  >
                                    수정
                                  </Button>
                                )}
                                <Button
                                  size="small"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => handleOpenDeleteDialog('application', application.id)}
                                >
                                  삭제
                                </Button>
                              </CardActions>
                            </Card>
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          지원 내역이 없습니다.
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          component={RouterLink}
                          to="/apply"
                          sx={{ mt: 2 }}
                        >
                          지원하기
                        </Button>
                      </Box>
                    )}
                  </TabPanel>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
      
      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {deleteItemType === 'post' ? '게시글 삭제' : '지원서 삭제'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            정말 {deleteItemType === 'post' ? '이 게시글을' : '이 지원서를'} 삭제하시겠습니까?
            이 작업은 되돌릴 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>취소</Button>
          <Button 
            onClick={handleDeleteItem} 
            color="error" 
            variant="contained"
            autoFocus
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default MyPage;