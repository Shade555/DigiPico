import { createTool } from '@mastra/core/tools';

export const createLearningPathTool = createTool({
  id: 'createLearningPath',
  description: 'Generates a personalized learning path for a non-technical user based on their stated goal or interest.',
  inputSchema: {
    type: 'object',
    properties: {
      topic: { type: 'string', description: 'The topic the user wants to learn (e.g., AI, Web Development)' },
      userLevel: { type: 'string', enum: ['beginner', 'intermediate'], description: 'The user\'s current understanding.' },
    },
    required: ['topic', 'userLevel'],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: async ({ context }: any) => {
    console.log(`Generating learning path for ${context.topic} at level: ${context.userLevel}`);
    
    // In a real scenario, this would trigger an agent workflow using Gemma 4 to generate a detailed path.
    return {
      pathId: 'path_123',
      title: `Introduction to ${context.topic}`,
      steps: [
        { id: 'step_1', title: `What is ${context.topic}?`, estimatedMinutes: 10 },
        { id: 'step_2', title: 'Why it matters in the real world', estimatedMinutes: 15 },
        { id: 'step_3', title: 'A tiny hands-on experiment', estimatedMinutes: 20 },
      ]
    };
  }
});

export const generateQuizTool = createTool({
  id: 'generateQuiz',
  description: 'Generates a short, beginner-friendly quiz to test the user\'s understanding of a topic.',
  inputSchema: {
    type: 'object',
    properties: {
      topic: { type: 'string' },
    },
    required: ['topic'],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: async ({ context }: any) => {
    return {
      quizId: 'quiz_123',
      questions: [
        {
          question: `Which of these best describes ${context.topic}?`,
          options: ['A complex mathematical formula', 'A tool to help computers learn patterns', 'A type of database'],
          correctIndex: 1
        }
      ]
    };
  }
});
