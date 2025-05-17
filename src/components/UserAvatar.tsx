
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '../types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface UserAvatarProps {
  user: {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
  };
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  statusColor?: 'green' | 'gray' | 'amber' | 'red';
  showTooltip?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  showStatus = false,
  statusColor = 'green',
  showTooltip = false
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };
  
  const statusSizeClasses = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };
  
  const statusColorClasses = {
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500'
  };

  const getStatusLabel = () => {
    switch (statusColor) {
      case 'green': return 'online';
      case 'amber': return 'away';
      case 'red': return 'busy';
      case 'gray': return 'offline';
      default: return 'unknown';
    }
  };

  const getAvatarColor = () => {
    switch (user.role) {
      case 'student':
        return 'bg-blue-500';
      case 'academic':
        return 'bg-purple-500';
      case 'nonacademic':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  const avatarContent = (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} ring-2 ring-white`}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className={getAvatarColor()}>
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full ${statusColorClasses[statusColor]} ring-2 ring-white ${statusSizeClasses[size]}`}
          aria-label={`User is ${getStatusLabel()}`}
        />
      )}
    </div>
  );

  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {avatarContent}
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{user.name}</p>
          <p className="text-xs capitalize">{user.role}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return avatarContent;
};

export default UserAvatar;
