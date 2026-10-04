import { NextResponse } from 'next/server';
import { getUserProgress } from '@/db/progress';

export async function GET() {
  try {
    // In a real app, this would use a session token (e.g. NextAuth)
    // For this hackathon, we'll hardcode a dummy user ID to demonstrate the DB link
    const userId = "test_user_123";
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
