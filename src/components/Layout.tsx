
import React from 'react';
import Header from './Header';
import MobileNav from './MobileNav';
import { useIsMobile } from '../hooks/use-mobile';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className={`${isAuthenticated && isMobile ? 'pb-16' : ''}`}>
        {children}
      </main>
      {isAuthenticated && isMobile && <MobileNav />}
    </div>
  );
};

export default Layout;
