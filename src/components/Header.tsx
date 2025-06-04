
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
import UserMenu from './UserMenu';

const Header: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 shadow-md h-16 flex items-center px-4 border-b dark:border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-university-primary flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          {!isMobile && <span className="text-xl font-bold text-university-primary dark:text-university-primary">StudyConnect</span>}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/channels" className="text-gray-700 dark:text-gray-300 hover:text-university-primary dark:hover:text-university-primary transition-colors">
            Channels
          </Link>
          <Link to="/chats" className="text-gray-700 dark:text-gray-300 hover:text-university-primary dark:hover:text-university-primary transition-colors">
            Messages
          </Link>
          <Link to="/assignments" className="text-gray-700 dark:text-gray-300 hover:text-university-primary dark:hover:text-university-primary transition-colors">
            Assignments
          </Link>
          <Link to="/tutorials" className="text-gray-700 dark:text-gray-300 hover:text-university-primary dark:hover:text-university-primary transition-colors">
            Tutorials
          </Link>
          <Link to="/files" className="text-gray-700 dark:text-gray-300 hover:text-university-primary dark:hover:text-university-primary transition-colors">
            Files
          </Link>
        </nav>

        {user ? (
          <UserMenu />
        ) : (
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
