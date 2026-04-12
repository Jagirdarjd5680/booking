"use client";
import BookingModal from '@/components/booking/BookingModal';
import { User, Phone, Mail, MapPin, Calendar, Hash } from 'lucide-react';

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100/50">
    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-secondary">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-primary">{value}</p>
    </div>
  </div>
);

export default function BookingDetailModal({ booking, isOpen, onClose }) {
  if (!booking) return null;

  return (
    <BookingModal isOpen={isOpen} onClose={onClose}>
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-black text-primary">Student Details</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Booking Info</p>
      </div>

      <div className="space-y-3">
        <DetailItem icon={User} label="Full Name" value={booking.name} />
        <div className="grid grid-cols-2 gap-3">
          <DetailItem icon={Phone} label="Mobile" value={booking.mobile} />
          <DetailItem icon={Mail} label="Email" value={booking.email} />
        </div>
        <DetailItem icon={MapPin} label="Address" value={booking.address} />
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-gray-200 mt-4">
          <div className="text-center p-3">
            <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Batch</p>
            <p className="text-xs font-black text-secondary uppercase">{booking.batchName}</p>
          </div>
          <div className="text-center p-3 border-l border-gray-100">
            <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Seat No.</p>
            <p className="text-sm font-black text-primary">#{booking.seatNumber}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
      >
        Close View
      </button>
    </BookingModal>
  );
}
