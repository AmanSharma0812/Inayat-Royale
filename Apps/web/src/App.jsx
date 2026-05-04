import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthProvider';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
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
import ShippingPolicy from '@/pages/ShippingPolicy';
import ReturnPolicy from '@/pages/ReturnPolicy';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ProductDetailPage from '@/pages/ProductDetailPage';
import WishlistPage from '@/pages/WishlistPage';
import BridalConsultationPage from '@/pages/BridalConsultationPage';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CurrencyProvider>
              <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/bridal-consultation" element={<BridalConsultationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

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
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </CurrencyProvider>
      </WishlistProvider>
    </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;