import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Card, 
  CardContent,
  TextField,
  InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import SchoolIcon from '@mui/icons-material/School';

const Contact = () => {
  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* 연락처 정보 */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Box sx={{ mb: 5 }}>
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
                  연락처
                </Typography>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 2
                  }}
                >
                  <span style={{ color: '#f50057' }}>BSS</span> 연구실과
                  <br />
                  함께하세요
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  연구, 협업, 진학 등 다양한 문의사항은 연락처를 통해 문의해주세요.
                  최대한 빠르게 답변 드리겠습니다.
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 50,
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                        >
                          <EmailIcon />
                        </Box>
                        <Box>
                          <Typography variant="h6" gutterBottom fontWeight={600}>
                            이메일
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            contact@bsslab.com
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 50,
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                        >
                          <PhoneIcon />
                        </Box>
                        <Box>
                          <Typography variant="h6" gutterBottom fontWeight={600}>
                            전화
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            +82-2-123-4567
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 50,
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                        >
                          <LocationOnIcon />
                        </Box>
                        <Box>
                          <Typography variant="h6" gutterBottom fontWeight={600}>
                            위치
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                          경기 포천시 호국로 1007 (우) 11159(지번) 선단동 산 11-1 대진대학교 이공학관다동
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          </Grid>

          {/* 지원 양식 */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 8,
                    background: 'linear-gradient(90deg, #1a237e 0%, #f50057 100%)'
                  }}
                />

                <CardContent sx={{ p: 5 }}>
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SchoolIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h4" component="h3" fontWeight={700}>
                        연구실 지원 문의
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      BSS 연구실에 관심이 있으신가요? 아래 양식을 작성하여 보내주시면
                      자세한 지원 방법을 안내해 드립니다.
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="이름"
                        variant="outlined"
                        placeholder="홍길동"
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="이메일"
                        variant="outlined"
                        placeholder="your.email@example.com"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="제목"
                        variant="outlined"
                        placeholder="문의 제목을 입력해주세요"
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="메시지"
                        variant="outlined"
                        placeholder="문의 내용을 자세히 입력해주세요"
                        multiline
                        rows={5}
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            endIcon={<SendIcon />}
                            sx={{
                              px: 4,
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: 600
                            }}
                          >
                            메시지 보내기
                          </Button>
                        </motion.div>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;