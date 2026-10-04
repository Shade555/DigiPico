import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (!googleApiKey) {
      throw new Error("Missing GOOGLE_API_KEY");
    }

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

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${googleApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma-4-31b-it",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API failed: ${response.statusText}`);
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || "";
    
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
