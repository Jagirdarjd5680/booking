import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'gog_secret_key_2026';

async function verifyAdmin(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const bookings = await query(`
      SELECT b.*, bt.name as batchName, bt.timing, s.seatNumber
      FROM Booking b
      JOIN Batch bt ON b.batchId = bt.id
      JOIN Seat s ON b.seatId = s.id
      ORDER BY b.createdAt DESC
    `);
    return NextResponse.json(bookings);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
