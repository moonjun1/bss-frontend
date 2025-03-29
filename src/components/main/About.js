// src/components/main/About.js
import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const About = () => {
  const features = [
    {
      icon: <SchoolIcon fontSize="large" />,
      title: '세계적 수준의 교육',
      description: '최신 연구 및 기술 동향을 반영한 교육 프로그램을 통해 학생들의 역량을 강화합니다.'
    },
    {
      icon: <GroupsIcon fontSize="large" />,
      title: '협력적 연구 환경',
      description: '연구원들 간의 활발한 협업과 토론을 통해 창의적인 아이디어가 탄생합니다.'
    },
    {
      icon: <TrendingUpIcon fontSize="large" />,
      title: '지속적인 혁신',
      description: '끊임없는 도전과 혁신을 통해 기술의 한계를 넓히고 있습니다.'
    },
    {
      icon: <LightbulbIcon fontSize="large" />,
      title: '미래지향적 사고',
      description: '미래 사회의 문제를 예측하고 해결책을 제시하는 선도적인 연구를 수행합니다.'
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
      <Container>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
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
            연구실 소개
          </Typography>
          
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2
            }}
          >
            우리는 <span style={{ color: '#f50057' }}>미래</span>를 연구합니다
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            BSS 연구실은 혁신적인 기술과 연구를 통해 미래 사회의 문제를 해결하고자 합니다.
            다양한 전문 분야의 석학들이 모여 창의적인 연구를 진행하고 있습니다.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 70,
                      height: 70,
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default About;