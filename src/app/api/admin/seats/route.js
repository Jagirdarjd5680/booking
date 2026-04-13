import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "gog_secret_key_2026";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const seats = await query(`
      SELECT s.*, b.name as batchName, b.timing as batchTiming 
      FROM Seat s
      JOIN Batch b ON s.batchId = b.id
      ORDER BY s.batchId ASC, s.seatNumber ASC
    `);
    
    // Get latest approved booking for each seat to show student name
    const bookings = await query(`
      SELECT b1.* FROM Booking b1
      INNER JOIN (
        SELECT seatId, MAX(createdAt) as max_date
        FROM Booking
        WHERE status = 'APPROVED'
        GROUP BY seatId
      ) b2 ON b1.seatId = b2.seatId AND b1.createdAt = b2.max_date
    `);

    const formatted = seats.map(s => ({
      ...s,
      batch: { id: s.batchId, name: s.batchName, timing: s.batchTiming },
      bookings: bookings.filter(bk => bk.seatId === s.id)
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { batchId, seatNumber, type, count } = await req.json();
    
    if (count > 1) {
      for (let i = 0; i < count; i++) {
        const num = parseInt(seatNumber) + i;
        await query('INSERT IGNORE INTO Seat (batchId, seatNumber, type) VALUES (?, ?, ?)', 
          [batchId, num, type || "MAIN"]);
      }
      return NextResponse.json({ message: "Bulk seats added" });
    } else {
      const result = await query('INSERT INTO Seat (batchId, seatNumber, type) VALUES (?, ?, ?)', 
        [batchId, seatNumber, type || "MAIN"]);
      return NextResponse.json({ id: result.insertId });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
