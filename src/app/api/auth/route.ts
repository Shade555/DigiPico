import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { username, password, action } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('digipico');
    const users = db.collection('users');

    if (action === 'signup') {
      const existing = await users.findOne({ username });
      if (existing) {
        return NextResponse.json({ error: 'Username taken' }, { status: 400 });
      }
      
      const newUser = {
        username,
        password, // In a real app, hash this with bcrypt!
        xp: 0,
        streak: 1,
        achievements: ["first_login"],
        createdAt: new Date(),
      };
      
      const result = await users.insertOne(newUser);
      return NextResponse.json({ success: true, userId: result.insertedId });
      
    } else {
      const user = await users.findOne({ username, password });
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      return NextResponse.json({ success: true, userId: user._id });
    }
  } catch (e: unknown) {
    const err = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
