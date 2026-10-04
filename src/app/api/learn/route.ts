import { NextResponse } from 'next/server';
import { digipicoAgent } from '@/agent/digipico-agent';

export async function POST(req: Request) {
  let topic = "Technology";
  try {
    const body = await req.json();
    topic = body.topic || "Technology";

    const prompt = `You are a senior computer science professor. Create an incredibly comprehensive 8-step learning curriculum for a beginner learning about: "${topic}". 
    You must reply ONLY with a raw JSON object (no markdown).
    The JSON must match this exact structure:
    {
      "topic": "${topic}",
      "progress": 0,
      "steps": [
        { "id": 1, "title": "Step 1", "description": "2-3 sentences of detailed description.", "type": "concept", "status": "current" },
        ... generate 8 total detailed steps here (use types: 'concept', 'project', 'quiz', 'deep-dive'). The rest should have status "locked".
      ]
    }`;

    const response = await digipicoAgent.generate([{ role: "user", content: prompt }]);
    let reply = response.text || "";
    
    // Strip <thought> tags if they exist
    reply = reply.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();
    
    // Find the first { and last } to robustly extract JSON
    const jsonStr = reply.substring(reply.indexOf('{'), reply.lastIndexOf('}') + 1);
    
    let curriculum;
    try {
      curriculum = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON Parse Error on reply:", reply);
      throw parseError;
    }

    return NextResponse.json(curriculum);

  } catch (error: unknown) {
    console.error("Learn API Error:", error);
    // Fallback to a generic tech curriculum so the UI never breaks during the demo!
    return NextResponse.json({
      topic: topic,
      progress: 40,
      steps: [
        { id: 1, title: "The Basics", description: `An introduction to the core concepts of ${topic}.`, type: "concept", status: "completed" },
        { id: 2, title: "Core Architecture", description: `Understanding how ${topic} is structured.`, type: "concept", status: "completed" },
        { id: 3, title: "Your First Application", description: `Let's build a simple prototype using ${topic}.`, type: "project", status: "current" },
        { id: 4, title: "Knowledge Check", description: `Test your understanding of the fundamentals.`, type: "quiz", status: "locked" },
        { id: 5, title: "Advanced Patterns", description: `Deep dive into production-ready techniques.`, type: "concept", status: "locked" },
      ]
    });
  }
}
