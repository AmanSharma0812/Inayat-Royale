import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthProvider';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute.jsx';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ProductsPage from '@/pages/ProductsPage';
import ContactPage from '@/pages/ContactPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProducts from '@/pages/AdminProducts';
import AdminCategories from '@/pages/AdminCategories';
import AdminContacts from '@/pages/AdminContacts';
import AdminChangePassword from '@/pages/AdminChangePassword';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedAdminRoute>
                <AdminProducts />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <ProtectedAdminRoute>
                <AdminCategories />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/contacts" 
            element={
              <ProtectedAdminRoute>
                <AdminContacts />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/change-password" 
            element={
              <ProtectedAdminRoute>
                <AdminChangePassword />
              </ProtectedAdminRoute>
            } 
          />
        </Routes>
        <Toaster />
      </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;