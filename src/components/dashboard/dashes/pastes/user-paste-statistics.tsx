'use client';

import { useEffect, useState } from 'react';
import { formatNumber } from '@/common/utils/string.util';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

type UserStatistics = {
  totalPastes: number;
  totalViews: number;
};

export function UserPasteStatistics() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push('/');
          return;
        }

        const response = await fetch('/api/user/pastes/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [router, supabase]);

  return (
    <div className='flex flex-col gap-2 select-none'>
      <p className='text-sm text-muted-foreground text-center'>These are the statistics for your account.</p>
      {isLoading && !statistics && <p className='text-center'>Loading account stats...</p>}

      <div className='flex gap-2 w-full items-center justify-center'>
        {statistics && (
          <>
            <div className='flex gap-2 items-center bg-background-secondary p-1.5 rounded-md'>
              <p className='text-sm font-semibold'>Pastes Created</p>
              <p className='text-sm'>{formatNumber(statistics.totalPastes)}</p>
            </div>
            <div className='flex gap-2 items-center bg-background-secondary p-1.5 rounded-md'>
              <p className='text-sm font-semibold'>Paste Views</p>
              <p className='text-sm'>{formatNumber(statistics.totalViews)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
