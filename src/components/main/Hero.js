// src/components/main/Hero.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ScienceIcon from '@mui/icons-material/Science';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';

const Hero = () => {
  const [user, setUser] = useState(null);
  
  // 사용자 정보 로드
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);
  
  // 애니메이션 변수
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }
    }
  };
  
  return (
    <Box
      sx={{
        bgcolor: '#1a237e',
        color: 'white',
        position: 'relative',
        pt: { xs: user ? 4 : 12, sm: user ? 6 : 16, md: user ? 8 : 20 },
        pb: { xs: 8, sm: 12, md: 16 },
        overflow: 'hidden',
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
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%', 
              opacity: 0.1 + Math.random() * 0.2
            }}
            animate={{ 
              x: [
                Math.random() * 100 + '%', 
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
                Math.random() * 100 + '%'
              ],
              y: [
                Math.random() * 100 + '%',
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
              transform: `scale(${0.5 + Math.random() * 1})`,
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Typography 
                  variant="h1" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    mb: 3
                  }}
                >

                  미래를 선도하는 <br />
                  <motion.span 
                    initial={{ color: '#f50057' }}
                    animate={{ 
                      color: ['#f50057', '#9c27b0', '#2196f3', '#f50057'],
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    BSS 연구실
                  </motion.span>
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    opacity: 0.9,
                    mb: 5,
                    maxWidth: '600px'
                  }}
                >
                  다양한 연구를 하고있습니다
                </Typography>
              </motion.div>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {user ? (
                  // 로그인 상태일 때 버튼
                  <>
                    <motion.div variants={itemVariants}>
                      <Button
                        component={RouterLink}
                        to="/board"
                        variant="contained"
                        size="large"
                        color="secondary"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '1rem',
                        }}
                      >
                        게시판 바로가기
                      </Button>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Button
                        component={RouterLink}
                        to="/board/create"
                        variant="outlined"
                        size="large"
                        color="inherit"
                        endIcon={<EditIcon />}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '1rem',
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        글 작성하기
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  // 비로그인 상태일 때 버튼 - 게시판 바로가기 버튼 제거하고 연구 소개 버튼만 표시
                  <>
                    <motion.div variants={itemVariants}>
                      <Button
                        component={RouterLink}
                        to="/research"
                        variant="contained"
                        size="large"
                        color="secondary"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '1rem',
                        }}
                      >
                        연구 살펴보기
                      </Button>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Button
                        component={RouterLink}
                        to="/login"
                        variant="outlined"
                        size="large"
                        color="inherit"
                        endIcon={<PersonIcon />}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '1rem',
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        로그인하기
                      </Button>
                    </motion.div>
                  </>
                )}
              </Box>
            </motion.div>
          </Grid>

          <Grid 
            item 
            xs={12} 
            md={5} 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: 350,
                  height: 350,
                }}
              >
                {/* 배경 원 애니메이션 */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '2px dashed rgba(255, 255, 255, 0.2)',
                  }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: 'absolute',
                    width: '80%',
                    height: '80%',
                    top: '10%',
                    left: '10%',
                    borderRadius: '50%',
                    border: '4px dashed rgba(255, 255, 255, 0.1)',
                  }}
                />
                
                {/* 중앙 아이콘 */}
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    boxShadow: [
                      '0 8px 32px rgba(0, 0, 0, 0.2)',
                      '0 12px 32px rgba(0, 0, 0, 0.3)',
                      '0 8px 32px rgba(0, 0, 0, 0.2)'
                    ]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50%',
                    width: 180,
                    height: 180,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ScienceIcon sx={{ fontSize: 80, color: '#fff' }} />
                </motion.div>
                
                {/* 작은 원형 애니메이션 요소들 */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      rotate: 360,
                    }}
                    transition={{ 
                      duration: 5 + i,
                      repeat: Infinity,
                      ease: "linear",
                      repeatType: i % 2 === 0 ? "loop" : "reverse"
                    }}
                    style={{
                      position: 'absolute',
                      width: 30 + i * 5,
                      height: 30 + i * 5,
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) translate(70px, 0) rotate(${72 * i}deg)`,
                      borderRadius: '50%',
                      background: i % 2 === 0 ? 'rgba(245, 0, 87, 0.5)' : 'rgba(33, 150, 243, 0.5)',
                      filter: 'blur(5px)',
                      opacity: 0.7,
                    }}
                  />
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;