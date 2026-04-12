// Seed using raw mysql2 queries
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_URL = process.env.DATABASE_URL;

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  console.log('🌱 Connected to DB. Seeding for 11 seats (7 Main, 4 Practice)...');

  // Clear tables in order
  await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
  await conn.execute('TRUNCATE TABLE Booking');
  await conn.execute('TRUNCATE TABLE Seat');
  await conn.execute('TRUNCATE TABLE Batch');
  await conn.execute('TRUNCATE TABLE Admin');
  await conn.execute('SET FOREIGN_KEY_CHECKS = 1');

  // Admin
  const hashed = await bcrypt.hash('admin123', 10);
  await conn.execute('INSERT INTO Admin (username, password) VALUES (?, ?)', ['admin', hashed]);
  console.log('✅ Admin created: username=admin password=admin123');

  // Batches
  const batches = [
    ['Batch 1', '7:00 AM – 9:00 AM'],
    ['Batch 2', '10:00 AM – 12:00 PM'],
    ['Batch 3', '11:00 AM – 1:00 PM'],
    ['Batch 4', '3:00 PM – 5:00 PM'],
    ['Batch 5', '6:00 PM – 8:00 PM'],
  ];

  for (const [name, timing] of batches) {
    const [batchResult] = await conn.execute('INSERT INTO Batch (name, timing) VALUES (?, ?)', [name, timing]);
    const batchId = batchResult.insertId;
    
    // Create 11 seats: 7 Main, 4 Practice
    for (let i = 1; i <= 11; i++) {
      const type = i <= 7 ? 'MAIN' : 'PRACTICE';
      await conn.execute(
        'INSERT INTO Seat (batchId, seatNumber, type, status) VALUES (?, ?, ?, ?)', 
        [batchId, i, type, 'AVAILABLE']
      );
    }
    console.log(`✅ ${name} seeded with 11 seats (7 Main, 4 Practice)`);
  }

  await conn.end();
  console.log('🎉 Seeding complete!');
}

main().catch((e) => { console.error('❌ Seed failed:', e.message); process.exit(1); });
