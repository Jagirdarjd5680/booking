import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'gog_secret_key_2026';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

export async function PATCH(request, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const { status } = await request.json(); // 'APPROVED' or 'REJECTED'

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get booking to find the seat
    const bookings = await query('SELECT * FROM Booking WHERE id = ?', [id]);
    if (!bookings.length) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const booking = bookings[0];
    const newSeatStatus = status === 'APPROVED' ? 'BOOKED' : 'AVAILABLE';

    // Update booking status
    await query('UPDATE Booking SET status = ? WHERE id = ?', [status, id]);
    // Update seat status
    await query('UPDATE Seat SET status = ? WHERE id = ?', [newSeatStatus, booking.seatId]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PATCH booking error:', err);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
