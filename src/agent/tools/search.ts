import { createTool } from '@mastra/core/tools';

export const searchTechTool = createTool({
  id: 'searchTech',
  description: 'Searches the web for recent technology releases, open source projects, and beginner-friendly AI news using SerpApi.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'The technology or topic to search for' },
    },
    required: ['query'],
  },
  execute: async ({ context }: any) => {
    console.log(`Executing live search for: ${context.query}`);
    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) return { results: [{ title: 'SerpApi Key Missing', snippet: 'Configure SERPAPI_API_KEY in .env to enable live search.' }] };

    try {
      const q = encodeURIComponent(String(context.query));
      const response = await fetch(`https://serpapi.com/search.json?q=${q}&engine=google&api_key=${apiKey}`);
      const data = await response.json();
      
      const results = (data.organic_results || []).slice(0, 3).map((r: Record<string, unknown>) => ({
        title: r.title,
        snippet: r.snippet,
        link: r.link
      }));
      
      return { results };
    } catch (e: unknown) {
      return { results: [{ title: 'Search Error', snippet: e instanceof Error ? e.message : String(e) }] };
    }
  }
});

export const searchHackathonsTool = createTool({
  id: 'searchHackathons',
  description: 'Searches for beginner-friendly hackathons and coding events.',
  inputSchema: {
    type: 'object',
    properties: {
      topic: { type: 'string' },
    },
    required: ['topic'],
  },
  execute: async ({ context }: any) => {
    console.log(`Executing live hackathon search for: ${context.topic}`);
    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) return { results: [{ name: 'Key Missing', description: 'Configure SERPAPI_API_KEY' }] };

    try {
      const q = encodeURIComponent(`beginner friendly hackathon ${context.topic || ''}`);
      const response = await fetch(`https://serpapi.com/search.json?q=${q}&engine=google&api_key=${apiKey}`);
      const data = await response.json();
      
      const results = (data.organic_results || []).slice(0, 3).map((r: Record<string, unknown>) => ({
        name: r.title,
        description: r.snippet,
        link: r.link
      }));
      
      return { results };
    } catch (e: unknown) {
      return { results: [{ name: 'Search Error', description: e instanceof Error ? e.message : String(e) }] };
    }
  }
});
