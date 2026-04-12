"use client";
import { useState } from 'react';
import { toast } from 'sonner';
import { User, Phone, Mail, MapPin, Loader2 } from 'lucide-react';

const InputField = ({ icon: Icon, label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
      <input
        {...props}
        className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none text-sm transition-all font-medium"
      />
    </div>
  </div>
);

export default function BookingForm({ seat, batch, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      toast.error('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, batchId: batch.id, seatId: seat.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success('🎉 Seat requested! Admin will review your booking.', { duration: 5000 });
      onSuccess(seat.id);
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1.5 rounded-full mb-3">
          Batch: {batch.name} · Seat {seat.seatNumber}
        </div>
        <h2 className="text-2xl font-black text-primary leading-tight">Reserve Your Seat</h2>
        <p className="text-xs text-gray-400 mt-1">Fill in your details to request this seat</p>
      </div>

      <div className="space-y-4">
        <InputField icon={User} label="Full Name" name="name" required placeholder="Your full name" value={formData.name} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-3">
          <InputField icon={Phone} label="Mobile" name="mobile" required type="tel" maxLength={10} placeholder="9876543210" value={formData.mobile} onChange={handleChange} />
          <InputField icon={Mail} label="Email" name="email" required type="email" placeholder="you@email.com" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Address</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-3.5 text-gray-300" />
            <textarea
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder="Your residential address"
              className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none text-sm transition-all font-medium resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onCancel} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-sm font-bold text-gray-400 hover:border-gray-200 hover:text-gray-600 transition-all">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-xl bg-primary text-secondary font-black text-sm border-2 border-secondary hover:bg-secondary hover:text-primary transition-all shadow-gold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
}
