import { NextResponse } from 'next/server';
import { digipicoAgent } from '@/agent/digipico-agent';

export async function POST(req: Request) {
  try {
    const { interest } = await req.json();
    const topic = interest || "Technology";
    
    const prompt = `You are a coding instructor. Create 3 JavaScript coding challenges for a beginner about "${topic}".
Reply ONLY with a raw JSON array (no markdown, no backticks).
Format exactly like this:
[
  {
    "id": 1,
    "title": "Title related to ${topic}",
    "description": "Short description of the challenge.",
    "difficulty": "Beginner",
    "completed": false,
    "active": true,
    "template": "const x = 10;\\n// Write code here\\nreturn x;"
  }
]
Make the first one active:true, and the rest active:false.`;

    const response = await digipicoAgent.generate([{ role: "user", content: prompt }]);
    let reply = response.text || "";
    reply = reply.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();
    
    const jsonStr = reply.substring(reply.indexOf('['), reply.lastIndexOf(']') + 1);
    const challenges = JSON.parse(jsonStr);

    return NextResponse.json(challenges);
  } catch (error: unknown) {
    console.error("Build API Error:", error);
    // Fallback if AI fails
    const topic = "Technology";
    return NextResponse.json([
      {
        id: 1, title: `Fetch ${topic} Data`, description: `Write a script to fetch data related to ${topic}.`, difficulty: "Beginner", completed: false, active: true, template: `// Write some JS code!\nreturn "Hello World";`
      }
    ]);
  }
}
