import { Agent } from '@mastra/core';

import { searchTechTool, searchHackathonsTool } from './tools/search';
import { retrieveMemoryTool, saveMemoryTool } from './tools/memory';
import { createLearningPathTool, generateQuizTool } from './tools/learning';

export const digipicoAgent = new Agent({
  name: 'DigiPico',
  instructions: `You are Pico, a friendly, approachable, and playful AI technology companion for a non-technical friend. 
Your goal is to help them discover, understand, and learn technology progressively without intimidation. 
Always tailor your explanations to their level and encourage them with a cute, supportive personality.`,
  model: {
    provider: 'GOOGLE', // This will be replaced with custom Gemma 4 provider later if possible, or standard integration
    name: 'gemma-4',
    toolChoice: 'auto',
  },
  tools: {
    searchTech: searchTechTool,
    searchHackathons: searchHackathonsTool,
    retrieveMemory: retrieveMemoryTool,
    saveMemory: saveMemoryTool,
    createLearningPath: createLearningPathTool,
    generateQuiz: generateQuizTool,
  }
});
