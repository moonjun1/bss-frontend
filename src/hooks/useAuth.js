// src/hooks/useAuth.js
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// 인증 관련 기능을 쉽게 사용할 수 있는 커스텀 훅
const useAuth = () => {
  const auth = useContext(AuthContext);
  
  // Context가 없으면 기본값 제공
  if (!auth) {
    console.warn('useAuth must be used within an AuthProvider');
    // 빈 객체 반환하여 오류 방지
    return {
      currentUser: null,
      loading: false,
      error: null,
      login: () => {},
      logout: () => {},
      isAuthenticated: () => false,
      isAdmin: () => false
    };
  }
  
  return auth;
};

export default useAuth;