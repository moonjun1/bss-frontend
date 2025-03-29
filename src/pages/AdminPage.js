// src/pages/AdminPage.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';

// 관리자 페이지 컴포넌트들
import Dashboard from './admin/Dashboard';
import FormsManagement from './admin/FormsManagement';
import FormCreate from './admin/FormCreate';
import FormDetail from './admin/FormDetail';
import FormEdit from './admin/FormEdit';
import ApplicationsManagement from './admin/ApplicationsManagement';
import ApplicationDetail from './admin/ApplicationDetail';
import UsersManagement from './admin/UsersManagement';
import UserDetail from './admin/UserDetail';
import PostsManagement from './admin/PostsManagement';
import PostDetail from './admin/PostDetail';
import Settings from './admin/Settings';

const AdminPage = () => {
  return (
    <AdminLayout>
      <Routes>
        {/* 대시보드 */}
        <Route path="/" element={<Dashboard />} />
        
        {/* 지원 양식 관리 */}
        <Route path="/forms" element={<FormsManagement />} />
        <Route path="/forms/create" element={<FormCreate />} />
        <Route path="/forms/:id" element={<FormDetail />} />
        <Route path="/forms/edit/:id" element={<FormEdit />} />
        
        {/* 지원서 관리 */}
        <Route path="/applications" element={<ApplicationsManagement />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} />
        
        {/* 사용자 관리 */}
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/users/:id" element={<UserDetail />} />
        
        {/* 게시글 관리 */}
        <Route path="/posts" element={<PostsManagement />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        
        {/* 설정 */}
        <Route path="/settings" element={<Settings />} />
        
        {/* 기본 리다이렉트 */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPage;

// 임시 컴포넌트들 (추후 구현)
// 여기서는 FormEdit, ApplicationsManagement, ApplicationDetail, UsersManagement, UserDetail, PostsManagement, PostDetail, Settings에 대한 임시 컴포넌트를 정의합니다.
// 실제 구현 시에는 각각 별도 파일로 분리해야 합니다.

// 이 코드는 src/pages/admin 폴더 내에 아래 파일들이 있다고 가정합니다:
// Dashboard.js
// FormsManagement.js
// FormCreate.js
// FormDetail.js

// 나머지 컴포넌트는 아직 구현하지 않았으므로, 임시 컴포넌트로 대체합니다.