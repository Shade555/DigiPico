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
  execute: async ({ context }: Record<string, unknown>) => {
    // In a real implementation, this calls SerpApi
    console.log(`Executing searchTech for: ${context.query}`);
    return {
      results: [
        { title: 'Gemma 4 Released', snippet: 'Google releases Gemma 4 with new capabilities.' },
        { title: 'Next.js 15 Updates', snippet: 'A beginner friendly look at the new router.' }
      ]
    };
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
  execute: async () => {
    return {
      results: [
        { name: 'DEV Weekend Challenge', description: 'Build for a friend hackathon.' }
      ]
    };
  }
});
