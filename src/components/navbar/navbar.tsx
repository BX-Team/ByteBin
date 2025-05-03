import { HomeButton } from '@/components/navbar/home-button';
import { ReactNode } from 'react';

type NavbarProps = {
  /**
   * Additional buttons to display when logged in.
   */
  loggedInButtons?: ReactNode;
};

export async function Navbar({ loggedInButtons }: NavbarProps) {
  return (
    <div>
      <div className='min-h-[40px] p-1.5 px-2 bg-background-secondary flex justify-between items-center h-full'>
        <div className='flex items-center gap-1'>
          <div className='flex flex-row gap-3 items-center'>
            <HomeButton />
          </div>
        </div>
      </div>
    </div>
  );
}
