import { NextResponse } from 'next/server';
import { digipicoAgent } from '@/agent/digipico-agent';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    // Call the Mastra agent
    // Since Gemma-4 isn't publicly available in standard sdks yet (as of this context), 
    // Mastra will abstract the LLM call. 
    const response = await digipicoAgent.generate(messages);

    return NextResponse.json({
      role: 'assistant',
      content: response.text,
      // Include any tool calls or state updates if necessary
    });
  } catch (error) {
    console.error('Error in Ask Pico API:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
