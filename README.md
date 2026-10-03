# DigiPico Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```
*(Add your MongoDB Atlas URI, Mastra, ElevenLabs, SerpApi, and Gemma keys)*

### 🎙️ ElevenLabs Voice Setup (Short)
1. Go to [elevenlabs.io](https://elevenlabs.io) and create a free account.
2. Click your profile icon -> **Profile + API Key**.
3. Copy the **API Key** into your `.env` as `ELEVENLABS_API_KEY`.
4. (Optional) Find a cute voice in the Voice Library, copy its **Voice ID**, and add `ELEVENLABS_VOICE_ID=your_voice_id` to `.env`.

### 3. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to see Pico!

---
*(Note: Mobile builds use `npx cap sync` and `npx cap open android`)*
