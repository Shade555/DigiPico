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
    
    const dbUpdates: Record<string, unknown> = { $set: updates };
    
    // Auto-unlock achievements based on XP
    if (updates.xp) {
      const newAchievements = [];
      if (updates.xp >= 150) newAchievements.push("first_question");
      if (updates.xp >= 500) newAchievements.push("streak_3");
      if (updates.xp >= 1000) newAchievements.push("first_project");
      if (updates.xp >= 2000) newAchievements.push("api_master");
      
      if (newAchievements.length > 0) {
        dbUpdates.$addToSet = { achievements: { $each: newAchievements } };
      }
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      dbUpdates
    );
    
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('digipico');
    
    await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
    
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, xpToAdd, achievements } = await req.json();
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('digipico');
    
    const updateDoc: Record<string, any> = {};
    if (xpToAdd) {
      updateDoc.$inc = { xp: xpToAdd };
    }
    if (achievements && achievements.length > 0) {
      updateDoc.$addToSet = { achievements: { $each: achievements } };
    }

    if (Object.keys(updateDoc).length > 0) {
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        updateDoc
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
  }
}
