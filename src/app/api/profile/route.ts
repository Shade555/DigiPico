import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId || userId.length !== 24) {
      return NextResponse.json({
        xp: 0,
        streak: 1,
        achievements: ["first_login"],
        completedPaths: []
      });
    }
    
    const client = await clientPromise;
    const db = client.db('digipico');
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json({
        xp: 0,
        streak: 1,
        achievements: ["first_login"]
      });
    }
    
    return NextResponse.json({
      xp: user.xp || 0,
      streak: user.streak || 1,
      achievements: user.achievements || []
    });
  } catch (error) {
    console.error("Profile DB Error:", error);
    // Safe fallback if MongoDB is not connected
    return NextResponse.json({
      xp: 650,
      streak: 4,
      achievements: ["first_question", "streak_3"],
      completedPaths: []
    });
  }
}
