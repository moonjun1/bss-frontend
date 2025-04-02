// src/pages/ResearchPage.js
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Tabs,
  Tab,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Science as ScienceIcon,
  Computer as ComputerIcon,
  BarChart as BarChartIcon,
  Psychology as PsychologyIcon,
  DataObject as DataObjectIcon,
  BiotechOutlined as BiotechIcon,
  ArrowForward as ArrowForwardIcon,
  Article as ArticleIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Build as BuildIcon,
  ArrowRightAlt as ArrowRightIcon,
  SupervisorAccount as TeamIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';

const ResearchPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // 연구 분야 데이터
  const researchAreas = [
    {
      id: 'ai',
      title: '인공지능 및 머신러닝',
      icon: <ComputerIcon fontSize="large" />,
      color: '#3f51b5', // 파란색
      description: '딥러닝, 강화학습, 자연어 처리 등 인공지능 분야의 첨단 연구를 수행하고 있습니다. 특히 다양한 도메인에 적용 가능한 범용 AI 모델 개발에 주력하고 있습니다.',
      projects: [
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          status: '진행중'
        },
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          status: '계획'
        }
      ]
    },
    {
      id: 'data',
      title: '데이터 사이언스',
      icon: <BarChartIcon fontSize="large" />,
      color: '#4caf50', // 초록색
      description: '예시 1',
      projects: [
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          status: '진행중'
        },
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          status: '완료'
        }
      ]
    },
    {
      id: 'cognitive',
      title: '예시 1',
      icon: <PsychologyIcon fontSize="large" />,
      color: '#f44336', // 빨간색
      description: '예시 1',
      projects: [
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          status: '계획'
        },
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          status: '진행중'
        }
      ]
    },
    {
      id: 'bioinformatics',
      title: '예시 1',
      icon: <BiotechIcon fontSize="large" />,
      color: '#ff9800', // 주황색
      description: '예시 1',
      projects: [
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          status: '진행중'
        },
        {
          title: '예시 1',
          description: '예시 1',
          tags: ['예시 1', '예시 1', '예시 1'],
          status: '계획'
        }
      ]
    }
  ];

  // 연구 성과 데이터
  const achievements = [
    {
      type: '예시 1',
      title: '예시 1',
      conference: '예시 1',
      impact: '예시 1'
    },
    {
      type: '예시 1',
      title: '예시 1',
      number: '예시 1',
      impact: '예시 1'
    },
    {
      type: '예시 1',
      title: '예시 1',
      result: '예시 1',
      impact: '예시 1'
    },
    {
      type: '예시 1',
      title: '예시 1',
      partner: '예시 1',
      impact: '예시 1'
    }
  ];

  // 연구 인프라 데이터
  const infrastructure = [
    {
      title: '예시 1',
      description: '예시 1',
      icon: <ComputerIcon />
    },
    {
      title: '예시 1',
      description: '예시 1',
      icon: <DataObjectIcon />
    },
    {
      title: '예시 1',
      description: '예시 1',
      icon: <BuildIcon />
    },
    {
      title: '예시 1',
      description: '예시 1',
      icon: <TeamIcon />
    }
  ];

  // 애니메이션 변수
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  // 탭 콘텐츠 변환 애니메이션
  const tabContentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.3 }
    }
  };

  return (
    <MainLayout>
      {/* 상단 히어로 섹션 */}
      <Box
        sx={{
          pt: { xs: 10, md: 15 },
          pb: { xs: 8, md: 12 },
          bgcolor: '#1a237e',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(135deg, #1a237e 40%, #283593 100%)'
        }}
      >
        {/* 배경 애니메이션 효과 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          {[...Array(15)].map((_, i) => (
            <Box
              key={i}
              component={motion.div}
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%', 
                opacity: 0.05 + Math.random() * 0.1
              }}
              animate={{ 
                x: [
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
                y: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%'
                ],
              }}
              transition={{
                duration: 30 + Math.random() * 30,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              sx={{
                position: 'absolute',
                width: 40 + Math.random() * 60,
                height: 40 + Math.random() * 60,
                borderRadius: '50%',
                background: `rgba(255, 255, 255, ${0.03 + Math.random() * 0.05})`,
                filter: 'blur(8px)',
              }}
            />
          ))}
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 2
              }}
            >
              <span style={{ color: '#f50057' }}>연구</span> 분야
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                textAlign: 'center',
                mb: 4,
                opacity: 0.9,
                maxWidth: 800,
                mx: 'auto'
              }}
            >
              BSS-LAB 다양한 공부르 하고있습니다.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* 연구 분야 탭 섹션 */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            aria-label="연구 분야 탭"
            sx={{ 
              mb: 5,
              '& .MuiTab-root': {
                fontSize: { xs: '0.875rem', md: '1rem' },
                px: { xs: 2, md: 3 },
                py: 2,
                minWidth: 'auto'
              }
            }}
          >
            {researchAreas.map((area, index) => (
              <Tab
                key={area.id}
                label={area.title}
                id={`research-tab-${index}`}
                aria-controls={`research-tabpanel-${index}`}
                icon={area.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabContentVariants}
          >
            <Box
              role="tabpanel"
              hidden={selectedTab !== selectedTab}
              id={`research-tabpanel-${selectedTab}`}
              aria-labelledby={`research-tab-${selectedTab}`}
            >
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <Box sx={{ 
                    height: { xs: 200, md: 300 }, 
                    width: '100%',
                    bgcolor: researchAreas[selectedTab].color,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    mb: { xs: 2, md: 0 }
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        fontSize: { xs: 60, md: 100 },
                        '& .MuiSvgIcon-root': { fontSize: 'inherit' }
                      }}>
                        {researchAreas[selectedTab].icon}
                      </Box>
                      <Typography variant="h4" fontWeight={600} sx={{ mt: 2 }}>
                        {researchAreas[selectedTab].title}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                    {researchAreas[selectedTab].description}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    주요 연구 프로젝트
                  </Typography>
                  
                  {researchAreas[selectedTab].projects.map((project, idx) => (
                    <Card 
                      key={idx} 
                      elevation={2}
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" fontWeight={600}>
                            {project.title}
                          </Typography>
                          <Chip 
                            label={project.status} 
                            size="small"
                            color={
                              project.status === '진행중' ? 'primary' : 
                              project.status === '완료' ? 'success' : 'default'
                            }
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {project.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {project.tags.map((tag, tagIdx) => (
                            <Chip key={tagIdx} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Box sx={{ textAlign: 'right', mt: 3 }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                    >
                      더 많은 프로젝트 보기
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* 연구 성과 섹션 */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              gutterBottom
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              연구 <span style={{ color: '#f50057' }}>성과</span>
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}
            >
              BSS-LAB의 최근 일 입니다다
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Grid container spacing={3}>
              {achievements.map((achievement, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div variants={itemVariants}>
                    <Card
                      sx={{
                        display: 'flex',
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          bgcolor: 
                            achievement.type === '논문' ? '#3f51b5' :
                            achievement.type === '특허' ? '#4caf50' :
                            achievement.type === '수상' ? '#f44336' : '#ff9800'
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Chip 
                          label={achievement.type} 
                          size="small" 
                          sx={{ mb: 1 }} 
                          color={
                            achievement.type === '논문' ? 'primary' :
                            achievement.type === '특허' ? 'success' :
                            achievement.type === '수상' ? 'error' : 'warning'
                          }
                        />
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {achievement.conference || achievement.number || achievement.result || achievement.partner}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          <StarIcon sx={{ fontSize: 16, mr: 0.5, color: 'primary.main', verticalAlign: 'text-top' }} />
                          {achievement.impact}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArticleIcon />}
              size="large"
              sx={{ px: 4, py: 1, borderRadius: 2 }}
            >
              전체 연구 성과 보기
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 연구 인프라 섹션 */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            fontWeight={600}
            sx={{ mb: 2 }}
          >
            연구 <span style={{ color: '#f50057' }}>인프라</span>
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}
          >
            BSS-LAB은 최첨단 연구를 위한 최고의 인프라를 갖추고 있습니다.
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {infrastructure.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  <Box sx={{ mr: 3, color: 'primary.main' }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 연구 참여 섹션 */}
      <Box sx={{ bgcolor: '#1a237e', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography variant="h3" component="h2" gutterBottom fontWeight={600}>
                  연구에 참여하세요
                </Typography>
                <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
                  BSS-LAB은 항상 열정적인 연구자와 함께할 준비가 되어 있습니다.
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon sx={{ color: 'white' }}>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="랩원 모집" 
                      secondary="학생을 모집합니다." 
                      secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ color: 'white' }}>
                      <ScienceIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="예시 1" 
                      secondary="예시 1" 
                      secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ color: 'white' }}>
                      <BiotechIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="예시 1" 
                      secondary="예시 1" 
                      secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                  </ListItem>
                </List>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    p: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    관심 분야를 선택하세요
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {researchAreas.map((area, index) => (
                      <Chip
                        key={index}
                        label={area.title}
                        variant="outlined"
                        sx={{ 
                          color: 'white', 
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' }
                        }}
                      />
                    ))}
                  </Box>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      size="large"
                      endIcon={<ArrowRightIcon />}
                      sx={{ py: 1.5, borderRadius: 2 }}
                    >
                      지원하기
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default ResearchPage;