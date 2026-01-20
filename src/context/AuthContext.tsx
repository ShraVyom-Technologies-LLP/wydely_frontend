import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { navigationRef } from '../navigation/AppNavigator';
import {
  AuthData,
  saveAuthData,
  getValidAuthData,
  clearAuthData,
  isTokenExpired,
} from '../utils/authStorage';

interface AuthContextType {
  authData: AuthData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthData: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getAccessToken: () => string | null;
  getBusinessId: () => string | null;
  clearAuthDataFromStorage: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authData, setAuthDataState] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const validAuthData = await getValidAuthData();
      setAuthDataState(validAuthData);

      // If token is expired or missing, redirect to login (unless already on auth pages)
      if (!validAuthData) {
        // Wait for navigation to be ready
        if (!navigationRef.isReady()) {
          return;
        }

        const currentRoute = navigationRef.getCurrentRoute();
        const isAuthPage =
          currentRoute?.name === 'Login' ||
          currentRoute?.name === 'SignUp' ||
          currentRoute?.name === 'OTP';

        if (!isAuthPage) {
          // Check if we're on web
          if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            const authPaths = ['/login', '/signup', '/otp'];
            const isWebAuthPage = authPaths.some((authPath) => path.startsWith(authPath));

            if (!isWebAuthPage && navigationRef.isReady()) {
              navigationRef.navigate('Login');
            }
          } else {
            // React Native
            if (navigationRef.isReady()) {
              navigationRef.navigate('Login');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setAuthDataState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set auth data and save to storage
  const setAuthData = useCallback(async (data: AuthData) => {
    try {
      await saveAuthData(data);
      console.log('saveAuthData', data);
      setAuthDataState(data);
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  }, []);

  const clearAuthDataFromStorage = useCallback(async () => {
    try {
      await clearAuthData();
      setAuthDataState(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  }, []);

  // Logout - clear auth data and redirect to login
  const logout = useCallback(async () => {
    try {
      await clearAuthData();
      setAuthDataState(null);
      if (navigationRef.isReady()) {
        navigationRef.navigate('Login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  // Get access token
  const getAccessToken = useCallback((): string | null => {
    if (!authData) return null;
    // Check if token is expired before returning
    if (isTokenExpired(authData.accessTokenExpiresAt)) {
      // Token expired, clear it
      logout();
      return null;
    }
    return authData.accessToken;
  }, [authData, logout]);

  // Get business ID
  const getBusinessId = useCallback((): string | null => {
    return authData?.wydelyBusinessId || null;
  }, [authData]);

  // Check auth on mount and when navigation is ready
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    // Wait for navigation to be ready before checking auth
    const checkNavigationAndAuth = () => {
      if (navigationRef.isReady()) {
        checkAuth();
      } else {
        // Retry after a short delay if navigation isn't ready yet
        timeoutId = setTimeout(checkNavigationAndAuth, 100);
      }
    };

    checkNavigationAndAuth();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [checkAuth]);

  // Periodically check token expiration (every 30 seconds)
  useEffect(() => {
    if (!authData) return;

    const interval = setInterval(() => {
      if (authData && isTokenExpired(authData.accessTokenExpiresAt)) {
        // Token expired, clear and redirect
        logout();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [authData, logout]);

  const value: AuthContextType = {
    authData,
    isAuthenticated: !!authData && !isTokenExpired(authData.accessTokenExpiresAt),
    isLoading,
    setAuthData,
    logout,
    checkAuth,
    getAccessToken,
    getBusinessId,
    clearAuthDataFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
