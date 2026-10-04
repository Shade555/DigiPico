import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (!hfApiKey && !googleApiKey) {
      throw new Error("Missing API keys in environment variables.");
    }

    // We append a system prompt to ensure Pico stays in character
    const formattedMessages = [
      { role: "system", content: "You are Pico, a friendly blue penguin tutor. You explain technology concepts simply, using emojis, to a beginner audience. Keep responses under 4 sentences." },
      ...messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }))
    ];

    let response;
    
    if (googleApiKey) {
      console.log("Routing via Google AI Studio...");
      response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${googleApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemma-2-9b-it", // Using Gemma 2 (AI Studio standard)
          messages: formattedMessages,
          max_tokens: 500,
        }),
      });
    } else {
      console.log("Routing via Hugging Face Serverless Inference...");
      response = await fetch("https://api-inference.huggingface.co/models/google/gemma-4-E4B-it/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hfApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-4-E4B-it",
          messages: formattedMessages,
          max_tokens: 500,
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      if (response.status === 503) {
        throw new Error("Pico is currently waking up from a nap! Please wait 30 seconds and try again.");
      }
      throw new Error(`API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Oops, I got confused! Try asking again.";

    return NextResponse.json({
      content: reply,
    });
  } catch (error: unknown) {
    console.error("API Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    if (errorMessage.includes("waking up")) {
      return NextResponse.json({ content: errorMessage });
    }
    
    // Ultimate fallback
    console.log("Using safe Hackathon fallback.");
    return NextResponse.json({ 
      content: `I couldn't connect to the AI! Error: ${errorMessage}. Did you restart your Next.js server after adding the API key?` 
    });
  }
}
