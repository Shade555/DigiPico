import { NextResponse } from 'next/server';
import { digipicoAgent } from '@/agent/digipico-agent';
import { BackboardClient } from 'backboard-sdk';

const backboardClient = new BackboardClient({ 
  apiKey: process.env.BACKBOARD_API_KEY || 'espr_NEEDKMyVRgVD9Ky-TnM5BpO-u8wnUSQGwXF9JWJJUOc' 
});

export async function POST(req: Request) {
  try {
    const { messages, threadId } = await req.json();

    const formattedMessages = [
      { role: "system", content: "You are Pico, a friendly blue penguin tutor. You explain technology concepts simply, using emojis, to a beginner audience. Keep responses under 4 sentences. CRITICAL: Do NOT output any internal <thought> blocks or tags. Only output the final response." },
      ...messages
    ];

    console.log("Routing via Mastra Agent + Backboard Memory...");
    const response = await digipicoAgent.generate(formattedMessages, { 
      threadId,
      memory: backboardClient 
    });

    let reply = response.text || "Oops, I got confused! Try asking again.";
    
    // Strip <thought> tags
    reply = reply.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();

    return NextResponse.json({
      content: reply,
      threadId: response.threadId || threadId
    });
  } catch (error: unknown) {
    console.error("Mastra API Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    // Ultimate fallback
    console.log("Using safe Hackathon fallback.");
    return NextResponse.json({ 
      content: `I couldn't connect to Mastra! Error: ${errorMessage}.` 
    });
  }
}
