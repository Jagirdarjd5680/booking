import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const batches = await query('SELECT * FROM Batch ORDER BY id ASC');
    const seats   = await query(`
      SELECT s.*, 
      (SELECT COUNT(*) FROM Booking b WHERE b.seatId = s.id AND b.status IN ('PENDING', 'APPROVED')) as requestCount
      FROM Seat s 
      ORDER BY s.seatNumber ASC
    `);

    const result = batches.map((b) => ({
      ...b,
      seats: seats.filter((s) => s.batchId === b.id),
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error('GET /api/batches error:', err);
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
  }
}
