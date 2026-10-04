import { NextResponse } from 'next/server';
import { BackboardClient } from 'backboard-sdk';

const backboardClient = new BackboardClient({ 
  apiKey: process.env.BACKBOARD_API_KEY || 'espr_NEEDKMyVRgVD9Ky-TnM5BpO-u8wnUSQGwXF9JWJJUOc' 
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const prompt = `Generate a 5-step learning curriculum for the topic: "${topic}". 
Return strictly a JSON array of 5 objects. Each object must have:
"id" (number), "title" (string), "type" (concept | quiz | project), and "status" (completed | current | locked).
Make the first two 'completed', the third 'current', and the rest 'locked'.`;

    const backboardResponse = await backboardClient.sendMessage({
      content: prompt,
      model: 'google/gemma-4-31B',
    });

    // Extract JSON block from the markdown response
    const rawText = backboardResponse.content;
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      const steps = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ topic, progress: 40, steps });
    }

    throw new Error("Failed to parse curriculum JSON");

  } catch (error) {
    console.error("Learn API Error:", error);
    // Fallback if AI parsing fails
    return NextResponse.json({
      topic: "Introduction to AI",
      progress: 40,
      steps: [
        { id: 1, title: "What is AI?", type: "concept", status: "completed" },
        { id: 2, title: "Machine Learning Basics", type: "concept", status: "completed" },
        { id: 3, title: "How LLMs Work", type: "concept", status: "current" },
        { id: 4, title: "Prompt Engineering Quiz", type: "quiz", status: "locked" },
        { id: 5, title: "Build an AI App", type: "project", status: "locked" },
      ]
    });
  }
}
