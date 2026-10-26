import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  username: string;
  role: 'superadmin' | 'admin' | 'manager';
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_EXPIRED_EVENT = 'sks:admin-session-expired';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const clearSession = () => {
      localStorage.removeItem('sks_admin_token');
      localStorage.removeItem('sks_admin_user');
      if (active) {
        setToken(null);
        setUser(null);
      }
    };
    const onSessionExpired = () => clearSession();
    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);

    const restoreSession = async () => {
      const savedToken = localStorage.getItem('sks_admin_token');
      if (!savedToken) {
        localStorage.removeItem('sks_admin_user');
        if (active) setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/session', {
          headers: { Authorization: 'Bearer ' + savedToken },
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Administrator session is invalid.');
        const data = await response.json();
        if (!data?.user) throw new Error('Administrator session is invalid.');
        if (active) {
          setToken(savedToken);
          setUser(data.user);
          localStorage.setItem('sks_admin_user', JSON.stringify(data.user));
        }
      } catch {
        clearSession();
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void restoreSession();
    return () => {
      active = false;
      window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    };
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('sks_admin_token', newToken);
    localStorage.setItem('sks_admin_user', JSON.stringify(newUser));
  };

  const logout = () => {
    const tokenToRevoke = token;
    setToken(null);
    setUser(null);
    localStorage.removeItem('sks_admin_token');
    localStorage.removeItem('sks_admin_user');

    if (tokenToRevoke) {
      void fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + tokenToRevoke },
      }).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token && !!user,
        user,
        token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
