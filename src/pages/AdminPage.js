// src/pages/AdminPage.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';

// 관리자 페이지 컴포넌트들
import Dashboard from '../admin/Dashboard';
import FormsManagement from '../admin/FormsManagement';
import FormCreate from '../admin/FormCreate';
import FormDetail from '../admin/FormDetail';
import FormEdit from '../admin/FormEdit';
import ApplicationsManagement from '../admin/ApplicationsManagement';
import ApplicationDetail from '../admin/ApplicationDetail';
import UsersManagement from '../admin/UsersManagement';
import PostsManagement from '../admin/PostsManagement';

// 임시 컴포넌트
const UserDetail = () => <div>사용자 상세 페이지 (개발 중)</div>;
const PostDetail = () => <div>게시글 상세 페이지 (개발 중)</div>;
const Settings = () => <div>설정 페이지 (개발 중)</div>;

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