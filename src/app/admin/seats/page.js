"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Search, Filter, RefreshCw, UserPlus, BookOpen, PenTool, Menu } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function SeatsPage() {
  const router = useRouter();
  const [seats, setSeats] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('ALL');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  const [editingSeat, setEditingSeat] = useState(null);
  const [assigningSeat, setAssigningSeat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [formData, setFormData] = useState({ batchId: '', seatNumber: '', type: 'MAIN', count: 1 });
  const [assignData, setAssignData] = useState({ name: '', mobile: '', email: '', address: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [seatsRes, batchesRes] = await Promise.all([
        fetch('/api/admin/seats'),
        fetch('/api/admin/batches')
      ]);
      
      if (seatsRes.status === 401) { router.push('/admin/login'); return; }
      
      const seatsData = await seatsRes.json();
      const batchesData = await batchesRes.json();
      
      setSeats(seatsData);
      setBatches(batchesData);
      if (batchesData.length > 0 && (batchFilter === 'ALL' || !formData.batchId)) {
        setBatchFilter(String(batchesData[0].id));
        setFormData(prev => ({ ...prev, batchId: batchesData[0].id }));
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Adding...');
    try {
      const res = await fetch('/api/admin/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success('Added successfully!', { id: toastId });
      setShowAddModal(false);
      setFormData({ ...formData, seatNumber: '', count: 1 });
      fetchData();
    } catch {
      toast.error('Failed to add', { id: toastId });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Updating...');
    try {
      const res = await fetch(`/api/admin/seats/${editingSeat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          seatNumber: editingSeat.seatNumber,
          type: editingSeat.type,
          status: editingSeat.status
        }),
      });
      if (!res.ok) throw new Error();
      toast.success('Updated!', { id: toastId });
      setShowEditModal(false);
      fetchData();
    } catch {
      toast.error('Update failed', { id: toastId });
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Assigning seat...');
    try {
      const res = await fetch('/api/admin/seats/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...assignData,
          seatId: assigningSeat.id,
          batchId: assigningSeat.batchId
        }),
      });
      if (!res.ok) throw new Error();
      toast.success('Seat assigned!', { id: toastId });
      setShowAssignModal(false);
      setAssignData({ name: '', mobile: '', email: '', address: '' });
      fetchData();
    } catch {
      toast.error('Assignment failed', { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will delete all booking history for this seat!")) return;
    const toastId = toast.loading('Deleting...');
    try {
      const res = await fetch(`/api/admin/seats/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Deleted!', { id: toastId });
      fetchData();
    } catch {
      toast.error('Delete failed', { id: toastId });
    }
  };

  const filteredSeats = seats.filter(s => {
    const matchSearch = String(s.seatNumber).includes(search);
    const matchBatch = batchFilter === 'ALL' || String(s.batchId) === batchFilter;
    return matchSearch && matchBatch;
  });

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
              <h1 className="text-xl md:text-3xl font-black text-primary tracking-tight">Seats Management</h1>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Configure layout and assign students</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={fetchData} className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-secondary shadow-sm transition-all">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus size={20} />
              <span>Add Seats</span>
            </button>
          </div>
        </header>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search seat number in this batch..." 
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 text-sm font-medium outline-none focus:ring-2 ring-secondary/20 transition-all" 
              />
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-2xl border border-gray-100 overflow-x-auto no-scrollbar max-w-full">
              {batches.map((b) => {
                const isActive = batchFilter === String(b.id);
                return (
                  <button
                    key={b.id}
                    onClick={() => setBatchFilter(String(b.id))}
                    className={clsx(
                      "px-5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap",
                      isActive 
                        ? "bg-primary text-white shadow-lg" 
                        : "text-gray-400 hover:text-primary hover:bg-white"
                    )}
                  >
                    {b.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold">Loading layout...</div>
        ) : filteredSeats.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Plus className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2">No seats found in this batch</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-secondary text-primary font-black text-xs rounded-xl shadow-gold hover:scale-105 transition-all"
            >
              Configure Seats
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
            {filteredSeats.map((seat) => (
              <div 
                key={seat.id} 
                className={clsx(
                  "relative aspect-square rounded-[20px] transition-all p-2 flex flex-col items-center justify-center group",
                  seat.status === 'AVAILABLE' ? "bg-white border border-gray-100 hover:border-secondary/30 shadow-sm" : "bg-primary border border-primary shadow-lg",
                )}
              >
                <span className={clsx(
                  "text-lg md:text-2xl font-black mb-0.5",
                  seat.status === 'AVAILABLE' ? "text-primary" : "text-white"
                )}>
                  {seat.seatNumber}
                </span>
                <span className={clsx(
                  "text-[7px] md:text-[9px] font-black uppercase tracking-widest",
                  seat.status === 'AVAILABLE' ? "text-gray-400" : "text-secondary"
                )}>
                  {seat.type === 'MAIN' ? 'READ' : 'PRAC'}
                </span>

                {/* Info badge */}
                <div className="mt-1 flex flex-col items-center">
                  <span className={clsx(
                    "text-[7px] md:text-[8px] font-bold truncate max-w-full px-1",
                    seat.status === 'AVAILABLE' ? "text-available" : "text-white/60"
                  )}>
                    {seat.status === 'AVAILABLE' ? 'READY' : (seat.bookings?.[0]?.name?.split(' ')[0] || 'BKD')}
                  </span>
                </div>

                {/* Batch label */}
                <div className="absolute top-2 left-3">
                  <span className="text-[7px] font-black text-gray-300 uppercase">{seat.batch?.name?.split(' ')[0]}</span>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/80 rounded-[24px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all backdrop-blur-[2px]">
                   <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditingSeat(seat); setShowEditModal(true); }}
                      className="p-2 rounded-xl bg-white/10 text-white hover:bg-secondary hover:text-primary transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(seat.id)}
                      className="p-2 rounded-xl bg-white/10 text-red-400 hover:bg-red-400 hover:text-white transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                   </div>
                   {seat.status === 'AVAILABLE' && (
                     <button 
                      onClick={() => { setAssigningSeat(seat); setShowAssignModal(true); }}
                      className="mt-1 flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-[10px] font-black text-primary hover:scale-105 transition-all"
                     >
                       <UserPlus size={10} />
                       ASSIGN
                     </button>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
              <h2 className="text-2xl font-black text-primary mb-6">Add New Seats</h2>
              <form onSubmit={handleAddSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Select Batch</label>
                  <select 
                    value={formData.batchId}
                    onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold"
                  >
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Start Number (Order)</label>
                    <input 
                      required type="number"
                      value={formData.seatNumber}
                      onChange={e => setFormData({ ...formData, seatNumber: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold"
                      placeholder="e.g. 1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Number of Seats</label>
                    <input 
                      required type="number" min="1" max="50"
                      value={formData.count}
                      onChange={e => setFormData({ ...formData, count: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Seat Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'MAIN' })}
                      className={clsx(
                        "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold transition-all",
                        formData.type === 'MAIN' ? "border-secondary bg-secondary/5 text-secondary" : "border-gray-50 bg-gray-50 text-gray-400"
                      )}
                    >
                      <BookOpen size={18} /> Reading
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'PRACTICE' })}
                      className={clsx(
                        "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold transition-all",
                        formData.type === 'PRACTICE' ? "border-secondary bg-secondary/5 text-secondary" : "border-gray-50 bg-gray-50 text-gray-400"
                      )}
                    >
                      <PenTool size={18} /> Practice
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-bold text-gray-400">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-black/10">Add Seats</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingSeat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
            <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl p-8">
              <h2 className="text-2xl font-black text-primary mb-6">Edit Seat {editingSeat.seatNumber}</h2>
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Seat Number (Order)</label>
                  <input 
                    required type="number"
                    value={editingSeat.seatNumber}
                    onChange={e => setEditingSeat({ ...editingSeat, seatNumber: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Type</label>
                  <select 
                    value={editingSeat.type}
                    onChange={e => setEditingSeat({ ...editingSeat, type: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold"
                  >
                    <option value="MAIN">Reading</option>
                    <option value="PRACTICE">Practice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
                  <select 
                    value={editingSeat.status}
                    onChange={e => setEditingSeat({ ...editingSeat, status: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="BOOKED">Booked (Manually)</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 font-bold text-gray-400">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {showAssignModal && assigningSeat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
            <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-8 overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black text-2xl">
                  {assigningSeat.seatNumber}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary leading-none">Assign Student</h2>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Batch: {assigningSeat.batch?.name}</p>
                </div>
              </div>
              <form onSubmit={handleAssignSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Student Name</label>
                    <input 
                      required
                      value={assignData.name}
                      onChange={e => setAssignData({ ...assignData, name: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                    <input 
                      required
                      value={assignData.mobile}
                      onChange={e => setAssignData({ ...assignData, mobile: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold"
                      placeholder="10 digit number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    required type="email"
                    value={assignData.email}
                    onChange={e => setAssignData({ ...assignData, email: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Address</label>
                  <textarea 
                    rows="3"
                    value={assignData.address}
                    onChange={e => setAssignData({ ...assignData, address: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold resize-none"
                    placeholder="Full Address"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 py-4 font-bold text-gray-400">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-gold">Confirm Assignment</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
