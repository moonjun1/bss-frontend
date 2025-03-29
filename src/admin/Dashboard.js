// src/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Fade
} from '@mui/material';
import {
  PeopleOutline as PeopleIcon,
  ArticleOutlined as ArticleIcon,
  DescriptionOutlined as DescriptionIcon,
  AssignmentIndOutlined as AssignmentIcon
} from '@mui/icons-material';
import { adminAPI } from '../api';
import { motion } from 'framer-motion';

// 모의 데이터 - 백엔드 연결이 안될 때 사용
const mockData = {
  stats: {
    userCount: 24,
    postCount: 86,
    formCount: 5,
    applicationCount: 42,
    todayPostCount: 3,
    activeFormCount: 2,
    pendingApplicationCount: 7,
    lastRegisteredUser: '김연구원'
  },
  recentPosts: [
    {
      id: 1,
      title: '2025년 봄학기 BSS-Lab 연구원 모집 공고',
      username: '관리자',
      createdAt: '2025-03-15T14:30:00'
    },
    {
      id: 2,
      title: '인공지능 세미나 일정 안내',
      username: '김교수',
      createdAt: '2025-03-10T11:15:00'
    },
    {
      id: 3,
      title: '연구 성과 보고서 제출 안내',
      username: '이연구원',
      createdAt: '2025-03-05T09:45:00'
    },
    {
      id: 4,
      title: '신규 연구 프로젝트 참여자 모집',
      username: '박박사',
      createdAt: '2025-02-28T16:20:00'
    }
  ],
  recentApplications: [
    {
      id: 1,
      applicantName: '홍길동',
      applicationFormTitle: '2025년 봄학기 연구원 모집',
      status: 'SUBMITTED',
      submittedAt: '2025-03-20T10:30:00'
    },
    {
      id: 2,
      applicantName: '김민지',
      applicationFormTitle: '2025년 봄학기 연구원 모집',
      status: 'UNDER_REVIEW',
      submittedAt: '2025-03-19T14:45:00'
    },
    {
      id: 3,
      applicantName: '이준호',
      applicationFormTitle: '인턴십 프로그램',
      status: 'ACCEPTED',
      submittedAt: '2025-03-15T11:20:00'
    }
  ]
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [useMockData, setUseMockData] = useState(false);

  // 통계 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // 백엔드 API 연결 시도
        let backendConnected = false;
        let statsResponse, postsResponse, applicationsResponse;
        
        try {
          // 통계 데이터 가져오기
          statsResponse = await adminAPI.getStats();
          
          if (statsResponse.data?.status === 200 && statsResponse.data?.data) {
            setStats(statsResponse.data.data);
            backendConnected = true;
          }
          
          // 최근 게시글 가져오기
          postsResponse = await adminAPI.getAllPosts(0, 5);
          
          if (postsResponse.data?.status === 200 && postsResponse.data?.data) {
            setRecentPosts(postsResponse.data.data.content || []);
          }
          
          // 최근 지원서 가져오기
          applicationsResponse = await adminAPI.getApplications(0, 5);
          
          if (applicationsResponse.data?.status === 200 && applicationsResponse.data?.data) {
            setRecentApplications(applicationsResponse.data.data.content || []);
          }
        } catch (apiError) {
          console.log('API 연결 실패, 모의 데이터로 전환합니다:', apiError);
          backendConnected = false;
        }
        
        // 백엔드 연결 실패 시 모의 데이터 사용
        if (!backendConnected) {
          setUseMockData(true);
          setStats(mockData.stats);
          setRecentPosts(mockData.recentPosts);
          setRecentApplications(mockData.recentApplications);
          
          // 백엔드 연결 실패 안내 (개발용 메시지)
          console.log('백엔드 서버에 연결할 수 없어 모의 데이터를 표시합니다.');
        }
        
      } catch (err) {
        console.error('대시보드 데이터 로드 중 오류:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        
        // 오류 발생 시 모의 데이터 사용
        setUseMockData(true);
        setStats(mockData.stats);
        setRecentPosts(mockData.recentPosts);
        setRecentApplications(mockData.recentApplications);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  // 애니메이션 변수
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          대시보드
        </Typography>
        
        {error && (
          <Fade in={Boolean(error)}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </Fade>
        )}
        
        {useMockData && (
          <Fade in={useMockData}>
            <Alert severity="info" sx={{ mb: 3 }}>
              현재 모의 데이터를 표시하고 있습니다. 백엔드 서버가 연결되면 실제 데이터가 표시됩니다.
            </Alert>
          </Fade>
        )}
        
        {/* 통계 카드 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  height: '100%',
                  bgcolor: 'rgba(33, 150, 243, 0.1)',
                  border: '1px solid rgba(33, 150, 243, 0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                      {stats?.userCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      총 사용자
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  최근 가입: {stats?.lastRegisteredUser || '없음'}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  height: '100%',
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ArticleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                      {stats?.postCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      총 게시글
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  오늘 작성: {stats?.todayPostCount || 0}개
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  height: '100%',
                  bgcolor: 'rgba(156, 39, 176, 0.1)',
                  border: '1px solid rgba(156, 39, 176, 0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DescriptionIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                      {stats?.formCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      지원 양식
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  활성 양식: {stats?.activeFormCount || 0}개
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} sm={6} lg={3}>
            <motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  height: '100%',
                  bgcolor: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                      {stats?.applicationCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      지원서
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  검토 필요: {stats?.pendingApplicationCount || 0}개
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
        
        {/* 최근 활동 섹션 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    최근 게시글
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {recentPosts.length > 0 ? (
                    <List>
                      {recentPosts.map((post, index) => (
                        <React.Fragment key={post.id}>
                          <ListItem 
                            button 
                            sx={{
                              transition: 'background-color 0.3s',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                              }
                            }}
                          >
                            <ListItemText
                              primary={post.title}
                              secondary={
                                <>
                                  {post.username} · {formatDate(post.createdAt)}
                                </>
                              }
                              primaryTypographyProps={{
                                variant: 'subtitle1',
                                noWrap: true,
                                sx: { fontWeight: 500 }
                              }}
                            />
                          </ListItem>
                          {index < recentPosts.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                      최근 게시글이 없습니다.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card 
                sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    최근 지원서
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {recentApplications.length > 0 ? (
                    <List>
                      {recentApplications.map((application, index) => (
                        <React.Fragment key={application.id}>
                          <ListItem 
                            button
                            sx={{
                              transition: 'background-color 0.3s',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                              }
                            }}
                          >
                            <ListItemText
                              primary={`${application.applicantName} - ${application.applicationFormTitle}`}
                              secondary={
                                <>
                                  {application.status} · {formatDate(application.submittedAt)}
                                </>
                              }
                              primaryTypographyProps={{
                                variant: 'subtitle1',
                                noWrap: true,
                                sx: { fontWeight: 500 }
                              }}
                            />
                          </ListItem>
                          {index < recentApplications.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                      최근 지원서가 없습니다.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Dashboard;