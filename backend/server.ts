import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { Agent } from "@mastra/core/agent";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// ─── MongoDB ─────────────────────────────────────────────────────────────────
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dummy";
const mongoClient = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});
let db: ReturnType<typeof mongoClient.db>;
mongoClient.connect().then(() => {
  db = mongoClient.db("digipico");
  console.log("✅ Connected to MongoDB");
});

// ─── Mastra Agent ─────────────────────────────────────────────────────────────
const picoAgent = new Agent({
  name: "DigiPico",
  id: "digipico-agent",
  instructions: `You are Pico, a friendly, approachable, and playful AI technology companion for a non-technical friend. 
Always tailor your explanations to their level and encourage them with a cute, supportive personality.`,
  model: {
    id: "openai/gemma-4-31b-it",
    url: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKey: process.env.GOOGLE_API_KEY || "",
  },
});

function stripThought(text: string) {
  return text.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();
}

// ─── /api/auth ────────────────────────────────────────────────────────────────
app.post("/api/auth", async (req, res) => {
  try {
    const { username, password, action } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });
    const users = db.collection("users");
    if (action === "signup") {
      const existing = await users.findOne({ username });
      if (existing) return res.status(400).json({ error: "Username taken" });
      const result = await users.insertOne({
        username, password, xp: 0, streak: 1,
        achievements: ["first_login"], createdAt: new Date(),
      });
      return res.json({ success: true, userId: result.insertedId });
    } else {
      const user = await users.findOne({ username, password });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      return res.json({ success: true, userId: user._id });
    }
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown" });
  }
});

// ─── /api/user GET ────────────────────────────────────────────────────────────
app.get("/api/user", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "Missing userId" });
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown" });
  }
});

// ─── /api/user POST ───────────────────────────────────────────────────────────
app.post("/api/user", async (req, res) => {
  try {
    const { userId, updates } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });
    const dbUpdates: Record<string, unknown> = { $set: updates };
    if (updates.xp) {
      const newAchievements = [];
      if (updates.xp >= 150) newAchievements.push("first_question");
      if (updates.xp >= 500) newAchievements.push("streak_3");
      if (updates.xp >= 1000) newAchievements.push("first_project");
      if (updates.xp >= 2000) newAchievements.push("api_master");
      if (newAchievements.length > 0) {
        dbUpdates.$addToSet = { achievements: { $each: newAchievements } };
      }
    }
    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, dbUpdates);
    return res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown" });
  }
});

// ─── /api/user DELETE ─────────────────────────────────────────────────────────
app.delete("/api/user", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "Missing userId" });
    await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
    return res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown" });
  }
});

// ─── /api/profile ─────────────────────────────────────────────────────────────
app.get("/api/profile", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId || userId.length !== 24) {
      return res.json({ xp: 0, streak: 1, achievements: ["first_login"] });
    }
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) return res.json({ xp: 0, streak: 1, achievements: ["first_login"] });
    return res.json({ xp: user.xp || 0, streak: user.streak || 1, achievements: user.achievements || [] });
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown" });
  }
});

// ─── /api/learn ───────────────────────────────────────────────────────────────
app.post("/api/learn", async (req, res) => {
  const topic = req.body.topic || "Technology";
  try {
    const curriculums = db.collection("curriculums");
    const normalizedTopic = topic.toLowerCase().trim();
    const existing = await curriculums.findOne({ topic: normalizedTopic });
    if (existing) return res.json(existing.data);

    const prompt = `You are a senior computer science professor. Create an incredibly comprehensive 8-step learning curriculum for a beginner learning about: "${topic}". 
Reply ONLY with a raw JSON object (no markdown) matching this structure:
{
  "topic": "${topic}",
  "progress": 0,
  "steps": [
    { "id": 1, "title": "Step 1", "description": "2-3 sentences.", "type": "concept", "status": "current" },
    ... 8 steps total (types: 'concept', 'project', 'quiz', 'deep-dive'). Rest have status "locked".
  ]
}`;
    const response = await picoAgent.generate([{ role: "user", content: prompt }]);
    let reply = stripThought(response.text || "");
    const jsonStr = reply.substring(reply.indexOf("{"), reply.lastIndexOf("}") + 1);
    const curriculum = JSON.parse(jsonStr);
    await curriculums.insertOne({ topic: normalizedTopic, data: curriculum });
    return res.json(curriculum);
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed" });
  }
});

