import { NextResponse } from 'next/server';
import { digipicoAgent } from '@/agent/digipico-agent';

export async function POST(req: Request) {
  try {
    const { messages, threadId } = await req.json();

    const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || "";
    let systemContext = "You are Pico, a friendly blue penguin tutor. You explain technology concepts simply, using emojis, to a beginner audience. Keep responses under 4 sentences. CRITICAL: Do NOT output any internal <thought> blocks or tags. Only output the final response.";

    if (lastUserMessage.includes("hackathon") || lastUserMessage.includes("news") || lastUserMessage.includes("latest") || lastUserMessage.includes("search")) {
      console.log("SerpApi trigger detected. Injecting live search context...");
      try {
        const apiKey = process.env.SERPAPI_API_KEY;
        if (apiKey) {
          const q = encodeURIComponent(lastUserMessage);
          const serpRes = await fetch(`https://serpapi.com/search.json?q=${q}&engine=google&api_key=${apiKey}`);
          const serpData = await serpRes.json();
          const results = (serpData.organic_results || []).slice(0, 3).map((r: { title: string, snippet: string, link: string }) => `- ${r.title}: ${r.snippet} (${r.link})`).join('\n');
          systemContext += `\n\nLIVE SEARCH RESULTS TO HELP YOU ANSWER:\n${results}`;
        }
      } catch (e) {
        console.error("SerpApi injection failed:", e);
      }
    }

    const formattedMessages = [
      { role: "system", content: systemContext },
      ...messages
    ];

    console.log("Routing via Mastra Agent + Backboard Memory...");
    const response = await digipicoAgent.generate(formattedMessages);

    let reply = response.text || "Oops, I got confused! Try asking again.";
    
    // Strip <thought> tags
    reply = reply.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();

    return NextResponse.json({
      content: reply,
      threadId: threadId || "new-thread-" + Date.now()
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
