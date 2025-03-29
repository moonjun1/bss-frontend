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
      title: '사이버 보안',
      description: '침입 탐지, 악성코드 분석, 네트워크 보안, 암호화 기술 등 보안 분야의 연구를 진행합니다.',
      projects: [
        {
          title: '차세대 침입 탐지 시스템',
          description: '행동 패턴 분석을 통한 고급 보안 위협 탐지 시스템',
          tags: ['침입 탐지', '행동 분석', '머신러닝'],
          image: 'red'
        },
        {
          title: '양자 내성 암호화',
          description: '양자 컴퓨팅 시대에 대비한 새로운 암호화 알고리즘 개발',
          tags: ['암호화', '양자 컴퓨팅', '보안 프로토콜'],
          image: 'pink'
        },
        {
          title: '블록체인 보안',
          description: '분산 원장 기술의 보안 취약점 분석 및 개선 연구',
          tags: ['블록체인', '스마트 컨트랙트', '분산 시스템'],
          image: 'orange'
        }
      ]
    },
    {
      id: 'data',
      title: '빅데이터 분석',
      description: '대규모 데이터의 수집, 처리, 분석, 시각화를 통해 인사이트를 도출하는 연구를 수행합니다.',
      projects: [
        {
          title: '실시간 스트림 처리',
          description: '대용량 데이터 스트림의 실시간 처리 및 분석 시스템',
          tags: ['스트림 처리', '실시간 분석', '분산 시스템'],
          image: 'green'
        },
        {
          title: '지능형 데이터 마이닝',
          description: '복잡한 데이터에서 유용한 패턴을 추출하는 고급 알고리즘',
          tags: ['데이터 마이닝', '패턴 인식', '기계학습'],
          image: 'teal'
        },
        {
          title: '소셜 네트워크 분석',
          description: '소셜 미디어 데이터를 통한 사회적 현상 분석 및 예측',
          tags: ['그래프 분석', '소셜 컴퓨팅', '네트워크 이론'],
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