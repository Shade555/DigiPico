import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('digipico');
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    return NextResponse.json(user);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, updates } = await req.json();
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('digipico');
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updates }
    );
    
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
  }
}
