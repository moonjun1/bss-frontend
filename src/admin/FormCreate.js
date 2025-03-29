// src/pages/admin/FormCreate.js
import React, { useState } from 'react';
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
  Backdrop
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ShortText as ShortTextIcon,
  Subject as LongTextIcon,
  RadioButtonChecked as SingleChoiceIcon,
  CheckBox as MultipleChoiceIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { adminAPI } from '../api';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import koLocale from 'date-fns/locale/ko';

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
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
  });
  
  // 질문 목록
  const [questions, setQuestions] = useState([]);
  
  // 현재 편집 중인 질문
  const [activeQuestion, setActiveQuestion] = useState(null);
  
  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // 기본 정보 변경 핸들러
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 날짜 변경 핸들러
  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
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
  };
  
  // 질문 선택
  const handleSelectQuestion = (question) => {
    setActiveQuestion(question);
  };
  
  // 질문 삭제
  const handleDeleteQuestion = (questionId) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    
    if (activeQuestion && activeQuestion.id === questionId) {
      setActiveQuestion(null);
    }
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
    
    const updatedOptions = activeQuestion.options.filter(option => option.id !== optionId);
    const updatedQuestion = { ...activeQuestion, options: updatedOptions };
    
    setActiveQuestion(updatedQuestion);
    
    // 전체 질문 목록에서도 업데이트
    setQuestions(prev => 
      prev.map(q => q.id === activeQuestion.id ? updatedQuestion : q)
    );
  };
  
  // 드래그 앤 드롭으로 질문 순서 변경
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // 순서 업데이트
    const updatedItems = items.map((item, index) => ({
      ...item,
      questionOrder: index + 1
    }));
    
    setQuestions(updatedItems);
  };
  
  // 양식 저장
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 양식 데이터 유효성 검사
      if (!formData.title.trim()) {
        setError('제목을 입력해주세요.');
        return;
      }
      
      if (formData.status === 'PUBLISHED' && (!formData.startDate || !formData.endDate)) {
        setError('모집 기간을 설정해주세요.');
        return;
      }
      
      if (formData.endDate < formData.startDate) {
        setError('종료일은시작일보다 늦어야 합니다.');
        return;
      }
      
      // 질문 유효성 검사
      for (const question of questions) {
        if (!question.content.trim()) {
          setError('모든 질문에 내용을 입력해주세요.');
          return;
        }
        
        if ((question.questionType === 'SINGLE_CHOICE' || question.questionType === 'MULTIPLE_CHOICE') && 
            question.options.length < 2) {
          setError('선택형 질문은 최소 2개 이상의 옵션이 필요합니다.');
          return;
        }
      }
      
      // API 요청 데이터 구성
      const requestData = {
        ...formData,
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
        
        // 3초 후 목록 페이지로 이동
        setTimeout(() => {
          navigate('/admin/forms');
        }, 3000);
      } else {
        setError(response.data?.message || '양식 저장에 실패했습니다.');
      }
    } catch (err) {
      console.error('양식 저장 중 오류:', err);
      setError(err.response?.data?.message || '양식 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={koLocale}>
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
              새 지원 양식 작성
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '저장'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            양식이 성공적으로 저장되었습니다. 잠시 후 목록 페이지로 이동합니다.
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* 왼쪽: 양식 기본 정보 및 질문 목록 */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', mb: 3 }}>
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
                      <DateTimePicker
                        label="시작일"
                        value={formData.startDate}
                        onChange={(newValue) => handleDateChange('startDate', newValue)}
                        slotProps={{
                          textField: { fullWidth: true }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DateTimePicker
                        label="종료일"
                        value={formData.endDate}
                        onChange={(newValue) => handleDateChange('endDate', newValue)}
                        slotProps={{
                          textField: { fullWidth: true }
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  질문 목록
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddQuestion}
                >
                  질문 추가
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {questions.length > 0 ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="questions">
                    {(provided) => (
                      <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {questions.map((question, index) => (
                          <Draggable key={question.id} draggableId={question.id.toString()} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                sx={{
                                  mb: 2,
                                  borderRadius: 1,
                                  border: activeQuestion?.id === question.id ? '2px solid #1a237e' : '1px solid #e0e0e0',
                                }}
                              >
                                <CardContent sx={{ p: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box {...provided.dragHandleProps} sx={{ mr: 1, cursor: 'grab' }}>
                                      <DragIcon />
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
                                      {question.content || `[${QUESTION_TYPES.find(t => t.value === question.questionType)?.label || '질문'}]`}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </CardContent>
                                <CardActions sx={{ pt: 0 }}>
                                  <Button 
                                    size="small" 
                                    onClick={() => handleSelectQuestion(question)}
                                    sx={{ ml: 'auto' }}
                                  >
                                    편집
                                  </Button>
                                </CardActions>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                  질문이 없습니다. 질문을 추가해주세요.
                </Typography>
              )}
            </Paper>
          </Grid>
          
          {/* 오른쪽: 질문 편집 영역 */}
          <Grid item xs={12} md={8}>
            {activeQuestion ? (
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
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
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="도움말"
                          name="helpText"
                          value={activeQuestion.helpText || ''}
                          onChange={handleQuestionChange}
                        />
                      </Grid>
                    </>
                  )}
                  
                  {(activeQuestion.questionType === 'SINGLE_CHOICE' || activeQuestion.questionType === 'MULTIPLE_CHOICE') && (
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          옵션
                        </Typography>
                        {activeQuestion.options.map((option, index) => (
                          <Box 
                            key={option.id} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mb: 1 
                            }}
                          >
                            <Typography variant="body2" sx={{ mr: 2, width: 20 }}>
                              {index + 1}
                            </Typography>
                            <TextField
                              fullWidth
                              value={option.content}
                              onChange={(e) => handleOptionChange(option.id, e.target.value)}
                              variant="outlined"
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteOption(option.id)}
                              disabled={activeQuestion.options.length <= 2}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddOption}
                      >
                        옵션 추가
                      </Button>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="도움말"
                      name="helpText"
                      value={activeQuestion.helpText || ''}
                      onChange={handleQuestionChange}
                      helperText="질문에 대한 추가 설명이 필요한 경우 입력하세요."
                    />
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <Paper 
                sx={{ 
                  p: 3, 
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
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  질문을 선택하거나 새 질문을 추가하세요
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddQuestion}
                  sx={{ mt: 2 }}
                >
                  질문 추가
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
        
        {/* 로딩 백드롭 */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </LocalizationProvider>
  );
};

export default FormCreate;