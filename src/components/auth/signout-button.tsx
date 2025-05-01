'use client';

import { Button } from '@/components/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export function SignoutButton() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
