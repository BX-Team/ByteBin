'use client';

import { getRelativeTime } from '@/common/utils/date.util';
import { useEffect, useState } from 'react';

type PasteCreatedTimeProps = {
  /**
   * The date the paste was created.
   */
  createdAt: string;
};

export function PasteCreatedTime({ createdAt }: PasteCreatedTimeProps) {
  const [relativeTime, setRelativeTime] = useState<string>('');

  useEffect(() => {
    try {
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) {
        setRelativeTime('Invalid date');
        return;
      }
      setRelativeTime(getRelativeTime(date));
    } catch (error) {
      setRelativeTime('Invalid date');
    }
  }, [createdAt]);

  return <p className='text-xs'>{relativeTime}</p>;
}
