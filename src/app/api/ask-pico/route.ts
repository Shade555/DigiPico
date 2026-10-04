import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;

    if (!hfApiKey) {
      throw new Error("Missing HUGGINGFACE_API_KEY in environment variables.");
    }

    console.log("Routing via Hugging Face Serverless Inference (Gemma 3/4)...");
    
    // We append a system prompt to ensure Pico stays in character
    const formattedMessages = [
      { role: "system", content: "You are Pico, a friendly blue penguin tutor. You explain technology concepts simply, using emojis, to a beginner audience. Keep responses under 4 sentences." },
      ...messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch("https://api-inference.huggingface.co/models/google/gemma-3-4b-it/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-3-4b-it",
        messages: formattedMessages,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error:", errorText);
      if (response.status === 503) {
        throw new Error("Pico is currently waking up from a nap! (Hugging Face model is loading into memory). Please wait 30 seconds and try again.");
      }
      throw new Error(`Hugging Face API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Oops, I got confused! Try asking again.";

    return NextResponse.json({
      content: reply,
    });
  } catch (error: unknown) {
    console.error("API Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : "";
    
    if (errorMessage.includes("waking up")) {
      return NextResponse.json({ content: errorMessage });
    }
    
    // Ultimate fallback if Hugging Face API fails
    console.log("Using safe Hackathon fallback.");
    return NextResponse.json({ 
      content: `I'm currently running in Hackathon Demo Mode! My connection to Hugging Face is temporarily asleep. But don't worry—your profile, dynamic Wikipedia curriculum, and code sandboxes are completely functional! Try exploring the Learn or Build tabs.` 
    });
  }
}
