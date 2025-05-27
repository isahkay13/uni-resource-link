
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import RoleBadge from './RoleBadge';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md h-16 flex items-center px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-university-primary flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          {!isMobile && <span className="text-xl font-bold text-university-primary">StudyConnect</span>}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/channels" className="text-gray-700 hover:text-university-primary transition-colors">
            Channels
          </Link>
          <Link to="/chats" className="text-gray-700 hover:text-university-primary transition-colors">
            Messages
          </Link>
          <Link to="/assignments" className="text-gray-700 hover:text-university-primary transition-colors">
            Assignments
          </Link>
          <Link to="/tutorials" className="text-gray-700 hover:text-university-primary transition-colors">
            Tutorials
          </Link>
          <Link to="/files" className="text-gray-700 hover:text-university-primary transition-colors">
            Files
          </Link>
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="font-medium">{user.name}</span>
                <RoleBadge role={user.role} />
              </div>
              <span className="text-xs text-gray-500">
                {user.role === 'student' ? user.universityId : user.email}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-university-secondary text-white font-medium">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
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
