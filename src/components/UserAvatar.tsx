
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '../types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', showStatus = false }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };
  
  const statusSizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className={`bg-university-${user.role}`}>
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full bg-green-500 ring-2 ring-white ${statusSizeClasses[size]}`}
          aria-label="User is online"
        />
      )}
    </div>
  );
};

export default UserAvatar;
