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
  Alert
} from '@mui/material';
import {
  PeopleOutline as PeopleIcon,
  ArticleOutlined as ArticleIcon,
  DescriptionOutlined as DescriptionIcon,
  AssignmentIndOutlined as AssignmentIcon
} from '@mui/icons-material';
import { adminAPI } from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  // 통계 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // 통계 데이터 가져오기
        const statsResponse = await adminAPI.getStats();
        
        if (statsResponse.data?.status === 200 && statsResponse.data?.data) {
          setStats(statsResponse.data.data);
        } else {
          console.error('통계 데이터를 가져오는데 실패했습니다.');
        }
        
        // 최근 게시글 가져오기
        const postsResponse = await adminAPI.getAllPosts(0, 5);
        
        if (postsResponse.data?.status === 200 && postsResponse.data?.data) {
          setRecentPosts(postsResponse.data.data.content || []);
        }
        
        // 최근 지원서 가져오기
        const applicationsResponse = await adminAPI.getApplications(0, 5);
        
        if (applicationsResponse.data?.status === 200 && applicationsResponse.data?.data) {
          setRecentApplications(applicationsResponse.data.data.content || []);
        }
      } catch (err) {
        console.error('대시보드 데이터 로드 중 오류:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        대시보드
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              height: '100%',
              bgcolor: 'rgba(33, 150, 243, 0.1)',
              border: '1px solid rgba(33, 150, 243, 0.2)',
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
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              height: '100%',
              bgcolor: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
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
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              height: '100%',
              bgcolor: 'rgba(156, 39, 176, 0.1)',
              border: '1px solid rgba(156, 39, 176, 0.2)',
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
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              height: '100%',
              bgcolor: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.2)',
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
        </Grid>
      </Grid>
      
      {/* 최근 활동 섹션 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                최근 게시글
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {recentPosts.length > 0 ? (
                <List>
                  {recentPosts.map((post, index) => (
                    <React.Fragment key={post.id}>
                      <ListItem>
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
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                최근 지원서
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {recentApplications.length > 0 ? (
                <List>
                  {recentApplications.map((application, index) => (
                    <React.Fragment key={application.id}>
                      <ListItem>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;