import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tenant } from '@/types';
import { getTenantBySlug } from '@/data/mockData';

interface TenantContextType {
  tenant: Tenant | null;
  slug: string | null;
  isLoading: boolean;
  error: string | null;
  setTenant: (tenant: Tenant | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    
    // Check if we're on a tenant route (first segment is the slug)
    if (pathParts.length > 0) {
      const potentialSlug = pathParts[0];
      
      // Skip if it's a known non-tenant route
      const nonTenantRoutes = ['admin', 'personal', 'student', 'login'];
      if (!nonTenantRoutes.includes(potentialSlug)) {
        const foundTenant = getTenantBySlug(potentialSlug);
        
        if (foundTenant) {
          setTenant(foundTenant);
          setSlug(potentialSlug);
          setError(null);
        } else if (potentialSlug !== '') {
          // Only set error if we're trying to access a tenant route
          setTenant(null);
          setSlug(potentialSlug);
          // Don't set error for home page
        }
      }
    } else {
      // Home page - no tenant
      setTenant(null);
      setSlug(null);
      setError(null);
    }
    
    setIsLoading(false);
  }, [location.pathname]);

  return (
    <TenantContext.Provider value={{ tenant, slug, isLoading, error, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
};
