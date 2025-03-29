// src/pages/ApplicationPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Radio,
  RadioGroup,
  Checkbox,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { applicationAPI } from '../api';
import { styled } from '@mui/material/styles';

// 파일 업로드를 위한 스타일드 컴포넌트
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// 지원 단계
const steps = ['지원 양식 선택', '개인 정보 입력', '지원서 작성', '제출 완료'];

const ApplicationPage = () => {
  const [activeForms, setActiveForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [formDetail, setFormDetail] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  
  // 개인 정보 및 지원서 데이터
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: ''
    },
    answers: {}
  });
  
  // 활성화된 지원 양식 목록 불러오기
  useEffect(() => {
    const fetchActiveForms = async () => {
      try {
        setLoading(true);
        const response = await applicationAPI.getActiveForms();
        
        if (response.data?.status === 200 && response.data?.data) {
          setActiveForms(response.data.data);
        } else {
          setError('지원 양식을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('지원 양식 로드 중 오류 발생:', err);
        setError('지원 양식을 불러오는데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveForms();
  }, []);
  
  // 선택한 양식의 상세 정보 불러오기
  useEffect(() => {
    if (selectedFormId) {
      const fetchFormDetail = async () => {
        try {
          setLoading(true);
          const response = await applicationAPI.getForm(selectedFormId);
          
          if (response.data?.status === 200 && response.data?.data) {
            setFormDetail(response.data.data);
            
            // 답변 초기화 (모든 질문에 대해 빈 답변으로)
            const initialAnswers = {};
            response.data.data.questions.forEach(question => {
              if (question.questionType === 'SINGLE_CHOICE' || question.questionType === 'MULTIPLE_CHOICE') {
                initialAnswers[question.id] = question.questionType === 'SINGLE_CHOICE' ? '' : [];
              } else {
                initialAnswers[question.id] = '';
              }
            });
            
            setFormData(prev => ({
              ...prev,
              answers: initialAnswers
            }));
          } else {
            setError('지원 양식 상세 정보를 불러오는데 실패했습니다.');
          }
        } catch (err) {
          console.error('지원 양식 상세 로드 중 오류 발생:', err);
          setError('지원 양식 상세 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchFormDetail();
    }
  }, [selectedFormId]);
  
  // 개인 정보 입력 변경 핸들러
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };
  
  // 답변 변경 핸들러
  const handleAnswerChange = (questionId, value, questionType) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value
      }
    }));
  };
  
  // 다음 단계로 이동
  const handleNext = () => {
    // 현재 단계에 대한 유효성 검사
    let isValid = true;
    let errorMessage = '';
    
    if (activeStep === 0 && !selectedFormId) {
      isValid = false;
      errorMessage = '지원할 양식을 선택해주세요.';
    }
    else if (activeStep === 1) {
      // 개인 정보 검증
      const { name, email, phone } = formData.personalInfo;
      if (!name.trim()) {
        isValid = false;
        errorMessage = '이름을 입력해주세요.';
      }
      else if (!email.trim()) {
        isValid = false;
        errorMessage = '이메일을 입력해주세요.';
      }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        isValid = false;
        errorMessage = '유효한 이메일 주소를 입력해주세요.';
      }
      else if (!phone.trim()) {
        isValid = false;
        errorMessage = '전화번호를 입력해주세요.';
      }
    }
    else if (activeStep === 2 && formDetail) {
      // 필수 질문에 대한 답변 검증
      const requiredQuestions = formDetail.questions.filter(q => q.required);
      
      for (const question of requiredQuestions) {
        const answer = formData.answers[question.id];
        
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          isValid = false;
          errorMessage = `"${question.content}" 질문에 답변해주세요.`;
          break;
        }
      }
    }
    
    if (!isValid) {
      setError(errorMessage);
      return;
    }
    
    // 에러 초기화 및 다음 단계로 이동
    setError('');
    
    // 마지막 단계에서는 제출 진행
    if (activeStep === 2) {
      handleSubmit();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };
  
  // 이전 단계로 이동
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // 지원서 제출 처리
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 제출할 데이터 준비
      const applicationData = {
        applicationFormId: selectedFormId,
        applicantName: formData.personalInfo.name,
        applicantEmail: formData.personalInfo.email,
        applicantPhone: formData.personalInfo.phone,
        status: 'SUBMITTED',
        answers: Object.entries(formData.answers).map(([questionId, value]) => {
          // 질문 타입 찾기
          const question = formDetail.questions.find(q => q.id === parseInt(questionId));
          
          if (question.questionType === 'SINGLE_CHOICE') {
            return {
              questionId: parseInt(questionId),
              selectedOptionIds: [value]
            };
          } else if (question.questionType === 'MULTIPLE_CHOICE') {
            return {
              questionId: parseInt(questionId),
              selectedOptionIds: value
            };
          } else {
            return {
              questionId: parseInt(questionId),
              textValue: value
            };
          }
        })
      };
      
      // 비로그인 사용자 지원서 제출 API 호출
      const response = await applicationAPI.submitGuestApplication(applicationData);
      
      // 응답 처리를 위한 console.log 추가 (디버깅용)
      console.log("지원서 제출 응답:", response);
      
      // 응답이 있고 데이터가 있는 경우 - 더 유연하게 처리하도록 수정
      if (response && response.data) {
        // status가 201이거나 200인 경우
        if ([200, 201].includes(response.data.status)) {
          // 응답에 data 필드가 있으면 해당 값을, 없으면 임시 ID 사용
          const applicationId = response.data.data || 'temp-' + Date.now();
          setSubmissionId(applicationId);
          setSuccess(true);
          
          // 제출 완료 단계로 이동
          setActiveStep(3);
        } else {
          // 서버에서 오류 응답을 받은 경우
          setError(response.data.message || '지원서 제출에 실패했습니다.');
        }
      } else {
        // 응답이 없거나 응답 형식이 이상한 경우
        setError('지원서 제출 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('지원서 제출 중 오류 발생:', err);
      
      // API 응답 로그 (디버깅용)
      if (err.response) {
        console.error('에러 응답:', err.response);
      }
      
      setError(
        err.response?.data?.message || 
        '지원서 제출 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // 처음으로 돌아가기 (새 지원서 작성)
  const handleReset = () => {
    setActiveStep(0);
    setSelectedFormId(null);
    setFormDetail(null);
    setFormData({
      personalInfo: {
        name: '',
        email: '',
        phone: ''
      },
      answers: {}
    });
    setSuccess(false);
    setSubmissionId(null);
  };
  
  // 질문 렌더링 함수
  const renderQuestion = (question) => {
    switch (question.questionType) {
      case 'SHORT_TEXT':
        return (
          <TextField
            fullWidth
            label={question.content}
            value={formData.answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
            placeholder={question.placeholder || undefined}
            helperText={question.helpText || undefined}
            margin="normal"
          />
        );
        
      case 'LONG_TEXT':
        return (
          <TextField
            fullWidth
            label={question.content}
            value={formData.answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
            placeholder={question.placeholder || undefined}
            helperText={question.helpText || undefined}
            multiline
            rows={4}
            margin="normal"
          />
        );
        
      case 'SINGLE_CHOICE':
        return (
          <FormControl fullWidth required={question.required} margin="normal">
            <FormHelperText sx={{ marginLeft: 0 }}>{question.content}</FormHelperText>
            <RadioGroup
              value={formData.answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
            >
              {question.options && question.options.map(option => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={option.content}
                />
              ))}
            </RadioGroup>
            {question.helpText && (
              <FormHelperText>{question.helpText}</FormHelperText>
            )}
          </FormControl>
        );
        
      case 'MULTIPLE_CHOICE':
        const selectedOptions = formData.answers[question.id] || [];
        return (
          <FormControl fullWidth required={question.required} margin="normal">
            <FormHelperText sx={{ marginLeft: 0 }}>{question.content}</FormHelperText>
            {question.options && question.options.map(option => (
              <FormControlLabel
                key={option.id}
                control={
                  <Checkbox
                    checked={selectedOptions.includes(option.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleAnswerChange(
                          question.id, 
                          [...selectedOptions, option.id],
                          'MULTIPLE_CHOICE'
                        );
                      } else {
                        handleAnswerChange(
                          question.id, 
                          selectedOptions.filter(id => id !== option.id),
                          'MULTIPLE_CHOICE'
                        );
                      }
                    }}
                  />
                }
                label={option.content}
              />
            ))}
            {question.helpText && (
              <FormHelperText>{question.helpText}</FormHelperText>
            )}
          </FormControl>
        );
        
      default:
        return null;
    }
  };
  
  // 각 단계별 컨텐츠 렌더링
  const getStepContent = (step) => {
    switch (step) {
      case 0: // 지원 양식 선택
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              지원 가능한 모집 공고
            </Typography>
            
            {activeForms.length > 0 ? (
              <Grid container spacing={3}>
                {activeForms.map(form => (
                  <Grid item xs={12} key={form.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedFormId === form.id ? '2px solid #1a237e' : '1px solid #e0e0e0',
                        boxShadow: selectedFormId === form.id ? '0 4px 12px rgba(26, 35, 126, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        },
                        transition: 'all 0.3s ease'
                      }} 
                      onClick={() => setSelectedFormId(form.id)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h5" component="h2" gutterBottom>
                            {form.title}
                          </Typography>
                          <Chip 
                            label={form.status === 'PUBLISHED' ? '모집중' : '마감'} 
                            color={form.status === 'PUBLISHED' ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {form.description}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>모집 기간:</strong> {new Date(form.startDate).toLocaleDateString()} ~ {new Date(form.endDate).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>질문 수:</strong> {form.questionCount}개
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  현재 지원 가능한 모집 공고가 없습니다.
                </Typography>
              </Paper>
            )}
          </Box>
        );
        
      case 1: // 개인 정보 입력
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              기본 정보 입력
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              입력하신 정보는 지원 결과 확인 및 연락을 위해 사용됩니다.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="이름"
                  name="name"
                  value={formData.personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="이메일"
                  name="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="전화번호"
                  name="phone"
                  value={formData.personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  placeholder="01012345678"
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );
        
      case 2: // 지원서 작성
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              지원서 작성
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              아래 질문들에 답변해주세요. (*) 표시는 필수 항목입니다.
            </Typography>
            
            {formDetail && formDetail.questions && formDetail.questions.length > 0 ? (
              formDetail.questions.map((question, index) => (
                <Box key={question.id} sx={{ mb: 3 }}>
                  {renderQuestion(question)}
                  {index < formDetail.questions.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                질문이 없습니다.
              </Typography>
            )}
          </Box>
        );
        
      case 3: // 제출 완료
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              지원이 완료되었습니다!
            </Typography>
            <Typography variant="body1" paragraph>
              접수번호: <strong>{submissionId}</strong>
            </Typography>
            <Typography variant="body1" paragraph>
              입력하신 이메일 ({formData.personalInfo.email})로 지원 내용을 확인할 수 있는 링크가 발송되었습니다.
            </Typography>
            <Typography variant="body1" paragraph>
              지원서 검토 후 결과를 이메일로 안내드리겠습니다.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleReset} 
              sx={{ mt: 3 }}
            >
              새로운 지원서 작성
            </Button>
          </Box>
        );
        
      default:
        return '알 수 없는 단계';
    }
  };
  
  return (
    <MainLayout>
      <Box
        sx={{
          pt: 12,
          pb: 8,
          bgcolor: '#1a237e',
          color: 'white',
          background: 'linear-gradient(135deg, #1a237e 30%, #303f9f 90%)'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              animation: 'fadeIn 1s ease-out',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(-20px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            연구실 지원
          </Typography>
          <Typography variant="h6" sx={{ 
            opacity: 0.8, 
            mb: 4,
            animation: 'slideIn 1.2s ease-out',
            '@keyframes slideIn': {
              from: { opacity: 0, transform: 'translateX(-20px)' },
              to: { opacity: 0.8, transform: 'translateX(0)' }
            }
          }}>
            BSS 연구실과 함께 미래를 선도할 인재를 기다립니다
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card 
          sx={{ 
            borderRadius: 2, 
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)', 
            overflow: 'hidden',
            animation: 'slideUp 0.8s ease-out',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(30px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          <Box
            sx={{
              height: 8,
              background: 'linear-gradient(90deg, #1a237e 0%, #f50057 100%)'
            }}
          />
          
          <CardContent sx={{ p: 5 }}>
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel
              sx={{ mb: 5 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 4 }}>
                  {getStepContent(activeStep)}
                </Box>
                
                {activeStep !== 3 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="outlined"
                    >
                      이전
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={activeStep === 2 ? <SendIcon /> : undefined}
                      disabled={
                        (activeStep === 0 && !selectedFormId) ||
                        loading
                      }
                    >
                      {activeStep === 2 ? '제출' : '다음'}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default ApplicationPage;