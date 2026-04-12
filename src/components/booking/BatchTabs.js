"use client";

import { motion, AnimatePresence } from 'framer-motion';
import * as RadixTabs from '@radix-ui/react-tabs';
import { Clock, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export default function BatchTabs({ batches, activeId, onSelect }) {
  return (
    <RadixTabs.Root
      value={String(activeId)}
      onValueChange={(val) => onSelect(Number(val))}
      className="mt-6 px-4"
    >
      <div className="mb-2">
        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400">Select Batch</h2>
      </div>

      <RadixTabs.List className="grid grid-cols-3 gap-2 pb-1">
        {batches.map((batch) => {
          const isFull = batch.seats.every((s) => s.status !== 'AVAILABLE');
          return (
            <RadixTabs.Trigger
              key={batch.id}
              value={String(batch.id)}
              asChild
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={clsx(
                  'relative flex flex-col items-center w-full px-2 py-2.5 rounded-xl transition-all text-center shrink-0 border-2',
                  activeId === batch.id
                    ? 'bg-primary text-secondary border-secondary shadow-gold scale-105 z-10'
                    : 'bg-white text-gray-400 border-gray-100 hover:border-secondary/30',
                  isFull && activeId !== batch.id && 'opacity-50'
                )}
              >
                <span className="text-[11px] font-black uppercase tracking-wider">{batch.name}</span>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={10} />
                  <span className="text-[9px] font-bold whitespace-nowrap opacity-70">{batch.timing.split(' – ')[0]}</span>
                </div>
                {isFull && (
                  <span className="absolute -top-1.5 -right-1.5 bg-booked text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                    FULL
                  </span>
                )}
                {activeId === batch.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-1 w-6 h-0.5 rounded-full bg-secondary"
                  />
                )}
              </motion.button>
            </RadixTabs.Trigger>
          );
        })}
      </RadixTabs.List>

      {batches.map((batch) => (
        <RadixTabs.Content key={batch.id} value={String(batch.id)} forceMount>
          <AnimatePresence mode="wait">
            {activeId === batch.id && (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Availability summary */}
                <div className="flex items-center gap-2 px-1 mt-4 mb-2">
                  <CheckCircle size={14} className="text-available" />
                  <span className="text-xs text-gray-500 font-medium">
                    {batch.seats.filter((s) => s.status === 'AVAILABLE').length} seats available in {batch.name}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
