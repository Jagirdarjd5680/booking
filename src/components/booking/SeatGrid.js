"use client";

import { motion } from 'framer-motion';
import Seat from './Seat';

const LEGEND = [
  { color: 'bg-available', label: 'Available' },
  { color: 'bg-booked',    label: 'Booked' },
  { color: 'bg-pending',   label: 'Request' },
  { color: 'bg-requested', label: 'Yours' },
];

export default function SeatGrid({ seats, requestedSeatId, onSeatClick }) {
  const mainSeats = seats.filter(s => s.type === 'MAIN');
  const practiceSeats = seats.filter(s => s.type === 'PRACTICE');

  return (
    <div className="mx-4 mt-4">
      {/* Legend */}
      <div className="flex justify-center gap-3 flex-wrap mb-5">
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-[10px] font-semibold text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
        {/* Main Seats Section */}
        <div className="mb-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4 text-center">
            Main Training Area (7 Seats)
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {mainSeats.map((seat) => (
              <Seat
                key={seat.id}
                seat={seat}
                status={seat.status}
                isRequestedByMe={requestedSeatId === seat.id}
                onClick={() => onSeatClick(seat)}
              />
            ))}
          </div>
        </div>

        {/* Divider / Walkway */}
        <div className="h-0.5 w-full bg-gray-50 mb-6" />

        {/* Practice Seats Section */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4 text-center">
            Practice Zone (4 Seats)
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {practiceSeats.map((seat) => (
              <Seat
                key={seat.id}
                seat={seat}
                status={seat.status}
                isRequestedByMe={requestedSeatId === seat.id}
                onClick={() => onSeatClick(seat)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
