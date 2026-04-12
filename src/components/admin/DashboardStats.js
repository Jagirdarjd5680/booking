import { CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';

const STATS = [
  { key: 'total',    label: 'Total',    icon: TrendingUp,    color: 'bg-gray-100 text-gray-600' },
  { key: 'pending',  label: 'Pending',  icon: Clock,         color: 'bg-yellow-50 text-yellow-600' },
  { key: 'approved', label: 'Approved', icon: CheckCircle2,  color: 'bg-green-50 text-green-600' },
  { key: 'rejected', label: 'Rejected', icon: XCircle,       color: 'bg-red-50 text-red-600' },
];

export default function DashboardStats({ bookings }) {
  const stats = {
    total:    bookings.length,
    pending:  bookings.filter((b) => b.status === 'PENDING').length,
    approved: bookings.filter((b) => b.status === 'APPROVED').length,
    rejected: bookings.filter((b) => b.status === 'REJECTED').length,
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {STATS.map(({ key, label, icon: Icon, color }) => (
        <div key={key} className={`rounded-2xl p-4 flex items-center gap-3 ${color} bg-opacity-50`}>
          <div className="opacity-80">
            <Icon size={22} />
          </div>
          <div>
            <p className="text-2xl font-black leading-none">{stats[key]}</p>
            <p className="text-xs font-semibold opacity-70 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
