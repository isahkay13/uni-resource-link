
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Book, File } from 'lucide-react';

const MobileNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 md:hidden bg-white border-t border-gray-200 h-16">
      <div className="flex items-center justify-around h-full">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            currentPath === '/' ? 'text-university-primary' : 'text-gray-500'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/channels" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            currentPath.includes('/channels') ? 'text-university-primary' : 'text-gray-500'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs mt-1">Channels</span>
        </Link>
        
        <Link 
          to="/tutorials" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            currentPath.includes('/tutorials') ? 'text-university-primary' : 'text-gray-500'
          }`}
        >
          <Book className="h-5 w-5" />
          <span className="text-xs mt-1">Tutorials</span>
        </Link>
        
        <Link 
          to="/files" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            currentPath.includes('/files') ? 'text-university-primary' : 'text-gray-500'
          }`}
        >
          <File className="h-5 w-5" />
          <span className="text-xs mt-1">Files</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
