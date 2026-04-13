"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Calendar, Clock, RefreshCw, Menu } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import { useRouter } from 'next/navigation';

export default function BatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formData, setFormData] = useState({ name: '', startTime: '09:00', endTime: '12:00' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Tool for formatting 24h to 12h AM/PM
  const to12h = (time24) => {
    if (!time24) return "";
    let [h, m] = time24.split(":");
    let hh = parseInt(h);
    const ampm = hh >= 12 ? "PM" : "AM";
    hh = hh % 12 || 12;
    return `${String(hh).padStart(2, '0')}:${m} ${ampm}`;
  };

  // Tool for parsing 12h AM/PM back to 24h for the input[type="time"]
  const to24h = (time12) => {
    if (!time12) return "09:00";
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/batches');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setBatches(data);
    } catch (error) {
      toast.error("Failed to fetch batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(editingBatch ? 'Updating...' : 'Creating...');
    try {
      const url = editingBatch ? `/api/admin/batches/${editingBatch.id}` : '/api/admin/batches';
      const timingString = `${to12h(formData.startTime)} – ${to12h(formData.endTime)}`;
      const res = await fetch(url, {
        method: editingBatch ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, timing: timingString }),
      });
      if (!res.ok) throw new Error();
      toast.success(editingBatch ? 'Updated!' : 'Created!', { id: toastId });
      setShowModal(false);
      setEditingBatch(null);
      setFormData({ name: '', startTime: '09:00', endTime: '12:00' });
      fetchBatches();
    } catch {
      toast.error('Operation failed', { id: toastId });
    }
  };

  const handleEditOpen = (batch) => {
    setEditingBatch(batch);
    const times = batch.timing.split(' – ');
    setFormData({
      name: batch.name,
      startTime: to24h(times[0]),
      endTime: to24h(times[1])
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will delete all seats and bookings in this batch!")) return;
    const toastId = toast.loading('Deleting...');
    try {
      const res = await fetch(`/api/admin/batches/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Deleted!', { id: toastId });
      fetchBatches();
    } catch {
      toast.error('Failed to delete', { id: toastId });
    }
  };

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
              <h1 className="text-xl md:text-3xl font-black text-primary tracking-tight">Batches Management</h1>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Add, Edit or Remove Batches</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={fetchBatches} className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-secondary shadow-sm transition-all">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => { setEditingBatch(null); setFormData({ name: '', startTime: '09:00', endTime: '12:00' }); setShowModal(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus size={20} />
              <span>Create Batch</span>
            </button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading batches...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <div key={batch.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-all">
                    <Calendar size={24} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => handleEditOpen(batch)}
                      className="p-2 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(batch.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-primary mb-1">{batch.name}</h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm font-bold mb-4">
                  <Clock size={14} className="text-secondary" />
                  <span>{batch.timing}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Enrollment</span>
                  <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold">
                    {batch._count?.seats || 0} Seats
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-8">
                <h2 className="text-2xl font-black text-primary mb-6">{editingBatch ? 'Edit Batch' : 'New Batch'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Batch Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Morning Batch"
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 ring-secondary/20 transition-all text-primary font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Start Time</label>
                      <input 
                        required type="time"
                        value={formData.startTime}
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 ring-secondary/20 transition-all text-primary font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">End Time</label>
                      <input 
                        required type="time"
                        value={formData.endTime}
                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 ring-secondary/20 transition-all text-primary font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {editingBatch ? 'Save Changes' : 'Create Batch'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
