import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Avatar,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const News = () => {
  // 뉴스 데이터
  const news = [
    {
      id: 1,
      title: '2025 국제 AI 콘퍼런스에서 우수 논문상 수상',
      summary: '우리 연구실의 "딥러닝 기반 미래 예측 시스템" 논문이 2025 국제 인공지능 콘퍼런스에서 우수 논문상을 수상했습니다.',
      date: '2025-03-15',
      author: '김교수',
      image: 'blue',
      category: '수상'
    },
    {
      id: 2,
      title: '산학협력 프로젝트 시작: 차세대 보안 시스템 개발',
      summary: '국내 대표 기업과 함께 양자 컴퓨팅 시대를 대비한 차세대 보안 시스템 개발 프로젝트를 시작했습니다.',
      date: '2025-02-28',
      author: '이박사',
      image: 'purple',
      category: '프로젝트'
    },
    {
      id: 3,
      title: '2025년 봄학기 신입생 모집 안내',
      summary: '2025년 봄학기 석/박사 과정 신입생을 모집합니다. 인공지능, 빅데이터, 사이버 보안 분야에 관심있는 학생들의 많은 지원 바랍니다.',
      date: '2025-01-10',
      author: '연구실 행정팀',
      image: 'green',
      category: '모집'
    }
  ];

  // 색상 매핑
  const colorMap = {
    blue: '#2196f3',
    purple: '#9c27b0',
    green: '#4caf50'
  };

  // 카테고리별 배경색
  const categoryColorMap = {
    '수상': '#1a237e',
    '프로젝트': '#6a1b9a',
    '모집': '#1b5e20'
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

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <Box sx={{ py: 10, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Typography
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontSize: '0.875rem',
                display: 'block',
                mb: 1
              }}
            >
              뉴스 & 소식
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2
              }}
            >
              <span style={{ color: '#f50057' }}>최신</span> 연구실 소식
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              BSS 연구실의 최신 소식과 성과, 모집 공고 등을 확인하세요.
            </Typography>
          </motion.div>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Grid container spacing={4}>
            {news.map((item, index) => (
              <Grid item xs={12} md={4} key={item.id}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        sx={{
                          height: 200,
                          bgcolor: colorMap[item.image]
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 20,
                          left: 20,
                          bgcolor: categoryColorMap[item.category],
                          color: 'white',
                          py: 0.5,
                          px: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                      >
                        {item.category}
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          lineHeight: 1.4
                        }}
                      >
                        {item.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                          <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(item.date)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {item.author}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                        {item.summary}
                      </Typography>
                      
                      <Box sx={{ mt: 'auto' }}>
                        <Button 
                          variant="text" 
                          color="primary" 
                          endIcon={<ArrowForwardIcon />}
                          sx={{ fontWeight: 600 }}
                        >
                          자세히 보기
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              모든 소식 보기
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default News;