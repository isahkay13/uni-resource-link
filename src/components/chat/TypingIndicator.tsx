
import React from 'react';
import { Loader2 } from 'lucide-react';

interface TypingIndicatorProps {
  name: string;
}

const TypingIndicator = ({ name }: TypingIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
      <Loader2 className="h-3 w-3 animate-spin" />
      <span>{name} is typing...</span>
    </div>
  );
};

export default TypingIndicator;
