import { ReactNode } from 'react';
import { Navbar } from '@/components/navbar/navbar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/');
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <section>
          <Navbar loggedInButtons={<SidebarTrigger />} />
          <div className='p-2 w-full h-full'>{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
