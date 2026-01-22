'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  preferences: {
    categories: string[];
    eligibility: string[];
    scheme_types?: string[];
    income_level?: string;
    min_age?: number;
    max_age?: number;
    location?: string;
    occupation?: string;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePreferences: (preferences: User['preferences']) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to safely parse JSON from localStorage
const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  try {
    const storedUser = localStorage.getItem('sayan_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('sayan_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sayan_user');
    }
  }, [user]);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip server check if we already have user data in localStorage
        if (user) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important: include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!name || name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include', // Important: include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Logout failed');
      }

      setUser(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred during logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences: User['preferences']) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update preferences');
      }

      setUser(data.user);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 