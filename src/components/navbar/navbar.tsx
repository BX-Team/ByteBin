import { HomeButton } from '@/components/navbar/home-button';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/button';
import { SignoutButton } from '@/components/auth/signout-button';
import { ReactNode } from 'react';

type NavbarProps = {
  /**
   * Additional buttons to display when logged in.
   */
  loggedInButtons?: ReactNode;
};

export async function Navbar({ loggedInButtons }: NavbarProps) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div>
      <div className='min-h-[40px] p-1.5 px-2 bg-background-secondary flex justify-between items-center h-full'>
        <div className='flex items-center gap-1'>
          {session && loggedInButtons}
          <div className='flex flex-row gap-3 items-center'>
            <HomeButton />
          </div>
        </div>

        <div className='flex gap-2 items-center'>
          {!session ? (
            <>
              <Link href='/auth/login'>
                <Button>Login</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href='/dashboard'>
                <Button>Dashboard</Button>
              </Link>
              <SignoutButton />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
