import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Tab,
  Tabs,
  Chip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const Research = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 연구 분야 데이터
  const researchAreas = [
    {
      id: 'ai',
      title: '인공지능 및 머신러닝',
      description: '딥러닝, 강화학습, 자연어 처리, 컴퓨터 비전 등 인공지능 분야의 첨단 연구를 수행합니다.',
      projects: [
        {
          title: '미래 예측 AI 시스템',
          description: '과거 데이터를 분석하여 미래 동향을 예측하는 AI 시스템 개발',
          tags: ['딥러닝', '시계열 분석', '예측 모델링'],
          image: 'blue'
        },
        {
          title: '감성 인식 챗봇',
          description: '사용자의 감성을 인식하고 그에 맞게 응답하는 고급 대화형 AI',
          tags: ['자연어 처리', '감성 분석', '대화 시스템'],
          image: 'indigo'
        },
        {
          title: '자율주행 의사결정',
          description: '복잡한 교통 상황에서 최적의 의사결정을 내리는 AI 알고리즘',
          tags: ['강화학습', '컴퓨터 비전', '의사결정'],
          image: 'purple'
        }
      ]
    },
    {
      id: 'security',
      title: '다양한 언어공부부',
      description: 'C,  JAVA 등 다양한 언어를 공부합니다다',
      projects: [
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 2', '예시 3'],
          image: 'red'
        },
        {
          title: '예시 1',
          description: '다양한 알고리즘 ',
          tags: ['스택', '이진탐색', '큐'],
          image: 'pink'
        },
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          image: 'orange'
        }
      ]
    },
    {
      id: 'data',
      title: '예시 1',
      description: '예시 1',
      projects: [
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          image: 'green'
        },
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          image: 'teal'
        },
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          image: 'cyan'
        }
      ]
    }
  ];

  // 색상 매핑
  const colorMap = {
    blue: '#2196f3',
    indigo: '#3f51b5',
    purple: '#9c27b0',
    red: '#f44336',
    pink: '#e91e63',
    orange: '#ff9800',
    green: '#4caf50',
    teal: '#009688',
    cyan: '#00bcd4'
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
    <Box sx={{ py: 10 }}>
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
              연구 분야
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
              세계를 선도하는 <span style={{ color: '#f50057' }}>BSS 연구실</span>의 연구
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
              BSS 연구실은 다양한 분야에서 혁신적인 연구를 진행하고 있습니다.
              각 연구 분야의 핵심 프로젝트들을 살펴보세요.
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            centered
            variant="fullWidth"
            sx={{
              mb: 5,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 1.5
              },
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.3s',
                '&:hover': {
                  color: 'primary.main',
                  opacity: 1
                }
              }
            }}
          >
            {researchAreas.map((area, index) => (
              <Tab 
                key={area.id} 
                label={area.title} 
                id={`research-tab-${index}`}
                aria-controls={`research-tabpanel-${index}`}
              />
            ))}
          </Tabs>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                role="tabpanel"
                id={`research-tabpanel-${activeTab}`}
                aria-labelledby={`research-tab-${activeTab}`}
              >
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  paragraph
                  sx={{ 
                    textAlign: 'center', 
                    mb: 5,
                    maxWidth: 800,
                    mx: 'auto'
                  }}
                >
                  {researchAreas[activeTab].description}
                </Typography>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Grid container spacing={4}>
                    {researchAreas[activeTab].projects.map((project, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <motion.div variants={itemVariants}>
                          <Card
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                              transition: 'transform 0.3s, box-shadow 0.3s',
                              '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                              }
                            }}
                          >
                            <CardMedia
                              sx={{
                                height: 200,
                                bgcolor: colorMap[project.image],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                  color: 'white',
                                  fontWeight: 700,
                                  textAlign: 'center',
                                  p: 2
                                }}
                              >
                                {project.title}
                              </Typography>
                            </CardMedia>
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                paragraph
                                sx={{ mb: 3 }}
                              >
                                {project.description}
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                {project.tags.map((tag, i) => (
                                  <Chip
                                    key={i}
                                    label={tag}
                                    size="small"
                                    sx={{
                                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                                      fontWeight: 500
                                    }}
                                  />
                                ))}
                              </Box>
                              <Button 
                                variant="outlined" 
                                color="primary"
                                fullWidth
                                sx={{ borderRadius: 2 }}
                              >
                                자세히 보기
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
};

export default Research;