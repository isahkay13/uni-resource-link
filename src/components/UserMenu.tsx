
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Shield, 
  Moon, 
  Sun, 
  HelpCircle, 
  User, 
  Bell, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import RoleBadge from './RoleBadge';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handlePrivacy = () => {
    navigate('/settings');
  };

  const handleHelp = () => {
    toast.info('Help center coming soon!');
  };

  const handleNotifications = () => {
    navigate('/settings');
  };

  const handleProfile = () => {
    navigate('/settings');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-university-secondary text-white font-medium text-sm">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="hidden md:flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{user.name}</span>
              <RoleBadge role={user.role} />
            </div>
            <span className="text-xs text-gray-500">
              {user.role === 'student' ? user.universityId : user.email}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleNotifications}>
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handlePrivacy}>
          <Shield className="mr-2 h-4 w-4" />
          <span>Privacy & Security</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          <span>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleHelp}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
