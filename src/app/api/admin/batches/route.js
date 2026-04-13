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
    const batches = await query(`
      SELECT b.*, (SELECT COUNT(*) FROM Seat s WHERE s.batchId = b.id) as seatCount 
      FROM Batch b
    `);
    // Format to match what frontend expects
    const formatted = batches.map(b => ({
      ...b,
      _count: { seats: b.seatCount }
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { name, timing } = await req.json();
    const result = await query('INSERT INTO Batch (name, timing) VALUES (?, ?)', [name, timing]);
    return NextResponse.json({ id: result.insertId, name, timing });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
