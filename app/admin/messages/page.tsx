import { MessageSquare, Mail, Phone, Calendar } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Inquiries & Consultations
          </span>
          <h1 className="text-3xl font-serif font-bold text-white">
            Client Contact Messages ({messages.length})
          </h1>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 bg-[#12141D] rounded-2xl border border-white/10">
          <p className="text-xs text-slate-400">No contact messages received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => {
            const dateStr = new Date(msg.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg.id}
                className="bg-[#12141D] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl hover:border-amber-500/30 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-base font-serif font-bold text-white">{msg.name}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-0.5">
                      <span>Email: {msg.email}</span>
                      <span>Phone: {msg.phone}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-amber-400 block font-mono">{dateStr}</span>
                    {msg.eventType && (
                      <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full inline-block mt-1">
                        Category: {msg.eventType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed">
                  {msg.message}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
