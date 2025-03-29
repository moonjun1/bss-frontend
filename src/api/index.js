// src/api/index.js
import axios from 'axios';

// src/api/index.js의 수정된 부분

// API 기본 설정
const API = axios.create({
  // 상대 경로를 사용하거나 동적으로 현재 호스트 주소를 사용
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 또는 아래와 같이 동적으로 현재 호스트 주소를 사용할 수도 있습니다
/*
const API = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:8080/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});
*/

// 나머지 코드는 그대로 유지
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

// 관리자 관련 API
export const adminAPI = {
  // 대시보드 통계
  getStats: () => API.get('/admin/stats'),
  
  // 사용자 관리
  getUsers: (page = 0, size = 10) => 
    API.get(`/admin/users?page=${page}&size=${size}`),
  getUser: (id) => API.get(`/admin/users/${id}`),
  createUser: (userData) => API.post('/admin/users', userData),
  updateUser: (id, userData) => API.put(`/admin/users/${id}`, userData),
  updateUserStatus: (id, statusData) => 
    API.patch(`/admin/users/${id}/status`, statusData),
  updateUserRole: (id, roleData) => 
    API.patch(`/admin/users/${id}/role`, roleData),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  searchUsers: (keyword) => 
    API.get(`/admin/users/search?keyword=${keyword}`),
  
  // 지원 양식 관리
  getForms: (page = 0, size = 10) => 
    API.get(`/admin/forms?page=${page}&size=${size}`),
  getFormsByStatus: (status, page = 0, size = 10) => 
    API.get(`/admin/forms/status/${status}?page=${page}&size=${size}`),
  getForm: (id) => API.get(`/admin/forms/${id}`),
  createForm: (formData) => API.post('/admin/forms', formData),
  updateForm: (id, formData) => API.put(`/admin/forms/${id}`, formData),
  deleteForm: (id) => API.delete(`/admin/forms/${id}`),
  
  // 지원서 관리
  getApplications: (page = 0, size = 10) => 
    API.get(`/admin/applications?page=${page}&size=${size}`),
  getApplicationsByStatus: (status, page = 0, size = 10) => 
    API.get(`/admin/applications/status/${status}?page=${page}&size=${size}`),
  getApplicationsByForm: (formId, page = 0, size = 10) => 
    API.get(`/admin/applications/form/${formId}?page=${page}&size=${size}`),
  getApplicationsByStatusAndForm: (status, formId, page = 0, size = 10) => 
    API.get(`/admin/applications/status/${status}/form/${formId}?page=${page}&size=${size}`),
  getApplication: (id) => API.get(`/admin/applications/${id}`),
  updateApplicationStatus: (id, statusData) => 
    API.patch(`/admin/applications/${id}/status`, statusData),
  deleteApplication: (id) => API.delete(`/admin/applications/${id}`),
  searchApplications: (keyword) => 
    API.get(`/admin/applications/search?keyword=${keyword}`),
  getApplicationDocuments: (applicationId) => 
    API.get(`/admin/applications/${applicationId}/documents`),
  
  // 게시글 관리
  getAllPosts: (page = 0, size = 10) => 
    API.get(`/admin/posts?page=${page}&size=${size}`),
  getPost: (id) => API.get(`/admin/posts/${id}`),
  updatePostStatus: (id, status) => 
    API.patch(`/admin/posts/${id}/status?status=${status}`),
  deletePost: (id) => API.delete(`/admin/posts/${id}`)
};

export default API;