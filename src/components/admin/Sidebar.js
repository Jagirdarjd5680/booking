"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, LogOut, Crown, ChevronRight, Calendar, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

export default function Sidebar({ onLogout, isOpen, onClose }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentBatchId = searchParams.get('batchId');
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = () => {
      fetch('/api/admin/batches')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setBatches(data);
        })
        .catch(err => console.error("Sidebar fetch error:", err));
    };

    fetchBatches();
    window.addEventListener('batchesUpdated', fetchBatches);
    return () => window.removeEventListener('batchesUpdated', fetchBatches);
  }, []);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <div className={clsx(
        "fixed inset-y-0 left-0 w-72 bg-primary flex flex-col border-r border-white/10 z-[101] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shadow-gold shrink-0">
              <Crown size={22} className="text-secondary" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-white font-black text-sm tracking-tight truncate">GOD OF GRAPHICS</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest">Administrator</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button onClick={onClose} className="lg:hidden p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-4 space-y-6">
          {/* Main Menu */}
          <div>
            <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Main Menu</p>
            <div className="space-y-1">
              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className={clsx(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                  pathname === '/admin/dashboard' && !currentBatchId ? "bg-secondary text-primary font-bold shadow-gold" : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={18} />
                  <span className="text-sm">Dashboard</span>
                </div>
                <ChevronRight size={14} className="opacity-40 group-hover:opacity-100" />
              </Link>
            </div>
          </div>

          {/* Management Menu */}
          <div className="pt-2">
            <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Management</p>
            <div className="space-y-1">
              <Link
                href="/admin/batches"
                onClick={onClose}
                className={clsx(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                  pathname === '/admin/batches' ? "bg-secondary text-primary font-bold shadow-gold" : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Calendar size={18} />
                  <span className="text-sm">Manage Batches</span>
                </div>
                <ChevronRight size={14} className="opacity-40 group-hover:opacity-100" />
              </Link>
              <Link
                href="/admin/seats"
                onClick={onClose}
                className={clsx(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                  pathname === '/admin/seats' ? "bg-secondary text-primary font-bold shadow-gold" : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span className="text-sm">Manage Seats</span>
                </div>
                <ChevronRight size={14} className="opacity-40 group-hover:opacity-100" />
              </Link>
            </div>
          </div>

          {/* Batches Menu */}
          <div className="pt-2">
            <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Filter by Batch</p>
            <div className="space-y-1">
              {batches.map((batch) => {
                const isActive = currentBatchId === String(batch.id);
                return (
                  <Link
                    key={batch.id}
                    href={`/admin/dashboard?batchId=${batch.id}`}
                    onClick={onClose}
                    className={clsx(
                      "flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group",
                      isActive ? "bg-white/10 text-secondary font-bold" : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar size={14} className={isActive ? "text-secondary" : "text-gray-600"} />
                      <span className="text-[13px]">{batch.name}</span>
                    </div>
                    <span className="text-[9px] opacity-40 font-bold">{batch.timing.split(' – ')[0]}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
