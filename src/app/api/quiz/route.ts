import { NextResponse } from 'next/server';
import { digipicoAgent } from '@/agent/digipico-agent';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const prompt = `You are a friendly tutor. Create a 3-question multiple choice quiz about "${topic}" for a beginner. 
    You must reply ONLY with a raw JSON object (no markdown).
    The JSON must match this exact structure:
    {
      "topic": "${topic}",
      "questions": [
        { 
          "id": 1, 
          "question": "Clear question text?", 
          "options": ["Wrong 1", "Right Answer", "Wrong 2", "Wrong 3"], 
          "correctIndex": 1,
          "explanation": "Why this is correct."
        }
      ]
    }`;

    const response = await digipicoAgent.generate([{ role: "user", content: prompt }]);
    let reply = response.text || "";
    
    // Strip <thought> tags
    reply = reply.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();
    
    // Robustly extract JSON
    const jsonStr = reply.substring(reply.indexOf('{'), reply.lastIndexOf('}') + 1);
    const quiz = JSON.parse(jsonStr);

    return NextResponse.json(quiz);

  } catch (error: unknown) {
    console.error("Quiz API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz." },
      { status: 500 }
    );
  }
}
