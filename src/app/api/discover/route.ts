import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const interest = searchParams.get("interest") || "artificial intelligence";
  const apiKey = process.env.SERPAPI_API_KEY;
  
  if (!apiKey) {
    console.log("No SerpApi key found. Returning fallback data.");
    return NextResponse.json({
      news: [
        {
          title: `Latest ${interest} Trends`,
          description: `The world of ${interest} is evolving rapidly. Click to learn more!`,
          type: "Tech News",
          time: "Just now",
        },
        {
          title: "DEV Weekend Challenge",
          description: "A beginner-friendly online hackathon. Perfect time to try building your first tiny web project!",
          type: "Hackathon",
          time: "Upcoming",
        }
      ]
    });
  }

  try {
    // Call SerpApi Google News dynamically using the user's interest
    const encodedQuery = encodeURIComponent(`${interest} technology OR tutorial OR news`);
    const res = await fetch(`https://serpapi.com/search.json?engine=google_news&q=${encodedQuery}&api_key=${apiKey}`);
    const data = await res.json();
    
    // Transform SerpApi results to our Discover card format
    const news = data.news_results?.slice(0, 5).map((item: { title: string; snippet?: string; date?: string; link?: string }) => ({
      title: item.title,
      description: item.snippet || "Click to learn more about this recent technology development.",
      type: item.title.toLowerCase().includes('hackathon') ? "Event" : "Tech News",
      time: item.date || "Recently",
      link: item.link
    })) || [];

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Discover API Error:", error);
    return NextResponse.json({ error: "Failed to fetch discoveries" }, { status: 500 });
  }
}
