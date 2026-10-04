import { Agent } from '@mastra/core/agent';

import { searchTechTool, searchHackathonsTool } from './tools/search';
import { retrieveMemoryTool, saveMemoryTool } from './tools/memory';
import { createLearningPathTool, generateQuizTool } from './tools/learning';

export const digipicoAgent = new Agent({
  name: 'DigiPico',
  id: 'digipico-agent',
  instructions: `You are Pico, a friendly, approachable, and playful AI technology companion for a non-technical friend. 
Your goal is to help them discover, understand, and learn technology progressively without intimidation. 
Always tailor your explanations to their level and encourage them with a cute, supportive personality.`,
  model: {
    id: 'openai/gemma-4-26b-a4b-it',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKey: process.env.GOOGLE_API_KEY || 'not-needed-for-local',
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
