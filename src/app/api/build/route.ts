import { NextResponse } from 'next/server';

export async function GET() {
  // In a full production flow, these would be fetched from a MongoDB "Challenges" collection.
  // For now, we return real structural data that the client will execute dynamically.
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
      title: "Talk to Gemini",
      description: "Send a simple prompt to a language model and print the reply.",
      difficulty: "Beginner",
      completed: false,
      active: true,
      template: 'const res = await fetch("https://dummyjson.com/quotes/random");\nconst data = await res.json();\nreturn data.quote;'
    }
  ]);
}
