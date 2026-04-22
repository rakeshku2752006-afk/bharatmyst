import { useState, useEffect, useCallback } from 'react';

const PHONE = '9508432536';
const DEFAULT_PASSWORD = '8147701842';
const PASSWORD_KEY = 'bharatmyst_admin_password';
const SESSION_KEY = 'bharatmyst_admin_session';

export const ADMIN_PHONE = PHONE;
export const RESET_OTP = '123456';

export const getStoredPassword = (): string => {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
};

export const setStoredPassword = (newPassword: string): void => {
  localStorage.setItem(PASSWORD_KEY, newPassword);
};

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    setIsAuthenticated(session === 'active');
    setLoading(false);
  }, []);

  const login = useCallback((phone: string, password: string): { success: boolean; error?: string } => {
    if (phone.trim() !== PHONE) {
      return { success: false, error: 'Invalid phone number' };
    }
    if (password !== getStoredPassword()) {
      return { success: false, error: 'Invalid password' };
    }
    sessionStorage.setItem(SESSION_KEY, 'active');
    setIsAuthenticated(true);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, loading, login, logout };
};
