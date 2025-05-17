
import React from 'react';
import { CardTitle } from '@/components/ui/card';

interface ChannelHeaderProps {
  name: string;
  description: string;
}

const ChannelHeader = ({ name, description }: ChannelHeaderProps) => {
  return (
    <>
      <CardTitle className="text-xl">{name}</CardTitle>
      <p className="text-sm text-gray-500">{description}</p>
    </>
  );
};

export default ChannelHeader;
