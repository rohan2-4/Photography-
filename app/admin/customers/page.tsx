import { Users, Mail, Phone, Calendar, IndianRupee } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      bookings: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Client Relations
          </span>
          <h1 className="text-3xl font-serif font-bold text-white">
            Customer Directory & History
          </h1>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-[#12141D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Email Contact</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Total Bookings</th>
                <th className="py-3.5 px-4">Total Spending</th>
                <th className="py-3.5 px-4">Last Booking Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {users.map((user) => {
                const totalSpent = user.bookings.reduce((sum, b) => sum + b.paidAmount, 0);
                const lastBooking = user.bookings[0];
                const lastDate = lastBooking
                  ? new Date(lastBooking.createdAt).toLocaleDateString('en-IN')
                  : 'No Bookings';

                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-semibold text-white">
                      {user.name}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {user.email}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono">
                      {user.phone || 'N/A'}
                    </td>
                    <td className="py-4 px-4 font-bold text-amber-300">
                      {user.bookings.length} Events
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-400">
                      ₹{totalSpent.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {lastDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
