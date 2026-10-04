import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const { timeSpent = 15, quizScore = 80, difficulty = 'Beginner', previousCategory = 'AI' } = await req.json();
    
    // Spawn TabPFN python script
    const { stdout, stderr } = await execAsync(`python predict_engagement.py ${timeSpent} ${quizScore} "${difficulty}" "${previousCategory}"`);
    
    if (stderr && !stderr.includes('Warning')) {
      console.warn("Python Stderr:", stderr);
    }

    // Attempt to parse JSON response from the python script
    const jsonStr = stdout.substring(stdout.indexOf('{'), stdout.lastIndexOf('}') + 1);
    const result = JSON.parse(jsonStr);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("TabPFN ML Error:", error);
    // Fallback if Python or TabPFN isn't fully installed on the machine
    return NextResponse.json({ predicted_category: "Artificial Intelligence", confidence: 0.99, fallback: true });
  }
}
