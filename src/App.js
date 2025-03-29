// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Auth Provider
import { AuthProvider } from './context/AuthContext';

// 페이지
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BoardPage from './pages/BoardPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import ApplicationPage from './pages/ApplicationPage';
import NotFoundPage from './pages/NotFoundPage';

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
            <Route path="/board" element={<BoardPage />} />
            <Route path="/board/create" element={<CreatePostPage />} />
            <Route path="/board/:id" element={<PostDetailPage />} />
            <Route path="/apply" element={<ApplicationPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;