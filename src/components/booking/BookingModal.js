"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, children }) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Panel */}
            <Dialog.Content asChild forceMount>
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="relative w-full max-w-[700px] bg-white rounded-t-[32px] sm:rounded-[32px] p-6 pb-10 shadow-2xl"
                >
                  {/* Accessibility Title & Description */}
                  <Dialog.Title className="sr-only">
                    Seat Booking Form
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Fill in your details to book a seat at the institute.
                  </Dialog.Description>

                  {/* Handle bar for mobile bottom sheet feel */}
                  <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />

                  {/* Close button */}
                  <Dialog.Close asChild>
                    <button
                      onClick={onClose}
                      className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </Dialog.Close>

                  {children}
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
