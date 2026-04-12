"use client";
import { Eye, Check, X, Phone, Mail } from 'lucide-react';

const statusStyles = {
  PENDING: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  APPROVED: 'bg-green-50 text-green-600 border-green-200',
  REJECTED: 'bg-red-50 text-red-600 border-red-200',
};

export default function BookingTable({ bookings, onAction, onView }) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Student Details</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Batch & Seat</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-bold text-primary group-hover:text-secondary transition-colors">{b.name}</p>
                  <div className="flex gap-3 mt-1 text-[10px] text-gray-400 font-bold">
                    <span className="flex items-center gap-1"><Phone size={10} /> {b.mobile}</span>
                    <span className="flex items-center gap-1"><Mail size={10} /> {b.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-black text-gray-600">{b.batchName}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Seat #{b.seatNumber}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${statusStyles[b.status]}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onView(b)} className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-primary hover:text-white transition-all shadow-sm">
                      <Eye size={14} />
                    </button>
                    {b.status === 'PENDING' && (
                      <>
                        <button onClick={() => onAction(b.id, 'APPROVED')} className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all shadow-sm">
                          <Check size={14} />
                        </button>
                        <button onClick={() => onAction(b.id, 'REJECTED')} className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all shadow-sm">
                          <X size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
