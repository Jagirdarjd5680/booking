"use client";

import { useState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';
import { Search, RefreshCw, Menu } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import DashboardStats from '@/components/admin/DashboardStats';
import BookingTable from '@/components/admin/BookingTable';
import BookingDetailModal from '@/components/admin/BookingDetailModal';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBatchId = searchParams.get('batchId');
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [viewingBooking, setViewingBooking] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/bookings');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (id, status) => {
    const toastId = toast.loading('Applying...');
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success('Updated successfully!', { id: toastId });
      fetchBookings();
    } catch {
      toast.error('Failed to update', { id: toastId });
    }
  };

  const filtered = bookings.filter((b) => {
    const searchStr = `${b.name} ${b.mobile} ${b.email} ${b.batchName}`.toLowerCase();
    const matchSearch = searchStr.includes(search.toLowerCase());
    const matchStatus = filter === 'ALL' || b.status === filter;
    const matchBatch = !currentBatchId || String(b.batchId) === currentBatchId;
    return matchSearch && matchStatus && matchBatch;
  });

  const activeBatchName = currentBatchId ? bookings.find(b => String(b.batchId) === currentBatchId)?.batchName : 'All Batches';

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      <Sidebar 
        onLogout={() => router.push('/admin/login')} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <main className="flex-1 p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 rounded-2xl bg-white border border-gray-100 text-primary shadow-sm"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-primary tracking-tight">{activeBatchName}</h1>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Booking Overview</p>
            </div>
          </div>
          <button onClick={fetchBookings} className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-secondary shadow-sm">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </header>
        <DashboardStats bookings={bookings.filter(b => !currentBatchId || String(b.batchId) === currentBatchId)} />
        <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Quick search..." className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border-none text-sm font-medium outline-none" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-6 py-3.5 rounded-2xl bg-gray-50 border-none text-sm font-black outline-none">
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        {!loading && (
          <BookingTable bookings={filtered} onAction={handleAction} onView={setViewingBooking} />
        )}
      </main>
      <BookingDetailModal booking={viewingBooking} isOpen={!!viewingBooking} onClose={() => setViewingBooking(null)} />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