// ─── /api/quiz ────────────────────────────────────────────────────────────────
app.post("/api/quiz", async (req, res) => {
  const topic = req.body.topic || "Technology";
  try {
    const prompt = `You are a friendly tutor. Create a 3-question multiple choice quiz about "${topic}" for a beginner.
Reply ONLY with a raw JSON object (no markdown):
{
  "topic": "${topic}",
  "questions": [
    { "id": 1, "question": "Question?", "options": ["A","B","C","D"], "correctIndex": 1, "explanation": "Why." }
  ]
}`;
    const response = await picoAgent.generate([{ role: "user", content: prompt }]);
    let reply = stripThought(response.text || "");
    const jsonStr = reply.substring(reply.indexOf("{"), reply.lastIndexOf("}") + 1);
    return res.json(JSON.parse(jsonStr));
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Failed" });
  }
});

// ─── /api/ask-pico ────────────────────────────────────────────────────────────
app.post("/api/ask-pico", async (req, res) => {
  try {
    const { messages } = req.body;
    const formattedMessages = [
      { role: "system", content: "You are Pico, a friendly blue penguin tutor. Explain technology simply using emojis. Keep responses under 4 sentences. Do NOT output <thought> tags." },
      ...messages,
    ];
    const response = await picoAgent.generate(formattedMessages);
    const reply = stripThought(response.text || "Oops, I got confused!");
    return res.json({ content: reply });
  } catch (e: unknown) {
    res.status(500).json({ content: "I had trouble connecting. Try again!" });
  }
});

// ─── /api/discover ────────────────────────────────────────────────────────────
app.get("/api/discover", async (req, res) => {
  const interest = (req.query.interest as string) || "artificial intelligence";
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    return res.json({ news: [{ title: `Latest ${interest} Trends`, description: `Explore the world of ${interest}!`, type: "Tech News", time: "Just now" }] });
  }
  try {
    const encodedQuery = encodeURIComponent(`${interest} technology OR tutorial OR news`);
    const serpRes = await fetch(`https://serpapi.com/search.json?engine=google_news&q=${encodedQuery}&api_key=${apiKey}`);
    const data = await serpRes.json();
    const news = data.news_results?.slice(0, 5).map((item: { title: string; snippet?: string; date?: string; link?: string }) => ({
      title: item.title,
      description: item.snippet || "Click to learn more.",
      type: item.title.toLowerCase().includes("hackathon") ? "Event" : "Tech News",
      time: item.date || "Recently",
      link: item.link,
    })) || [];
    return res.json({ news });
  } catch (e: unknown) {
    res.status(500).json({ error: "Failed to fetch discoveries" });
  }
});

// ─── /api/build ───────────────────────────────────────────────────────────────
app.post("/api/build", (req, res) => {
  const { interest } = req.body;
  res.json([
    { id: 1, title: `Fetch ${interest} Data`, description: `Write a script to fetch data related to ${interest}.`, difficulty: "Beginner", completed: false, active: true, template: `// Fetch some data!\nconsole.log("Hello from ${interest}!");` },
    { id: 2, title: `Stringify ${interest}`, description: `Create an object and JSON-stringify it.`, difficulty: "Beginner", completed: false, active: false, template: `const myTopic = { topic: "${interest}", level: "Awesome" };\nconsole.log(JSON.stringify(myTopic));` },
    { id: 3, title: `Calculate ${interest} Metrics`, description: `Write a math function related to growth.`, difficulty: "Intermediate", completed: false, active: false, template: `const start = 100;\nconst end = 250;\nconst growth = ((end - start) / start) * 100;\nconsole.log(growth + "%");` },
  ]);
});

// ─── /api/tts ─────────────────────────────────────────────────────────────────
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return res.status(400).json({ error: "ELEVENLABS_API_KEY not set" });
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
    const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "Accept": "audio/mpeg", "Content-Type": "application/json", "xi-api-key": apiKey },
      body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
    });
    if (!ttsRes.ok) return res.status(500).json({ error: "ElevenLabs error" });
    const buffer = await ttsRes.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(buffer));
  } catch (e: unknown) {
    res.status(500).json({ error: "Failed to generate audio" });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", service: "DigiPico API" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 DigiPico API running on port ${PORT}`));
