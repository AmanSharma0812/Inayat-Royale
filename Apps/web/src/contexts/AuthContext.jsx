// @refresh reset
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (pb.authStore.isValid && pb.authStore.isSuperuser) {
        setCurrentAdmin(pb.authStore.record);
      } else {
        setCurrentAdmin(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    const unsubscribe = pb.authStore.onChange(() => {
      checkAuth();
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('_superusers').authWithPassword(email, password, { requestKey: null });
      setCurrentAdmin(authData.record);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentAdmin(null);
  };

  const value = {
    currentAdmin,
    isAuthenticated: !!currentAdmin,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};