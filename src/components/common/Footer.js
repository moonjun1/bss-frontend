// src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Phone as PhoneIcon,
  Room as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#0a1929',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* 연구실 소개 */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              BSS LAB
            </Typography>
            <Typography variant="body2" paragraph>
              최첨단 연구를 통해 혁신적인 솔루션을 개발하는 연구실입니다. 
              우리는 기술과 과학의 경계를 넓히기 위해 노력하고 있습니다.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                서울특별시 강남구 테헤란로 123
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                +82-2-123-4567
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                contact@bsslab.com
              </Typography>
            </Box>
          </Grid>

          {/* 링크 섹션 */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              바로가기
            </Typography>
            <List dense>
              <ListItem disableGutters>
                <ListItemText>
                  <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                    홈
                  </Link>
                </ListItemText>
              </ListItem>
              <ListItem disableGutters>
                <ListItemText>
                  <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>
                    소개
                  </Link>
                </ListItemText>
              </ListItem>
              <ListItem disableGutters>
                <ListItemText>
                  <Link to="/research" style={{ color: 'white', textDecoration: 'none' }}>
                    연구
                  </Link>
                </ListItemText>
              </ListItem>
              <ListItem disableGutters>
                <ListItemText>
                  <Link to="/board" style={{ color: 'white', textDecoration: 'none' }}>
                    게시판
                  </Link>
                </ListItemText>
              </ListItem>
              <ListItem disableGutters>
                <ListItemText>
                  <Link to="/apply" style={{ color: 'white', textDecoration: 'none' }}>
                    지원
                  </Link>
                </ListItemText>
              </ListItem>
            </List>
          </Grid>

          {/* 뉴스레터 섹션 */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              소셜 미디어
            </Typography>
            <Typography variant="body2" paragraph>
              우리의 소셜 미디어 채널을 통해 최신 연구 소식을 확인하세요.
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="linkedin">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="github">
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box sx={{ textAlign: 'center', pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} BSS Lab. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;