// src/admin/ApplicationDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Card,
  CardContent,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Save as SaveIcon,
  FileCopy as FileCopyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { adminAPI } from '../api';

// 지원서 상태별 색상 및 라벨
const APPLICATION_STATUS = {
  'DRAFT': { color: 'default', label: '작성중', icon: <AssignmentIcon /> },
  'SUBMITTED': { color: 'info', label: '제출됨', icon: <FileCopyIcon /> },
  'UNDER_REVIEW': { color: 'warning', label: '검토중', icon: <DescriptionIcon /> },
  'ACCEPTED': { color: 'success', label: '합격', icon: <CheckCircleIcon /> },
  'REJECTED': { color: 'error', label: '불합격', icon: <CancelIcon /> },
  'CANCELLED': { color: 'default', label: '취소됨', icon: <CancelIcon /> }
};

// 질문 유형별 라벨
const QUESTION_TYPE_LABELS = {
  'SHORT_TEXT': '단답형',
  'LONG_TEXT': '장문형',
  'SINGLE_CHOICE': '단일 선택',
  'MULTIPLE_CHOICE': '다중 선택'
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 상태 관리
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [reviewerComment, setReviewerComment] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  
  // 지원서 상세 정보 로드
  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await adminAPI.getApplication(id);
        
        if (response.data?.status === 200 && response.data?.data) {
          const applicationData = response.data.data;
          setApplication(applicationData);
          setNewStatus(applicationData.status);
          setReviewerComment(applicationData.reviewerComment || '');
          
          // 지원 서류 가져오기 (문서가 별도 API에서 제공된다고 가정)
          try {
            const documentsResponse = await adminAPI.getApplicationDocuments(id);
            if (documentsResponse.data?.status === 200 && documentsResponse.data?.data) {
              setDocuments(documentsResponse.data.data || []);
            }
          } catch (docError) {
            console.error('지원 서류 로드 중 오류:', docError);
          }
        } else {
          setError('지원서를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('지원서 상세 로드 중 오류:', err);
        setError('지원서를 불러오는데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchApplicationDetail();
    }
  }, [id]);
  
  // 상태 변경 다이얼로그 핸들러
  const handleOpenStatusDialog = () => {
    setStatusDialogOpen(true);
  };
  
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };
  
  // 상태 변경 핸들러
  const handleChangeStatus = async () => {
    try {
      setStatusUpdateLoading(true);
      
      const response = await adminAPI.updateApplicationStatus(id, {
        status: newStatus,
        reviewerComment
      });
      
      if (response.data?.status === 200) {
        // 지원서 정보 갱신
        setApplication({
          ...application,
          status: newStatus,
          reviewerComment,
          reviewedAt: new Date().toISOString()
        });
      } else {
        setError('상태 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error('상태 변경 중 오류:', err);
      setError('상태 변경 중 오류가 발생했습니다.');
    } finally {
      setStatusUpdateLoading(false);
      handleCloseStatusDialog();
    }
  };
  
  // 삭제 다이얼로그 핸들러
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  // 지원서 삭제 핸들러
  const handleDeleteApplication = async () => {
    try {
      setLoading(true);
      
      const response = await adminAPI.deleteApplication(id);
      
      if (response.data?.status === 200) {
        navigate('/admin/applications', { replace: true });
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
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };
  
  if (loading && !application) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // 애니메이션 변수
  const contentVariants = {
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            component={RouterLink} 
            to="/admin/applications" 
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            지원서 상세
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
            color="error"
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
      
      {application && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { 
              transition: { 
                staggerChildren: 0.1 
              } 
            }
          }}
        >
          {/* 지원서 헤더 정보 */}
          <motion.div variants={contentVariants}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* 배경 애니메이션 효과 */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: 'linear-gradient(90deg, #1a237e 0%, #f50057 100%)'
                }}
              />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Typography variant="h5" component="h2">
                      {application.applicantName}
                    </Typography>
                    <Chip
                      icon={APPLICATION_STATUS[application.status]?.icon}
                      label={APPLICATION_STATUS[application.status]?.label || application.status}
                      color={APPLICATION_STATUS[application.status]?.color || 'default'}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {application.applicationFormTitle}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        <Link href={`mailto:${application.applicantEmail}`}>
                          {application.applicantEmail}
                        </Link>
                      </Typography>
                    </Box>
                    {application.applicantPhone && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <Link href={`tel:${application.applicantPhone}`}>
                            {application.applicantPhone}
                          </Link>
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    제출일
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(application.submittedAt)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    검토일
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(application.reviewedAt)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    검토자 코멘트
                  </Typography>
                  <Typography variant="body1">
                    {application.reviewerComment || '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
          
          <Grid container spacing={3}>
            {/* 지원 서류 섹션 */}
            <Grid item xs={12} md={4}>
              <motion.div variants={contentVariants}>
                <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      지원 서류
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {documents.length > 0 ? (
                      <List>
                        {documents.map((document) => (
                          <ListItem key={document.id} sx={{ px: 0 }}>
                            <ListItemText
                              primary={document.fileName || `${document.fileType} 파일`}
                              secondary={`${(document.fileSize / 1024).toFixed(1)} KB`}
                            />
                            <Tooltip title="다운로드">
                              <IconButton 
                                component="a" 
                                href={`/api/files/${document.fileUrl}`}
                                target="_blank"
                                download
                              >
                                <FileCopyIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        첨부된 서류가 없습니다.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            {/* 질문 및 답변 섹션 */}
            <Grid item xs={12} md={8}>
              <motion.div variants={contentVariants}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      질문 및 답변
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {application.answers && application.answers.length > 0 ? (
                      application.answers.map((answer, index) => (
                        <Accordion 
                          key={answer.id} 
                          sx={{ 
                            mb: 2, 
                            '&:before': { display: 'none' },
                            boxShadow: 'none',
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: '8px !important',
                            overflow: 'hidden'
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ 
                              bgcolor: 'rgba(0, 0, 0, 0.03)',
                              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
                            }}
                          >
                            <Typography variant="subtitle1">
                              {index + 1}. {answer.questionContent}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box sx={{ mb: 1 }}>
                              <Chip
                                label={QUESTION_TYPE_LABELS[answer.questionType] || answer.questionType}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            
                            {answer.questionType === 'SINGLE_CHOICE' || answer.questionType === 'MULTIPLE_CHOICE' ? (
                              <List dense disablePadding>
                                {answer.selectedOptions.map((option) => (
                                  <ListItem key={option.id} sx={{ px: 0 }}>
                                    <ListItemText primary={option.content} />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Typography
                                variant="body1"
                                sx={{
                                  p: 2,
                                  bgcolor: 'rgba(0, 0, 0, 0.02)',
                                  borderRadius: 1,
                                  whiteSpace: 'pre-wrap'
                                }}
                              >
                                {answer.textValue || '(응답 없음)'}
                              </Typography>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        답변이 없습니다.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
          
          {/* 상태 변경 다이얼로그 */}
          <Dialog
            open={statusDialogOpen}
            onClose={handleCloseStatusDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>지원서 상태 변경</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                지원서의 상태와 검토자 코멘트를 수정할 수 있습니다.
              </DialogContentText>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>상태</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="상태"
                >
                  <MenuItem value="SUBMITTED">제출됨</MenuItem>
                  <MenuItem value="UNDER_REVIEW">검토중</MenuItem>
                  <MenuItem value="ACCEPTED">합격</MenuItem>
                  <MenuItem value="REJECTED">불합격</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="검토자 코멘트"
                multiline
                rows={4}
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseStatusDialog}>취소</Button>
              <Button 
                onClick={handleChangeStatus} 
                variant="contained"
                disabled={statusUpdateLoading}
                startIcon={<SaveIcon />}
              >
                {statusUpdateLoading ? <CircularProgress size={24} /> : '저장'}
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* 삭제 확인 다이얼로그 */}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
          >
            <DialogTitle>지원서 삭제</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>{application.applicantName}</strong>님의 지원서를 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
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
        </motion.div>
      )}
    </Box>
  );
};

export default ApplicationDetail;