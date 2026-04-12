"use client";

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';

const statusConfig = {
  AVAILABLE: { bg: 'bg-available', text: 'text-white', cursor: 'cursor-pointer', ring: 'hover:ring-2 hover:ring-available/50', hover: true },
  BOOKED:    { bg: 'bg-booked',    text: 'text-white', cursor: 'cursor-not-allowed', ring: '', hover: false },
  PENDING:   { bg: 'bg-pending',   text: 'text-primary', cursor: 'cursor-not-allowed', ring: '', hover: false },
  REQUESTED: { bg: 'bg-requested', text: 'text-white', cursor: 'cursor-default', ring: 'ring-2 ring-requested', hover: false },
};

export default function Seat({ seat, status, isRequestedByMe, onClick }) {
  const config = isRequestedByMe ? statusConfig.REQUESTED : (statusConfig[status] || statusConfig.AVAILABLE);
  const isPractice = seat.type === 'PRACTICE';
  
  // Per requirement: if requested, show "1"
  const label = isRequestedByMe ? '1' : seat.seatNumber;

  const statusLabel = isRequestedByMe ? 'Your Request (Pending)' : 
                     status === 'PENDING' ? 'Request' : 
                     status.charAt(0) + status.slice(1).toLowerCase();

  const seatEl = (
    <motion.div
      whileHover={config.hover ? { scale: 1.15, y: -2 } : {}}
      whileTap={config.hover ? { scale: 0.95 } : {}}
      onClick={config.hover ? onClick : undefined}
      className={`
        relative w-11 h-11 rounded-xl flex items-center justify-center
        text-[13px] font-black transition-shadow select-none
        ${config.bg} ${config.text} ${config.cursor} ${config.ring}
        ${isRequestedByMe ? 'animate-pulse' : ''}
        ${isPractice ? 'border-2 border-dashed border-white/40' : ''}
        shadow-sm
      `}
    >
      {label}
      
      {/* Request Count Badge (Yellow seats) */}
      {!isRequestedByMe && status === 'PENDING' && seat.requestCount > 0 && (
        <div className="absolute -top-2 -left-2 min-w-[18px] h-[18px] bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border border-white shadow-sm ring-1 ring-primary/20">
          {seat.requestCount}
        </div>
      )}
      {/* Seat back */}
      <div className="absolute top-0 left-0.5 right-0.5 h-1.5 rounded-t-md bg-white/20" />
      
      {/* Practice Marker */}
      {isPractice && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-[6px] text-primary font-bold">P</span>
        </div>
      )}
    </motion.div>
  );

  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{seatEl}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={6}
            className="bg-primary text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-lg z-[60] select-none"
          >
            Seat {seat.seatNumber} · {statusLabel}
            <TooltipPrimitive.Arrow className="fill-primary" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
