
import React from 'react';
import { UserRole } from '../types';

interface RoleBadgeProps {
  role: UserRole;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const badgeText = {
    student: 'Student',
    academic: 'Academic Staff',
    nonacademic: 'Staff'
  };

  return (
    <span className={`role-badge role-${role}`}>
      {badgeText[role]}
    </span>
  );
};

export default RoleBadge;
