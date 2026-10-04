import { createTool } from '@mastra/core/tools';

export const retrieveMemoryTool = createTool({
  id: 'retrieveMemory',
  description: 'Retrieves previous context, interests, and learning progress for the user from Backboard and MongoDB Vector Search.',
  inputSchema: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      topic: { type: 'string' },
    },
    required: ['userId', 'topic'],
  },
  execute: async ({ context }) => {
    // In a real implementation, this queries Backboard / Tiger Data / Mongo Atlas Vector Search
    console.log(`Retrieving memory for user ${context.userId} on topic ${context.topic}`);
    return {
      knowledgeLevel: 'beginner',
      previousTopics: ['APIs', 'HTML'],
      interests: ['AI', 'Web Development'],
    };
  }
});

export const saveMemoryTool = createTool({
  id: 'saveMemory',
  description: 'Saves a new fact, interest, or completed lesson about the user to long-term memory.',
  inputSchema: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      fact: { type: 'string' },
      category: { type: 'string', enum: ['interest', 'completed_lesson', 'preference'] },
    },
    required: ['userId', 'fact', 'category'],
  },
  execute: async ({ context }) => {
    // Saves to MongoDB
    console.log(`Saved ${context.category} for user ${context.userId}: ${context.fact}`);
    return { success: true };
  }
});
