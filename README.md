# DigiPico 🐣

A friendly, AI-powered technology companion built for the Hacktoberfest 2026 "Build for a Friend" challenge.

## 🚀 Quick Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```
*(You will need your MongoDB Atlas URI, ElevenLabs API Key, and your local/remote Gemma 4 endpoint).*

### 3. Run Temporal (Free Open-Source Cluster)
To execute the durable push notification cron workflows without paying for Temporal Cloud, self-host the open-source Temporal cluster locally using Docker:
```bash
git clone https://github.com/temporalio/docker-compose.git
cd docker-compose
docker-compose up
```

### 4. Run the App
```bash
npm run dev
```
Open `http://localhost:3000` to chat with Pico!

---

## 🌍 Production Deployment Guide

As per our architecture strategy for the Hacktoberfest partner requirements, we split the deployment into two optimized environments:

### 1. DigitalOcean (Frontend App Hosting)
We use DigitalOcean App Platform (or a basic droplet) to serve the Next.js static assets and UI.
- **How to deploy:**
  1. Go to the DigitalOcean dashboard -> Apps -> Create App.
  2. Connect this GitHub repository.
  3. Set the build command to `npm run build` and output directory to `.next`.
  4. (For Capacitor mobile builds, you can sync the `.next` out folder and compile via Android Studio/Xcode).

### 2. Render (AI Runtime / Mastra Backend)
We use Render to host the heavy Node.js runtime that executes the Mastra Agent, connects to the GPU inference endpoints, handles the TabPFN Python service, and runs the Temporal workflows.
- **How to deploy:**
  1. Simply connect this repository to Render.
  2. The provided `render.yaml` file (Infrastructure as Code) will automatically configure a Node environment, run `npm install`, and start the backend service!

---

### 🎙️ ElevenLabs Voice Setup
1. Go to [elevenlabs.io](https://elevenlabs.io) and create a free account.
2. Click your profile icon -> **Profile + API Key**.
3. Copy the **API Key** into your `.env` as `ELEVENLABS_API_KEY`.
