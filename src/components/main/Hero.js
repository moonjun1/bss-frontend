// src/components/main/Hero.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
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
            sx={{
              position: 'absolute',
              width: 40 + Math.random() * 60,
              height: 40 + Math.random() * 60,
              borderRadius: '50%',
              background: `rgba(255, 255, 255, ${0.03 + Math.random() * 0.05})`,
              filter: 'blur(8px)',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float ${30 + Math.random() * 30}s linear infinite`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
              transformOrigin: 'center center',
              opacity: 0.1 + Math.random() * 0.2,
              transform: `scale(${0.5 + Math.random() * 1})`,
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
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
              혁신적인 연구로 <br />
              미래를 선도하는 <br />
              <span style={{ color: '#f50057' }}>BSS 연구실</span>
            </Typography>

            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                opacity: 0.9,
                mb: 5,
                maxWidth: '600px'
              }}
            >
              최첨단 기술과 혁신적인 연구를 통해 미래 사회의 문제를 해결하는 선도적인 연구실입니다.
              우리는 기술의 경계를 넓히고 더 나은 세계를 만들기 위해 노력하고 있습니다.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {user ? (
                // 로그인 상태일 때 버튼
                <>
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
                </>
              ) : (
                // 비로그인 상태일 때 버튼
                <>
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
                    연구 살펴보기
                  </Button>
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
                </>
              )}
            </Box>
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
            <Box
              sx={{
                position: 'relative',
                width: 350,
                height: 350,
              }}
            >
              {/* 배경 원 애니메이션 */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  animation: 'rotate 20s linear infinite',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: '80%',
                  height: '80%',
                  top: '10%',
                  left: '10%',
                  borderRadius: '50%',
                  border: '4px dashed rgba(255, 255, 255, 0.1)',
                  animation: 'rotate-reverse 15s linear infinite',
                }}
              />
              
              {/* 중앙 아이콘 */}
              <Box
                sx={{
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
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <ScienceIcon sx={{ fontSize: 80, color: '#fff' }} />
              </Box>
              
              {/* 작은 원형 애니메이션 요소들 */}
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: 30 + i * 5,
                    height: 30 + i * 5,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    background: i % 2 === 0 ? 'rgba(245, 0, 87, 0.5)' : 'rgba(33, 150, 243, 0.5)',
                    filter: 'blur(5px)',
                    animation: `orbital ${5 + i}s linear infinite`,
                    animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                    opacity: 0.7,
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* 애니메이션 키프레임 */}
      <style jsx global>{`
        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }
        @keyframes rotate-reverse {
          100% { transform: rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes orbital {
          0% { transform: translate(-50%, -50%) translate(70px, 0) rotate(0deg); }
          100% { transform: translate(-50%, -50%) translate(70px, 0) rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default Hero;