// src/pages/admin/FormDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  ShortText as ShortTextIcon,
  Subject as LongTextIcon,
  RadioButtonChecked as SingleChoiceIcon,
  CheckBox as MultipleChoiceIcon,
  RadioButtonUnchecked as RadioIcon,
  CheckBoxOutlineBlank as CheckboxIcon
} from '@mui/icons-material';
import { adminAPI } from '../api';

const FormDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsTotalCount, setApplicationsTotalCount] = useState(0);
  
  // 지원 양식 상세 정보 로드
  useEffect(() => {
    const fetchFormDetail = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await adminAPI.getForm(id);
        
        if (response.data?.status === 200 && response.data?.data) {
          setForm(response.data.data);
          setNewStatus(response.data.data.status);
        } else {
          setError('지원 양식을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('지원 양식 상세 로드 중 오류:', err);
        setError('지원 양식을 불러오는데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchFormDetail();
    }
  }, [id]);
  
  // 지원서 목록 로드
  useEffect(() => {
    if (tabValue === 1 && form) {
      fetchApplications();
    }
  }, [tabValue, form]);
  
  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      
      const response = await adminAPI.getApplicationsByForm(form.id);
      
      if (response.data?.status === 200 && response.data?.data) {
        setApplications(response.data.data.content || []);
        setApplicationsTotalCount(response.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error('지원서 목록 로드 중 오류:', err);
    } finally {
      setApplicationsLoading(false);
    }
  };
  
  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // 삭제 다이얼로그 핸들러
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  // 상태 변경 다이얼로그 핸들러
  const handleOpenStatusDialog = () => {
    setStatusDialogOpen(true);
  };
  
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };
  
  // 양식 삭제 핸들러
  const handleDeleteForm = async () => {
    try {
      setLoading(true);
      
      const response = await adminAPI.deleteForm(id);
      
      if (response.data?.status === 200) {
        navigate('/admin/forms', { replace: true });
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
  
  // 양식 상태 변경 핸들러
  const handleChangeStatus = async () => {
    try {
      setLoading(true);
      
      const response = await adminAPI.updateForm(id, { status: newStatus });
      
      if (response.data?.status === 200) {
        // 양식 정보 갱신
        const updatedForm = { ...form, status: newStatus };
        setForm(updatedForm);
      } else {
        setError('상태 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error('상태 변경 중 오류:', err);
      setError('상태 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      handleCloseStatusDialog();
    }
  };
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
  
  // 질문 유형 아이콘 반환
  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'SHORT_TEXT': return <ShortTextIcon />;
      case 'LONG_TEXT': return <LongTextIcon />;
      case 'SINGLE_CHOICE': return <SingleChoiceIcon />;
      case 'MULTIPLE_CHOICE': return <MultipleChoiceIcon />;
      default: return null;
    }
  };
  
  // 질문 유형 레이블 반환
  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'SHORT_TEXT': return '단답형';
      case 'LONG_TEXT': return '장문형';
      case 'SINGLE_CHOICE': return '단일 선택';
      case 'MULTIPLE_CHOICE': return '다중 선택';
      default: return type;
    }
  };
  
  // 지원서 상태 레이블 반환
  const getApplicationStatusLabel = (status) => {
    switch (status) {
      case 'DRAFT': return '작성중';
      case 'SUBMITTED': return '제출됨';
      case 'UNDER_REVIEW': return '검토중';
      case 'ACCEPTED': return '합격';
      case 'REJECTED': return '불합격';
      case 'CANCELLED': return '취소됨';
      default: return status;
    }
  };
  
  // 지원서 상태 색상 반환
  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'SUBMITTED': return 'info';
      case 'UNDER_REVIEW': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };
  
  if (loading && !form) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            component={RouterLink} 
            to="/admin/forms" 
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            지원 양식 상세
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            onClick={handleOpenStatusDialog}
            sx={{ mr: 1 }}
          >
            상태 변경
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink}
            to={`/admin/forms/edit/${id}`}
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleOpenDeleteDialog}
          >
            삭제
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {form && (
        <>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <Typography variant="h5" gutterBottom>
                  {form.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {form.description}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Chip
                    label={getStatusLabel(form.status)}
                    color={getStatusColor(form.status)}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  생성일
                </Typography>
                <Typography variant="body1">
                  {formatDate(form.createdAt)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  최종 수정일
                </Typography>
                <Typography variant="body1">
                  {formatDate(form.updatedAt)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  모집 시작일
                </Typography>
                <Typography variant="body1">
                  {formatDate(form.startDate)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  모집 종료일
                </Typography>
                <Typography variant="body1">
                  {formatDate(form.endDate)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2, pt: 2 }}>
              <Tab label="질문 목록" />
              <Tab label="지원서 목록" />
            </Tabs>
            
            <Divider />
            
            <Box sx={{ p: 3 }}>
              {tabValue === 0 ? (
                // 질문 목록 탭
                <>
                  {form.questions && form.questions.length > 0 ? (
                    form.questions.map((question, index) => (
                      <Card 
                        key={question.id} 
                        sx={{ 
                          mb: 2, 
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ mr: 1, color: 'primary.main' }}>
                                  {getQuestionTypeIcon(question.questionType)}
                                </Box>
                                <Typography variant="subtitle1" fontWeight={500}>
                                  {index + 1}. {question.content}
                                </Typography>
                                {question.required && (
                                  <Chip
                                    label="필수"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    sx={{ ml: 2 }}
                                  />
                                )}
                              </Box>
                              
                              {question.helpText && (
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ 
                                    ml: 4, 
                                    mb: 2,
                                    fontStyle: 'italic'
                                  }}
                                >
                                  {question.helpText}
                                </Typography>
                              )}
                            </Grid>
                            
                            {(question.questionType === 'SINGLE_CHOICE' || question.questionType === 'MULTIPLE_CHOICE') && (
                              <Grid item xs={12}>
                                <Box sx={{ ml: 4 }}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    옵션:
                                  </Typography>
                                  <List dense>
                                    {question.options.map((option, optIndex) => (
                                      <ListItem key={option.id}>
                                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                          {question.questionType === 'SINGLE_CHOICE' ? <RadioIcon fontSize="small" /> : <CheckboxIcon fontSize="small" />}
                                        </Box>
                                        <ListItemText primary={option.content} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                      질문이 없습니다.
                    </Typography>
                  )}
                </>
              ) : (
                // 지원서 목록 탭
                <>
                  {applicationsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : applications.length > 0 ? (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">
                          총 지원서: {applicationsTotalCount}개
                        </Typography>
                      </Box>
                      <List>
                        {applications.map((application) => (
                          <React.Fragment key={application.id}>
                            <ListItem 
                              button
                              component={RouterLink}
                              to={`/admin/applications/${application.id}`}
                            >
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle1">
                                    {application.applicantName} ({application.applicantEmail})
                                  </Typography>
                                }
                                secondary={
                                  <React.Fragment>
                                    <Typography variant="body2" color="text.secondary">
                                      제출일: {formatDate(application.submittedAt)}
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                              <ListItemSecondaryAction>
                                <Chip
                                  label={getApplicationStatusLabel(application.status)}
                                  color={getApplicationStatusColor(application.status)}
                                  size="small"
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <Divider component="li" />
                          </React.Fragment>
                        ))}
                      </List>
                    </>
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                      지원서가 없습니다.
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Paper>
          
          {/* 삭제 확인 다이얼로그 */}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
          >
            <DialogTitle>지원 양식 삭제</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>{form.title}</strong> 양식을 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없으며, 관련된 모든 지원서 데이터도 삭제될 수 있습니다.
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
          
          {/* 상태 변경 다이얼로그 */}
          <Dialog
            open={statusDialogOpen}
            onClose={handleCloseStatusDialog}
          >
            <DialogTitle>상태 변경</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                지원 양식의 상태를 변경합니다.
              </DialogContentText>
              <FormControl fullWidth>
                <InputLabel>상태</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="상태"
                >
                  <MenuItem value="DRAFT">임시저장</MenuItem>
                  <MenuItem value="PUBLISHED">모집중</MenuItem>
                  <MenuItem value="CLOSED">마감</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseStatusDialog}>취소</Button>
              <Button 
                onClick={handleChangeStatus} 
                color="primary" 
                variant="contained"
                disabled={loading || newStatus === form.status}
              >
                {loading ? <CircularProgress size={24} /> : '변경'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default FormDetail;