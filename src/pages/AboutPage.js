// src/pages/AboutPage.js
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Divider, 
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  School as SchoolIcon,
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  Biotech as BiotechIcon,
  Computer as ComputerIcon,
  Timeline as TimelineIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';

const AboutPage = () => {
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

  // 연구 분야 데이터
  const researchAreas = [
    {
      title: '인공지능 및 머신러닝',
      icon: <ComputerIcon fontSize="large" />,
      description: '딥러닝, 강화학습, 자연어 처리, 컴퓨터 비전 등의 첨단 기술을 연구합니다.'
    },
    {
      title: '데이터 사이언스',
      icon: <BiotechIcon fontSize="large" />,
      description: '빅데이터 분석, 데이터 마이닝, 통계적 모델링을 통해 데이터 기반 의사결정을 지원합니다.'
    },
    {
      title: '인지과학',
      icon: <PsychologyIcon fontSize="large" />,
      description: '인간의 인지과정과 기계학습 알고리즘의 융합을 통해 지능형 시스템을 개발합니다.'
    },
    {
      title: '융합 연구',
      icon: <ScienceIcon fontSize="large" />,
      description: '다양한 학문 분야와의 협력을 통해 학제간 연구를 수행하고 있습니다.'
    }
  ];

  // 연구원 데이터
  const researchers = [
    {
      name: '김교수',
      position: '연구소장',
      area: '인공지능, 머신러닝',
      image: null
    },
    {
      name: '이박사',
      position: '선임연구원',
      area: '데이터 사이언스',
      image: null
    },
    {
      name: '박연구원',
      position: '연구원',
      area: '자연어 처리',
      image: null
    },
    {
      name: '정연구원',
      position: '연구원',
      area: '컴퓨터 비전',
      image: null
    }
  ];

  // 연구소 연혁 데이터
  const history = [
    { year: '2025', event: 'BSS-Lab 국제 인공지능 콘퍼런스 개최' },
    { year: '2024', event: '대규모 산학협력 프로젝트 시작' },
    { year: '2023', event: '연구 분야 확장 (인지과학 추가)' },
    { year: '2022', event: 'BSS-Lab 설립' }
  ];

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
              <span style={{ color: '#f50057' }}>BSS</span>-LAB
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                textAlign: 'center',
                mb: 4,
                opacity: 0.9
              }}
            >
              미래를 선도하는 연구실
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: 800,
                mx: 'auto',
                textAlign: 'center',
                opacity: 0.8,
                lineHeight: 1.6
              }}
            >
              BSS-LAB은 첨단 인공지능과 데이터 사이언스 연구를 통해 미래 사회의 문제를 해결하고, 
              혁신적인 기술을 개발하는 연구소입니다.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* 연구실 소개 섹션 */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography variant="h3" component="h2" gutterBottom fontWeight={600}>
                연구실 <span style={{ color: '#f50057' }}>소개</span>
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3, color: 'text.secondary' }}>
                BSS-LAB은 2022년에 설립된 연구소로, 인공지능, 데이터 사이언스, 인지과학 등 
                다양한 분야의 학제간 연구를 수행하고 있습니다. 우리는 최신 연구와 기술 혁신을 
                통해 사회적 가치를 창출하고, 미래 기술의 발전에 기여하고자 합니다.
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3, color: 'text.secondary' }}>
                국내외 유수의 대학 및 연구기관과의 협력을 통해 글로벌 네트워크를 구축하고 있으며, 
                산업계와의 긴밀한 협력을 통해 연구 결과의 실용화에도 힘쓰고 있습니다.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    연구 살펴보기
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="large"
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    연락하기
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box
                component="img"
                src="/public/assets/images/hero-bg.jpg"
                alt="BSS-LAB 연구실"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                }}
                onError={(e) => {
                  // 이미지 로드 실패 시 백업 스타일 적용
                  e.target.style.backgroundColor = '#1a237e';
                  e.target.style.height = '400px';
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* 연구 분야 섹션 */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              gutterBottom
              fontWeight={600}
              sx={{ mb: 6 }}
            >
              연구 <span style={{ color: '#f50057' }}>분야</span>
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Grid container spacing={4}>
              {researchAreas.map((area, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={itemVariants}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center', flexGrow: 1 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 3,
                            '& .MuiSvgIcon-root': {
                              fontSize: 40
                            }
                          }}
                        >
                          {area.icon}
                        </Avatar>
                        <Typography
                          variant="h5"
                          component="h3"
                          gutterBottom
                          sx={{ fontWeight: 600, mb: 2 }}
                        >
                          {area.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {area.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* 연구원 소개 섹션 */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            fontWeight={600}
            sx={{ mb: 6 }}
          >
            연구원 <span style={{ color: '#f50057' }}>소개</span>
          </Typography>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Grid container spacing={4}>
            {researchers.map((researcher, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        height: 200,
                        bgcolor: `${['#1a237e', '#f50057', '#283593', '#3949ab'][index % 4]}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          fontSize: 48,
                          fontWeight: 'bold',
                          bgcolor: 'white',
                          color: `${['#1a237e', '#f50057', '#283593', '#3949ab'][index % 4]}`
                        }}
                      >
                        {researcher.name.charAt(0)}
                      </Avatar>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                        {researcher.name}
                      </Typography>
                      <Typography variant="subtitle1" color="primary.main" gutterBottom>
                        {researcher.position}
                      </Typography>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {researcher.area}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* 연구소 연혁 섹션 */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              gutterBottom
              fontWeight={600}
              sx={{ mb: 6 }}
            >
              연구소 <span style={{ color: '#f50057' }}>연혁</span>
            </Typography>
          </motion.div>

          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ position: 'relative' }}>
                {/* 중앙 타임라인 */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    height: '100%',
                    width: 4,
                    bgcolor: 'rgba(0,0,0,0.08)',
                    transform: 'translateX(-50%)',
                    zIndex: 0
                  }}
                />

                {history.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Grid container sx={{ mb: 5, position: 'relative', zIndex: 1 }}>
                      <Grid
                        item
                        xs={5}
                        sx={{
                          textAlign: 'right',
                          pr: 3,
                          display: { xs: 'none', sm: 'block' }
                        }}
                      >
                        {index % 2 === 0 && (
                          <Box sx={{ pr: 2 }}>
                            <Typography variant="h5" fontWeight={600}>
                              {item.year}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                              {item.event}
                            </Typography>
                          </Box>
                        )}
                      </Grid>

                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: { xs: 40, sm: 50 },
                            height: { xs: 40, sm: 50 },
                            boxShadow: '0 0 0 4px #f8f9fa, 0 0 0 8px rgba(26, 35, 126, 0.2)'
                          }}
                        >
                          <TimelineIcon />
                        </Avatar>
                      </Grid>

                      <Grid
                        item
                        xs={10}
                        sm={5}
                        sx={{
                          pl: { xs: 2, sm: 3 }
                        }}
                      >
                        {index % 2 === 1 || window.innerWidth < 600 ? (
                          <Box sx={{ pl: 2 }}>
                            <Typography variant="h5" fontWeight={600}>
                              {item.year}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                              {item.event}
                            </Typography>
                          </Box>
                        ) : null}
                      </Grid>
                    </Grid>
                  </motion.div>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 협력 기관 섹션 */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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
            협력 <span style={{ color: '#f50057' }}>기관</span>
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}
          >
            BSS-LAB은 다양한 국내외 기관과 협력하여 연구를 수행하고 있습니다.
          </Typography>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          {['서울대학교', 'KAIST', '삼성전자', 'LG AI연구소', '한국과학기술연구원', '한국전자통신연구원'].map((partner, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    p: 2
                  }}
                >
                  <Typography variant="subtitle1" textAlign="center" fontWeight={500}>
                    {partner}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 연락 섹션 */}
      <Box
        sx={{
          py: 8,
          bgcolor: '#1a237e',
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography variant="h3" component="h2" gutterBottom fontWeight={600}>
                  BSS-LAB과 함께하세요
                </Typography>
                <Typography variant="h6" paragraph sx={{ opacity: 0.9, mb: 4 }}>
                  연구, 협업, 채용 등 다양한 문의사항은 아래 연락처로 문의해주세요.
                </Typography>

                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <GroupsIcon sx={{ mr: 2 }} />
                  <Typography variant="body1">
                    서울특별시 강남구 테헤란로 123, BSS연구동 5층
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ mr: 2 }} />
                  <Typography variant="body1">
                    이메일: contact@bsslab.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ScienceIcon sx={{ mr: 2 }} />
                  <Typography variant="body1">
                    전화: +82-2-123-4567
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
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
                    지원 및 문의
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ mb: 3 }}>
                    최신 연구 동향과 채용 정보를 받아보세요.
                  </Typography>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      size="large"
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

export default AboutPage;