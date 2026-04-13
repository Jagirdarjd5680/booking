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

export async function PATCH(req, { params }) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const { name, timing } = await req.json();
    await query('UPDATE Batch SET name = ?, timing = ? WHERE id = ?', [name, timing, id]);
    return NextResponse.json({ id, name, timing });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    // Delete dependent seats and bookings first (though DB might handle with Cascade)
    await query('DELETE FROM Booking WHERE batchId = ?', [id]);
    await query('DELETE FROM Seat WHERE batchId = ?', [id]);
    await query('DELETE FROM Batch WHERE id = ?', [id]);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
