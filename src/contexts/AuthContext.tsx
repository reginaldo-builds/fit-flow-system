import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Tenant } from '@/types';
import { authenticateUser } from '@/data/mockData';
import { useTenant } from './TenantContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { tenant } = useTenant();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('gymfit_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Verify user belongs to current tenant
        if (!tenant || parsedUser.tenantId === tenant.id) {
          setUser(parsedUser);
        } else {
          // Clear user if tenant doesn't match
          localStorage.removeItem('gymfit_user');
        }
      } catch {
        localStorage.removeItem('gymfit_user');
      }
    }
    setIsLoading(false);
  }, [tenant]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!tenant) {
      return false;
    }

    const authenticatedUser = authenticateUser(email, password, tenant.id);
    
    if (authenticatedUser) {
      setUser(authenticatedUser);
      localStorage.setItem('gymfit_user', JSON.stringify(authenticatedUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gymfit_user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
