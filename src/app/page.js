"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import CenteredContainer from '@/components/layout/CenteredContainer';
import Branding from '@/components/ui/Branding';
import BatchTabs from '@/components/booking/BatchTabs';
import SeatGrid from '@/components/booking/SeatGrid';
import BookingModal from '@/components/booking/BookingModal';
import BookingForm from '@/components/booking/BookingForm';

const MY_SEAT_KEY = 'gog_my_seat';

export default function HomePage() {
  const [batches, setBatches] = useState([]);
  const [activeBatchId, setActiveBatchId] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [myBookedSeatId, setMyBookedSeatId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    const res = await fetch('/api/batches');
    const data = await res.json();
    setBatches(data);
    
    // Auto-clear stale localStorage if seat is actually AVAILABLE in DB
    const saved = localStorage.getItem(MY_SEAT_KEY);
    if (saved) {
      const seatId = Number(saved);
      let found = false;
      let isAvailable = false;
      
      data.forEach(batch => {
        const seat = batch.seats.find(s => s.id === seatId);
        if (seat) {
          found = true;
          if (seat.status === 'AVAILABLE') isAvailable = true;
        }
      });

      if (!found || isAvailable) {
        localStorage.removeItem(MY_SEAT_KEY);
        setMyBookedSeatId(null);
      }
    }

    if (!activeBatchId && data.length) setActiveBatchId(data[0].id);
    setLoading(false);
  };

  useEffect(() => {
    fetchBatches();
    const saved = localStorage.getItem(MY_SEAT_KEY);
    if (saved) setMyBookedSeatId(Number(saved));
    const interval = setInterval(fetchBatches, 15000); // auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleSeatClick = (seat) => {
    if (myBookedSeatId) {
      toast.warning('You already have a pending booking. Wait for admin approval.');
      return;
    }
    setSelectedSeat(seat);
    setModalOpen(true);
  };

  const handleBookingSuccess = (seatId) => {
    localStorage.setItem(MY_SEAT_KEY, String(seatId));
    setMyBookedSeatId(seatId);
    setModalOpen(false);
    setSelectedSeat(null);
    fetchBatches();
  };

  const activeBatch = batches.find((b) => b.id === activeBatchId);

  return (
    <CenteredContainer>
      <Branding />

      <div className="pb-20 flex-1">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <BatchTabs batches={batches} activeId={activeBatchId} onSelect={setActiveBatchId} />
            {activeBatch && (
              <SeatGrid
                seats={activeBatch.seats}
                requestedSeatId={myBookedSeatId}
                onSeatClick={handleSeatClick}
              />
            )}
          </>
        )}
      </div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedSeat && activeBatch && (
          <BookingForm
            seat={selectedSeat}
            batch={activeBatch}
            onSuccess={handleBookingSuccess}
            onCancel={() => setModalOpen(false)}
          />
        )}
      </BookingModal>
    </CenteredContainer>
  );
}
