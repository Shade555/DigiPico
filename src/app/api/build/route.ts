import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { interest } = await req.json();
    
    // We dynamically generate safe JavaScript coding challenges tailored to the user's topic
    // without needing external AI credits, ensuring 100% uptime for the hackathon!
    const challenges = [
      {
        id: 1,
        title: `Fetch ${interest} Data`,
        description: `Write a script to fetch basic information related to ${interest} from a public API.`,
        difficulty: "Beginner",
        completed: true,
        active: false,
        template: `// Imagine this API returns ${interest} facts\nconst res = await fetch("https://dummyjson.com/products/1");\nconst data = await res.json();\nreturn data.title;`
      },
      {
        id: 2,
        title: `Stringify ${interest}`,
        description: `Create an object representing your favorite part of ${interest} and return it as a JSON string.`,
        difficulty: "Beginner",
        completed: false,
        active: true,
        template: `const myTopic = {\n  topic: "${interest}",\n  level: "Awesome"\n};\n\nreturn JSON.stringify(myTopic);`
      },
      {
        id: 3,
        title: `Calculate ${interest} Metrics`,
        description: `Write a math function to calculate growth rate in the ${interest} industry.`,
        difficulty: "Intermediate",
        completed: false,
        active: false,
        template: `const start = 100;\nconst end = 250;\nconst growth = ((end - start) / start) * 100;\nreturn growth + "%";`
      }
    ];

    return NextResponse.json(challenges);
  } catch (error: unknown) {
    console.error("Build API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch challenges";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
