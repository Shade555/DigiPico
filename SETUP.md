# 🚀 Getting Started with DigiPico

Welcome to the setup guide for DigiPico! This application is a monolithic Next.js full-stack app, meaning both the frontend UI and the backend APIs run together seamlessly. 

Follow these steps to get the app running locally or deployed to the cloud.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- A **MongoDB Atlas** account (Free tier works perfectly)
- A **Google AI Studio** account (For the Gemma 4 API key)

---

## 🔑 Environment Variables

To run DigiPico, you need to configure your environment variables.

1. At the root of the repository, copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your actual keys. 

**CRITICAL NOTE:** Ensure there are **NO** trailing spaces or glued-together lines in your `.env` file. Your Google API key should look like `AQ.Ab8RN...` and should be on its own line.

```env
# ─── REQUIRED ───────────────────────────────────────────────────────────────────
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
GOOGLE_API_KEY="AQ.YourGoogleKeyHere..."
SERPAPI_API_KEY="YourSerpApiKeyHere..."
BACKBOARD_API_KEY="YourBackboardKeyHere..."

# ─── OPTIONAL ───────────────────────────────────────────────────────────────────
ELEVENLABS_API_KEY="YourElevenLabsKeyHere..."
ELEVENLABS_VOICE_ID="7YaUDeaStRuoYg3FKsmU"

# ─── NEXT.JS CONFIG ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

> **MongoDB Tip:** Make sure your IP address is whitelisted in MongoDB Atlas (Network Access -> `0.0.0.0/0`), otherwise the app will crash with an `SSL alert number 80` error!

---

## 💻 Local Development

Starting the app locally is incredibly simple.

1. Install all dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically connect to your MongoDB database and the Google AI API.

---

## ☁️ Deployment (Render)

DigiPico is pre-configured to deploy effortlessly on [Render](https://render.com/) using the included `render.yaml` blueprint.

1. Push your code to your own GitHub repository.
2. Log in to your Render Dashboard.
3. Click **New +** and select **Blueprint**.
4. Connect your GitHub repository. Render will automatically read the `render.yaml` file and configure a Node.js web service.
5. In the Render Dashboard, go to your new service's **Environment** tab and add the variables from your `.env` file.
6. Click **Deploy**! 

*(Render gives you a free `.onrender.com` URL that works perfectly with the mobile-first UI!)*
