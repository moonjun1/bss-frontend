// src/admin/FormCreate.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  Switch,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Tooltip,
  Backdrop,
  Fade,
  Snackbar
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ShortText as ShortTextIcon,
  Subject as LongTextIcon,
  RadioButtonChecked as SingleChoiceIcon,
  CheckBox as MultipleChoiceIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { adminAPI } from '../api';

// 질문 유형 목록
const QUESTION_TYPES = [
  { value: 'SHORT_TEXT', label: '단답형', icon: <ShortTextIcon /> },
  { value: 'LONG_TEXT', label: '장문형', icon: <LongTextIcon /> },
  { value: 'SINGLE_CHOICE', label: '단일 선택', icon: <SingleChoiceIcon /> },
  { value: 'MULTIPLE_CHOICE', label: '다중 선택', icon: <MultipleChoiceIcon /> }
];

// 양식 상태 목록
const FORM_STATUS = [
  { value: 'DRAFT', label: '임시저장' },
  { value: 'PUBLISHED', label: '모집중' },
  { value: 'CLOSED', label: '마감' }
];

const FormCreate = () => {
  const navigate = useNavigate();
  
  // 양식 기본 정보
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'DRAFT',
    startDate: new Date().toISOString().substring(0, 16), // ISO 형식의 날짜+시간으로 변경
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().substring(0, 16)
  });
  
  // 질문 목록
  const [questions, setQuestions] = useState([]);
  
  // 현재 편집 중인 질문
  const [activeQuestion, setActiveQuestion] = useState(null);
  
  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [scrollToError, setScrollToError] = useState(null);
  
  // 스낵바 상태
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 스크롤 효과
  useEffect(() => {
    if (scrollToError) {
      const element = document.getElementById(scrollToError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          element.classList.add('highlight-error');
          setTimeout(() => {
            element.classList.remove('highlight-error');
          }, 2000);
        }, 100);
      }
      setScrollToError(null);
    }
  }, [scrollToError]);
  
  // 기본 정보 변경 핸들러
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 초기화
    if (error) setError('');
  };
  
  // 날짜 변경 핸들러
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 초기화
    if (error) setError('');
  };
  
  // 새 질문 추가
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(), // 임시 ID (저장 시 서버에서 실제 ID 부여)
      questionType: 'SHORT_TEXT',
      content: '',
      required: true,
      questionOrder: questions.length + 1,
      placeholder: '',
      helpText: '',
      options: []
    };
    
    setQuestions(prev => [...prev, newQuestion]);
    setActiveQuestion(newQuestion);
    
    // 스낵바 표시
    setSnackbar({
      open: true,
      message: '새 질문이 추가되었습니다. 내용을 입력해주세요.',
      severity: 'info'
    });
    
    // 새 질문으로 자동 스크롤
    setTimeout(() => {
      const element = document.getElementById(`question-${newQuestion.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };
  
  // 질문 선택
  const handleSelectQuestion = (question) => {
    setActiveQuestion(question);
    
    // 편집 영역으로 자동 스크롤 (모바일에서 유용)
    if (window.innerWidth < 960) {
      setTimeout(() => {
        const element = document.getElementById('question-editor');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };
  
  // 질문 삭제
  const handleDeleteQuestion = (questionId) => {
    // 삭제 전 질문 정보 저장
    const questionToDelete = questions.find(q => q.id === questionId);
    const questionIndex = questions.findIndex(q => q.id === questionId);
    
    setQuestions(prev => {
      const updatedQuestions = prev.filter(q => q.id !== questionId);
      // 순서 재정렬
      return updatedQuestions.map((q, index) => ({
        ...q,
        questionOrder: index + 1
      }));
    });
    
    if (activeQuestion && activeQuestion.id === questionId) {
      setActiveQuestion(null);
    }
    
    // 스낵바 표시
    setSnackbar({
      open: true,
      message: `${questionIndex + 1}번 질문이 삭제되었습니다.`,
      severity: 'info'
    });
  };
  
  // 질문 정보 변경
  const handleQuestionChange = (e) => {
    const { name, value, checked } = e.target;
    const updatedValue = name === 'required' ? checked : value;
    
    const updatedQuestion = {
      ...activeQuestion,
      [name]: updatedValue
    };
    
    setActiveQuestion(updatedQuestion);
    
    // 전체 질문 목록에서도 업데이트
    setQuestions(prev => 
      prev.map(q => q.id === activeQuestion.id ? updatedQuestion : q)
    );
    
    // 에러 메시지 초기화
    if (error) setError('');
  };
  
  // 질문 유형 변경
  const handleQuestionTypeChange = (e) => {
    const { value } = e.target;
    
    // 선택형 질문으로 변경되는 경우 기본 옵션 추가
    let options = activeQuestion.options;
    if ((value === 'SINGLE_CHOICE' || value === 'MULTIPLE_CHOICE') && options.length === 0) {
      options = [
        { id: Date.now(), content: '옵션 1', optionOrder: 1 },
        { id: Date.now() + 1, content: '옵션 2', optionOrder: 2 }
      ];
    }
    
    const updatedQuestion = {
      ...activeQuestion,
      questionType: value,
      options
    };
    
    setActiveQuestion(updatedQuestion);
    
    // 전체 질문 목록에서도 업데이트
    setQuestions(prev => 
      prev.map(q => q.id === activeQuestion.id ? updatedQuestion : q)
    );
    
    // 유형 변경 알림
    setSnackbar({
      open: true,
      message: `질문 유형이 ${QUESTION_TYPES.find(t => t.value === value)?.label || value}(으)로 변경되었습니다.`,
      severity: 'info'
    });
  };
  
  // 옵션 추가
  const handleAddOption = () => {
    if (!activeQuestion) return;
    
    const newOption = {
      id: Date.now(),
      content: `옵션 ${activeQuestion.options.length + 1}`,
      optionOrder: activeQuestion.options.length + 1
    };
    
    const updatedOptions = [...activeQuestion.options, newOption];
    const updatedQuestion = { ...activeQuestion, options: updatedOptions };
    
    setActiveQuestion(updatedQuestion);
    
    // 전체 질문 목록에서도 업데이트
    setQuestions(prev => 
      prev.map(q => q.id === activeQuestion.id ? updatedQuestion : q)
    );
  };
  
  // 옵션 변경
  const handleOptionChange = (optionId, value) => {
    if (!activeQuestion) return;
    
    const updatedOptions = activeQuestion.options.map(option => 
      option.id === optionId ? { ...option, content: value } : option
    );
    
    const updatedQuestion = { ...activeQuestion, options: updatedOptions };
    
    setActiveQuestion(updatedQuestion);
    
    // 전체 질문 목록에서도 업데이트
    setQuestions(prev => 
      prev.map(q => q.id === activeQuestion.id ? updatedQuestion : q)
    );
  };
  
  // 옵션 삭제
  const handleDeleteOption = (optionId) => {
    if (!activeQuestion) return;
    
    const updatedOptions = activeQuestion.options.filter(option => option.id !== optionId)
      .map((option, index) => ({ ...option, optionOrder: index + 1 }));
    
    const updatedQuestion = { ...activeQuestion, options: updatedOptions };
    
    setActiveQuestion(updatedQuestion);
    
    // 전체 질문 목록에서도 업데이트
    setQuestions(prev => 
      prev.map(q => q.id === activeQuestion.id ? updatedQuestion : q)
    );
  };
  
  // 질문 순서 변경
  const handleReorderQuestion = (questionId, direction) => {
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (
      (direction === 'up' && questionIndex === 0) || 
      (direction === 'down' && questionIndex === questions.length - 1)
    ) {
      return;
    }
    
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1;
    
    // 순서 변경
    [newQuestions[questionIndex], newQuestions[targetIndex]] = 
      [newQuestions[targetIndex], newQuestions[questionIndex]];
    
    // questionOrder 업데이트
    const updatedQuestions = newQuestions.map((q, index) => ({
      ...q,
      questionOrder: index + 1
    }));
    
    setQuestions(updatedQuestions);
    
    // activeQuestion도 업데이트
    if (activeQuestion) {
      const updatedActiveQuestion = updatedQuestions.find(q => q.id === activeQuestion.id);
      setActiveQuestion(updatedActiveQuestion);
    }
    
    // 스낵바 표시
    setSnackbar({
      open: true,
      message: `질문 순서가 변경되었습니다.`,
      severity: 'info'
    });
  };
  
  // 양식 저장
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 양식 데이터 유효성 검사
      if (!formData.title.trim()) {
        setError('제목을 입력해주세요.');
        setLoading(false);
        return;
      }
      
      if (formData.status === 'PUBLISHED' && (!formData.startDate || !formData.endDate)) {
        setError('모집 기간을 설정해주세요.');
        setLoading(false);
        return;
      }
      
      if (formData.endDate < formData.startDate) {
        setError('종료일은 시작일보다 늦어야 합니다.');
        setLoading(false);
        return;
      }
      
      // 질문이 없는 경우
      if (questions.length === 0) {
        setError('최소 1개 이상의 질문을 추가해주세요.');
        setLoading(false);
        return;
      }
      
      // 질문 유효성 검사
      for (const question of questions) {
        if (!question.content.trim()) {
          const questionIndex = questions.findIndex(q => q.id === question.id) + 1;
          setError(`${questionIndex}번 질문에 내용을 입력해주세요.`);
          setScrollToError(`question-${question.id}`);
          setLoading(false);
          return;
        }
        
        if ((question.questionType === 'SINGLE_CHOICE' || question.questionType === 'MULTIPLE_CHOICE')) {
          if (question.options.length < 2) {
            const questionIndex = questions.findIndex(q => q.id === question.id) + 1;
            setError(`${questionIndex}번 질문은 최소 2개 이상의 옵션이 필요합니다.`);
            setScrollToError(`question-${question.id}`);
            setLoading(false);
            return;
          }
          
          // 옵션 내용 검사
          for (const option of question.options) {
            if (!option.content.trim()) {
              const questionIndex = questions.findIndex(q => q.id === question.id) + 1;
              const optionIndex = question.options.findIndex(o => o.id === option.id) + 1;
              setError(`${questionIndex}번 질문의 ${optionIndex}번 옵션에 내용을 입력해주세요.`);
              setScrollToError(`question-${question.id}`);
              setLoading(false);
              return;
            }
          }
        }
      }
      
      // API 요청 데이터 구성
      const requestData = {
        ...formData,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        questions: questions.map(q => ({
          questionType: q.questionType,
          content: q.content,
          required: q.required,
          questionOrder: q.questionOrder,
          placeholder: q.placeholder || null,
          helpText: q.helpText || null,
          options: q.options.map((opt, index) => ({
            content: opt.content,
            optionOrder: index + 1
          }))
        }))
      };
      
      // 양식 생성 API 호출
      const response = await adminAPI.createForm(requestData);
      
      if (response.data?.status === 201 && response.data?.data) {
        setSuccess(true);
        
        // 성공 메시지 표시
        setSnackbar({
          open: true,
          message: '양식이 성공적으로 저장되었습니다. 잠시 후 목록 페이지로 이동합니다.',
          severity: 'success'
        });
        
        // 3초 후 목록 페이지로 이동
        setTimeout(() => {
          navigate('/admin/forms');
        }, 3000);
      } else {
        setError(response.data?.message || '양식 저장에 실패했습니다.');
        
        // 에러 메시지 표시
        setSnackbar({
          open: true,
          message: response.data?.message || '양식 저장에 실패했습니다.',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('양식 저장 중 오류:', err);
      setError(err.response?.data?.message || '양식 저장 중 오류가 발생했습니다.');
      
      // 에러 메시지 표시
      setSnackbar({
        open: true,
        message: err.response?.data?.message || '양식 저장 중 오류가 발생했습니다.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 스낵바 닫기 핸들러
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box>
        <motion.div variants={itemVariants}>
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
                새 지원 양식 작성
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: '0 4px 10px rgba(26, 35, 126, 0.2)',
                '&:hover': {
                  boxShadow: '0 6px 15px rgba(26, 35, 126, 0.3)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : '저장'}
            </Button>
          </Box>
        </motion.div>
        
        {error && (
          <Fade in={Boolean(error)}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                animation: scrollToError ? 'pulse 1.5s' : 'none'
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}
        
        {success && (
          <Fade in={success}>
            <Alert severity="success" sx={{ mb: 3 }}>
              양식이 성공적으로 저장되었습니다. 잠시 후 목록 페이지로 이동합니다.
            </Alert>
          </Fade>
        )}
        
        <Grid container spacing={3}>
          {/* 왼쪽: 양식 기본 정보 및 질문 목록 */}
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)', 
                  mb: 3,
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>
                  기본 정보
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="제목"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                      placeholder="예: 2025년 연구원 모집"
                      sx={{ 
                        '.MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="설명"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      multiline
                      rows={3}
                      placeholder="양식에 대한 설명을 입력하세요"
                      sx={{ 
                        '.MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>상태</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        label="상태"
                        sx={{ 
                          '.MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      >
                        {FORM_STATUS.map(status => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {formData.status !== 'DRAFT' && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="시작일"
                          name="startDate"
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={handleDateChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{ 
                            '.MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="종료일"
                          name="endDate"
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={handleDateChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{ 
                            '.MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    질문 목록
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddQuestion}
                    sx={{
                      borderRadius: 1.5,
                    }}
                  >
                    질문 추가
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ maxHeight: '70vh', overflow: 'auto', pr: 1 }}>
                  {questions.length > 0 ? (
                    questions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        id={`question-${question.id}`}
                      >
                        <Card
                          sx={{
                            mb: 2,
                            borderRadius: 2,
                            border: activeQuestion?.id === question.id ? '2px solid #1a237e' : '1px solid #e0e0e0',
                            boxShadow: activeQuestion?.id === question.id 
                              ? '0 4px 12px rgba(26, 35, 126, 0.2)' 
                              : '0 2px 8px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              transform: 'translateY(-2px)'
                            },
                            '&.highlight-error': {
                              border: '2px solid #f44336',
                              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)',
                              animation: 'pulse 1.5s'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ mr: 1, display: 'flex', flexDirection: 'column' }}>
                                <Tooltip title="위로 이동">
                                  <span>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleReorderQuestion(question.id, 'up')}
                                      disabled={index === 0}
                                      sx={{
                                        backgroundColor: index === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
                                        '&:hover': {
                                          backgroundColor: 'rgba(0, 0, 0, 0.08)'
                                        }
                                      }}
                                    >
                                      <ArrowUpIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="아래로 이동">
                                  <span>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleReorderQuestion(question.id, 'down')}
                                      disabled={index === questions.length - 1}
                                      sx={{
                                        mt: 0.5,
                                        backgroundColor: index === questions.length - 1 ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
                                        '&:hover': {
                                          backgroundColor: 'rgba(0, 0, 0, 0.08)'
                                        }
                                      }}
                                    >
                                      <ArrowDownIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                {QUESTION_TYPES.find(t => t.value === question.questionType)?.icon}
                              </Box>
                              <Typography
                                variant="body1"
                                sx={{
                                  flexGrow: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {index + 1}. {question.content || 
                                  <span style={{ color: '#757575', fontStyle: 'italic' }}>
                                    {`[${QUESTION_TYPES.find(t => t.value === question.questionType)?.label || '질문'}]`}
                                  </span>
                                }
                              </Typography>
                              <Tooltip title="질문 삭제">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                  sx={{
                                    backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(244, 67, 54, 0.15)'
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ pt: 0, justifyContent: 'flex-end' }}>
                            <Button 
                              size="small" 
                              onClick={() => handleSelectQuestion(question)}
                              color="primary"
                              sx={{ fontWeight: 500 }}
                            >
                              편집
                            </Button>
                          </CardActions>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <Box sx={{ 
                      p: 4, 
                      textAlign: 'center', 
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 2,
                      border: '1px dashed rgba(0, 0, 0, 0.2)'
                    }}>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        아직 질문이 없습니다.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddQuestion}
                        sx={{ borderRadius: 2 }}
                      >
                        첫 질문 추가하기
                      </Button>
                    </Box>
                  )}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
          
          {/* 오른쪽: 질문 편집 영역 */}
          <Grid item xs={12} md={8} id="question-editor">
            <motion.div variants={itemVariants}>
              {activeQuestion ? (
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    질문 편집
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="질문 내용"
                        name="content"
                        value={activeQuestion.content}
                        onChange={handleQuestionChange}
                        required
                        placeholder="예: 지원 동기를 작성해주세요"
                        error={!activeQuestion.content.trim()}
                        helperText={!activeQuestion.content.trim() ? "질문 내용을 입력해주세요" : ""}
                        sx={{ 
                          '.MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth>
                        <InputLabel>질문 유형</InputLabel>
                        <Select
                          name="questionType"
                          value={activeQuestion.questionType}
                          onChange={handleQuestionTypeChange}
                          label="질문 유형"
                          sx={{ 
                            '.MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        >
                          {QUESTION_TYPES.map(type => (
                            <MenuItem key={type.value} value={type.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ mr: 1 }}>{type.icon}</Box>
                                {type.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="required"
                            checked={activeQuestion.required}
                            onChange={handleQuestionChange}
                            color="primary"
                          />
                        }
                        label="필수 질문"
                      />
                    </Grid>
                    
                    {(activeQuestion.questionType === 'SHORT_TEXT' || activeQuestion.questionType === 'LONG_TEXT') && (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="입력 힌트(Placeholder)"
                            name="placeholder"
                            value={activeQuestion.placeholder || ''}
                            onChange={handleQuestionChange}
                            placeholder="예: 최대 500자 이내로 작성해주세요"
                            sx={{ 
                              '.MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                        </Grid>
                      </>
                    )}
                    
                    {(activeQuestion.questionType === 'SINGLE_CHOICE' || activeQuestion.questionType === 'MULTIPLE_CHOICE') && (
                      <Grid item xs={12}>
                        <Box 
                          sx={{ 
                            mb: 2, 
                            p: 2, 
                            bgcolor: 'rgba(0, 0, 0, 0.02)', 
                            borderRadius: 2,
                            border: activeQuestion.options.length < 2 ? '1px solid rgba(244, 67, 54, 0.5)' : '1px solid rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                            옵션
                            {activeQuestion.options.length < 2 && (
                              <Typography component="span" color="error" sx={{ ml: 1, fontSize: '0.875rem' }}>
                                (최소 2개 이상 필요)
                              </Typography>
                            )}
                          </Typography>
                          
                          {activeQuestion.options.map((option, index) => (
                            <motion.div
                              key={option.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Box 
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  mb: 1 
                                }}
                              >
                                <Box sx={{ 
                                  mr: 2, 
                                  width: 24, 
                                  height: 24, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  borderRadius: '50%',
                                  bgcolor: 'rgba(0, 0, 0, 0.08)',
                                  color: 'text.secondary',
                                  fontWeight: 500
                                }}>
                                  {index + 1}
                                </Box>
                                <TextField
                                  fullWidth
                                  value={option.content}
                                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  error={!option.content.trim()}
                                  placeholder={`옵션 ${index + 1} 내용`}
                                  sx={{ 
                                    mr: 1,
                                    '.MuiOutlinedInput-root': {
                                      borderRadius: 1.5
                                    }
                                  }}
                                />
                                <Tooltip title="옵션 삭제">
                                  <span>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteOption(option.id)}
                                      disabled={activeQuestion.options.length <= 2}
                                      sx={{
                                        bgcolor: 'rgba(244, 67, 54, 0.08)',
                                        '&:hover': {
                                          bgcolor: 'rgba(244, 67, 54, 0.15)',
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </Box>
                            </motion.div>
                          ))}
                          
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={handleAddOption}
                              sx={{ borderRadius: 1.5 }}
                            >
                              옵션 추가
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="도움말"
                        name="helpText"
                        value={activeQuestion.helpText || ''}
                        onChange={handleQuestionChange}
                        placeholder="예: 구체적인 경험과 역량을 중심으로 작성해주세요"
                        helperText="질문에 대한 추가 설명이 필요한 경우 입력하세요."
                        sx={{ 
                          '.MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ) : (
                <Paper 
                  sx={{ 
                    p: 5, 
                    borderRadius: 2, 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 400,
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom align="center">
                    질문을 선택하거나 새 질문을 추가하세요
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph align="center" sx={{ maxWidth: 500, mb: 3 }}>
                    왼쪽 질문 목록에서 질문을 선택하여 편집하거나, 아래 버튼을 클릭하여 새 질문을 추가하세요.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddQuestion}
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      px: 3,
                      py: 1
                    }}
                  >
                    질문 추가
                  </Button>
                </Paper>
              )}
            </motion.div>
          </Grid>
        </Grid>
        
        {/* 로딩 백드롭 */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        
        {/* 스낵바 알림 */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
      
      {/* 스타일 정의 */}
      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
          100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
        }
        
        .highlight-error {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default FormCreate;