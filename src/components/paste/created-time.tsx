'use client';

import { getRelativeTime } from '@/common/utils/date.util';
import { useEffect, useState } from 'react';

interface PasteCreatedTimeProps {
  /**
   * The date the paste was created.
   */
  createdAt: string;
}

export function PasteCreatedTime({ createdAt }: PasteCreatedTimeProps) {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const date = new Date(createdAt);
    setFormattedTime(getRelativeTime(date));
  }, [createdAt]);

  return <p>{formattedTime}</p>;
}
