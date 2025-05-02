'use client';

import { usePasteExpiry } from '@/providers/paste-expiry-provider';

export function Expiry() {
  const { setExpiry } = usePasteExpiry();

  // Set fixed 2-week expiration (14 days in seconds)
  const TWO_WEEKS = 60 * 60 * 24 * 14;
  setExpiry(TWO_WEEKS);

  return (
    <div className='flex items-center gap-1'>
      <p className='text-sm'>Expires in 2 weeks</p>
    </div>
  );
}
