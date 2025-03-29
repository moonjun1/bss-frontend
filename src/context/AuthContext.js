// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

// 인증 컨텍스트 생성
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 사용자 정보 확인
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // 현재 사용자 정보 요청
          const response = await authAPI.getCurrentUser();
          
          // 스웨거 문서 응답 구조에 맞게 처리
          if (response.data?.status === 200 && response.data?.data) {
            setCurrentUser(response.data.data);
          } else {
            // 응답이 유효하지 않은 경우 토큰 제거
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('사용자 정보를 가져오는데 실패했습니다:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 로그인 함수
  const login = async (credentials) => {
    try {
      setError(null);
      
      // 스웨거 문서에 맞는 로그인 요청
      const response = await authAPI.login(credentials);
      
      // 응답 확인
      if (response.data?.status === 200 && response.data?.data) {
        const userData = response.data.data;
        
        // 토큰 저장
        localStorage.setItem('token', userData.token);
        
        // 사용자 정보 저장
        localStorage.setItem('user', JSON.stringify({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role
        }));
        
        // 현재 사용자 정보 설정
        setCurrentUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role
        });
        
        return userData;
      } else {
        throw new Error(response.data?.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || '로그인에 실패했습니다.';
      setError(errorMsg);
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('로그아웃 중 에러가 발생했습니다:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
    }
  };

  // 인증 여부 확인
  const isAuthenticated = () => {
    return !!currentUser || !!localStorage.getItem('token');
  };

  // 관리자 여부 확인
  const isAdmin = () => {
    if (currentUser) {
      return currentUser.role === 'ROLE_ADMIN';
    }
    
    // localStorage에서 확인
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.role === 'ROLE_ADMIN';
      } catch (e) {
        return false;
      }
    }
    
    return false;
  };

  // 제공할 컨텍스트 값
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;