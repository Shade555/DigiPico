# DigiPico — AI Technology Companion
**Hacktoberfest 2026 "Build for a Friend" & Kaggle Gemma 4 Submission**

## What is DigiPico?
DigiPico is a personalized AI technology companion designed for a non-technical friend. Instead of overwhelming users with complex technical documentation, DigiPico uses Gemma 4 to act as a cute digital tutor pet ("Pico") who explains concepts using simple analogies, adapts to the user's skill level, and gradually introduces them to hands-on coding and hackathons.

## The Architecture & Partner Integrations
This project makes meaningful use of every Hacktoberfest partner:

- **Gemma 4 & DigitalOcean:** The core reasoning and tutoring engine is powered by Gemma 4, hosted on DigitalOcean GPU infrastructure. Open-weight models allow us to fine-tune Pico's personality and maintain control over the tutor's inference.
- **Tinker:** We created a curated dataset (`src/agent/tinker_dataset.jsonl`) demonstrating beginner-friendly explanations. Tinker is used to fine-tune Gemma 4 on this dataset.
- **MongoDB Atlas & Backboard:** User progress, XP, learning streaks, and long-term memory (what the user knows and doesn't know) are stored in MongoDB. Backboard handles the RAG memory retrieval.
- **TabPFN:** We use tabular prediction based on the user's historical interaction metrics (time spent, quiz scores) to predict their next technical interest category.
- **ElevenLabs:** Gives Pico a natural, encouraging voice for conversational learning.
- **Mastra & SerpApi:** Mastra orchestrates the agent tool-calling. When a user asks about new tech, the agent uses SerpApi to fetch live developments.
- **Render & Temporal:** The application and backend run on Render, while Temporal manages durable workflows like the "Your Tech Week" digest.

## Reproducibility & Local Setup
To run DigiPico locally:
1. Clone the repository.
2. Run `npm install`.
3. Add your API keys and MongoDB connection string to `.env`.
4. Run `npm run dev`.

*For full context on the architecture and development journey, please see `context.md` and `progress.md` in the repository.*
