import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { batchId, seatId, name, mobile, email, address } = await request.json();

    // Check if user has already booked (any seat, any batch) using same mobile or email
    const existing = await query(
      'SELECT id FROM Booking WHERE (mobile = ? OR email = ?) AND status IN ("PENDING", "APPROVED")',
      [mobile, email]
    );

    if (existing.length > 0) {
      return NextResponse.json({ 
        error: 'This Mobile number or Email is already used for a booking.' 
      }, { status: 400 });
    }

    // Check if seat is already permanently BOOKED
    const [seat] = await query('SELECT status FROM Seat WHERE id = ?', [seatId]);
    if (seat.status === 'BOOKED') {
      return NextResponse.json({ error: 'This seat is already fully booked' }, { status: 400 });
    }

    // Mark seat as PENDING (status stays PENDING if more people request)
    await query('UPDATE Seat SET status = "PENDING" WHERE id = ?', [seatId]);

    // Insert booking record
    const insertResult = await query(
      'INSERT INTO Booking (batchId, seatId, name, mobile, email, address, status) VALUES (?,?,?,?,?,?,?)',
      [batchId, seatId, name, mobile, email, address, 'PENDING']
    );

    return NextResponse.json({ success: true, bookingId: insertResult.insertId });
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    return NextResponse.json({ error: 'Failed to submit booking. Please try again.' }, { status: 500 });
  }
}
