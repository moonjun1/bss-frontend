// src/App.js 업데이트 버전
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Auth Provider
import { AuthProvider } from './context/AuthContext';

// 공통 컴포넌트
import ProtectedRoute from './components/common/ProtectedRoute';

// 페이지
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';      // 추가된 소개 페이지
import ResearchPage from './pages/ResearchPage'; // 추가된 연구 페이지
import BoardPage from './pages/BoardPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import ApplicationPage from './pages/ApplicationPage';
import MyPage from './pages/MyPage';           // 추가된 마이페이지
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './pages/AdminPage';      // 관리자 페이지

// 스타일
import theme from './styles/theme';
import './styles/animations.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* 추가된 페이지 라우트 */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/research" element={<ResearchPage />} />
            
            {/* 게시판 관련 라우트 - 로그인 필요 */}
            <Route 
              path="/board" 
              element={
                <ProtectedRoute>
                  <BoardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/board/create" 
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/board/:id" 
              element={
                <ProtectedRoute>
                  <PostDetailPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/apply" element={<ApplicationPage />} />
            
            {/* 마이페이지 - 로그인 필요 */}
            <Route 
              path="/mypage" 
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              } 
            />
            
            {/* 관리자 라우트 - 관리자 권한이 필요한 페이지 */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;