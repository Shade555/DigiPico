import { NextResponse } from 'next/server';
import { BackboardClient } from 'backboard-sdk';

const backboardClient = new BackboardClient({ 
  apiKey: process.env.BACKBOARD_API_KEY || 'espr_NEEDKMyVRgVD9Ky-TnM5BpO-u8wnUSQGwXF9JWJJUOc' 
});

export async function POST(req: Request) {
  try {
    const { interest } = await req.json();
    
    // We explicitly instruct Gemma to write safe, browser-executable JS snippets
    const prompt = `Generate 3 interactive JavaScript coding challenges for someone learning about "${interest}". 
Return strictly a JSON array of 3 objects. Each object must have:
"id" (number), "title" (string), "description" (string), "difficulty" (Beginner | Intermediate), "completed" (boolean), "active" (boolean), and "template" (string).

Rules for the 'template' field:
1. It MUST be valid, self-contained JavaScript that can be executed in an async function.
2. It should usually just be a simple fetch request or basic math/string manipulation related to the topic.
3. It MUST end with a \`return\` statement so the output can be printed.
4. Do not use require() or import.

Make the first challenge completed=true and active=false. Make the second completed=false and active=true. Make the third completed=false and active=false.`;

    const backboardResponse = await backboardClient.sendMessage({
      content: prompt,
      model: 'google/gemma-4-31B',
    });

    const rawText = backboardResponse.content;
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      const challenges = JSON.parse(jsonMatch[0]);
      return NextResponse.json(challenges);
    }

    throw new Error("Failed to parse challenges JSON");
  } catch (error) {
    console.error("Build API Error:", error);
    // Safe Fallback
    return NextResponse.json([
      {
        id: 1,
        title: "Make an API Request",
        description: "Ask a public server for a random joke using JavaScript.",
        difficulty: "Beginner",
        completed: true,
        active: false,
        template: 'const res = await fetch("https://api.github.com/users/octocat");\nconst data = await res.json();\nreturn data.login;'
      },
      {
        id: 2,
        title: "Hello World",
        description: "Return a simple greeting string.",
        difficulty: "Beginner",
        completed: false,
        active: true,
        template: 'const greeting = "Hello, future engineer!";\nreturn greeting;'
      }
    ]);
  }
}
