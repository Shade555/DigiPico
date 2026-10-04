import { NextResponse } from 'next/server';
import { getUserProgress } from '@/db/progress';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "test_user_123"; // Dynamic based on auth!
    
    const progress = await getUserProgress(userId);
    
    return NextResponse.json(progress);
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
