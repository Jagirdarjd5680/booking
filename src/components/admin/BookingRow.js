import { Check, X, Clock, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const statusBadge = {
  PENDING:  'bg-yellow-100 text-yellow-700 border border-yellow-200',
  APPROVED: 'bg-green-100 text-green-700 border border-green-200',
  REJECTED: 'bg-red-100 text-red-700 border border-red-200',
};

export default function BookingRow({ booking, onAction, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-black text-primary">{booking.name}</p>
          <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">
            {booking.batchName} · Seat {booking.seatNumber}
          </p>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap ${statusBadge[booking.status]}`}>
          {booking.status === 'PENDING' && <Clock size={10} />}
          {booking.status === 'APPROVED' && <Check size={10} />}
          {booking.status === 'REJECTED' && <X size={10} />}
          {booking.status}
        </span>
      </div>

      {/* Contact info */}
      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 mb-3">
        <div className="flex items-center gap-1.5"><Phone size={10} /> {booking.mobile}</div>
        <div className="flex items-center gap-1.5"><Mail size={10} /> {booking.email}</div>
        <div className="flex items-center gap-1.5 col-span-2"><MapPin size={10} /> {booking.address}</div>
      </div>

      {/* Action buttons */}
      {booking.status === 'PENDING' && (
        <div className="flex gap-2">
          <button
            onClick={() => onAction(booking.id, 'APPROVED')}
            className="flex-1 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <Check size={12} /> Approve
          </button>
          <button
            onClick={() => onAction(booking.id, 'REJECTED')}
            className="flex-1 py-2 rounded-xl bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <X size={12} /> Reject
          </button>
        </div>
      )}
    </motion.div>
  );
}
