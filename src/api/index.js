// src/api/index.js
import axios from 'axios';

// API 기본 설정
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 에러 처리 및 토큰 만료 처리
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 토큰 만료 시 처리 (401 에러)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const authAPI = {
  // 스웨거 문서에 맞춘 로그인 API
  login: (credentials) => API.post('/auth/login', {
    username: credentials.username,
    password: credentials.password
  }),
  
  // 로그아웃 API
  logout: () => API.post('/auth/logout'),
  
  // 회원가입 API
  register: (userData) => API.post('/auth/signup', userData),
  
  // 현재 사용자 정보 조회 API
  getCurrentUser: () => API.get('/users/me'),
};

// 게시판 관련 API
export const postAPI = {
  // 게시글 목록 조회
  getPosts: (page = 0, size = 10) => 
    API.get(`/posts?page=${page}&size=${size}`),
  
  // 게시글 상세 조회
  getPost: (id) => API.get(`/posts/${id}`),
  
  // 카테고리별 게시글 조회
  getPostsByCategory: (category, page = 0, size = 10) => 
    API.get(`/posts/category/${category}?page=${page}&size=${size}`),
  
  // 게시글 검색
  searchPosts: (keyword, page = 0, size = 10) => 
    API.get(`/posts/search?keyword=${keyword}&page=${page}&size=${size}`),
  
  // 게시글 작성
  createPost: (postData) => API.post('/posts', postData),
  
  // 게시글 수정
  updatePost: (id, postData) => API.put(`/posts/${id}`, postData),
  
  // 게시글 삭제
  deletePost: (id) => API.delete(`/posts/${id}`),
  
  // 게시글 이미지 업로드
  uploadPostImage: (id, formData) => 
    API.post(`/posts/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

// 지원서 관련 API
export const applicationAPI = {
  // 활성화된 지원 양식 목록 조회
  getActiveForms: () => API.get('/forms/active'),
  
  // 지원 양식 상세 조회
  getForm: (id) => API.get(`/forms/${id}`),
  
  // 지원서 제출 (로그인)
  submitApplication: (applicationData) => 
    API.post('/applications', applicationData),
  
  // 지원서 제출 (비로그인)
  submitGuestApplication: (applicationData) => 
    API.post('/applications/guest', applicationData),
  
  // 내 지원서 목록 조회
  getMyApplications: () => API.get('/applications/me'),
  
  // 지원서 상세 조회
  getApplication: (id) => API.get(`/applications/${id}`),
  
  // 지원 서류 업로드
  uploadDocument: (formData) => 
    API.post('/applications/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export default API;