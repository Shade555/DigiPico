import clientPromise from '../mongodb';
import { ObjectId } from 'mongodb';

export interface UserProgress {
  _id?: ObjectId;
  userId: string;
  level: number;
  xp: number;
  streak: number;
  completedLessons: string[];
  activeLearningPath?: string;
  achievements: string[];
}

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const client = await clientPromise;
  const db = client.db('digipico');
  const collection = db.collection<UserProgress>('progress');
  
  return collection.findOne({ userId });
}

export async function addXP(userId: string, amount: number): Promise<void> {
  const client = await clientPromise;
  const db = client.db('digipico');
  const collection = db.collection<UserProgress>('progress');
  
  await collection.updateOne(
    { userId },
    { 
      $inc: { xp: amount },
      $setOnInsert: { level: 1, streak: 0, completedLessons: [], achievements: [] }
    },
    { upsert: true }
  );
  
  // Logic to calculate level ups would go here
}
