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

export async function POST(req) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { seatId, batchId, name, mobile, email, address } = await req.json();
    
    // 1. Check if seat is available
    const seats = await query('SELECT status FROM Seat WHERE id = ?', [seatId]);
    if (!seats.length) return NextResponse.json({ error: "Seat not found" }, { status: 404 });
    if (seats[0].status !== "AVAILABLE") return NextResponse.json({ error: "Seat already taken" }, { status: 400 });

    // 2. Create Booking (Approved status)
    const bookingResult = await query(
      'INSERT INTO Booking (batchId, seatId, name, mobile, email, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [batchId, seatId, name, mobile, email, address, "APPROVED"]
    );

    // 3. Update Seat Status
    await query('UPDATE Seat SET status = "BOOKED" WHERE id = ?', [seatId]);

    return NextResponse.json({ message: "Seat assigned successfully", bookingId: bookingResult.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
