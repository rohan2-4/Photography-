import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'ADMIN' && user.role !== 'PHOTOGRAPHER')) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#08090D] flex text-slate-100">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
