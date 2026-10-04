# DigiPico: AI-Powered Technology Companion

## Overview
DigiPico is a personalized, gamified AI technology companion designed specifically for a non-technical audience. Its core purpose is to help people who feel intimidated by technology to discover, understand, learn, and try new technologies without friction. Pico acts as a cute, encouraging digital tutor pet that levels up and evolves as the user learns.

## Why it was made
This project is built for the **Hacktoberfest 2026 DEV Weekend Challenge: Build for a Friend** and is structured to compete in a **Kaggle Gemma 4 competition**. The goal was to build a comprehensive, AI-driven learning platform that feels more like raising a Tamagotchi and less like a corporate Learning Management System (LMS).

## Tech Stack & Architecture
- **Frontend/Framework**: Next.js (App Router), React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend/Database**: MongoDB Atlas (stores users, XP, streaks, achievements, and caches curriculums).
- **AI Agent Framework**: Mastra SDK (`@mastra/core`).
- **LLM/AI Model**: Gemma 4 (`openai/gemma-4-31b-it`) via Google AI Studio proxy.
- **Machine Learning (TabPFN)**: A python microservice (`predict_engagement.py`) integrates with TabPFN to analyze user stats (XP, streaks) and predict engagement categories.
- **Live Search**: SerpApi (provides live tech news, hackathons, and discovery feeds).
- **Mobile SDK**: Capacitor (configured for Android/iOS builds).

## Core Modules & Features
1. **Chat (Ask Pico)**: A conversational tutor that leverages the Mastra Agent to explain complex topics simply. It remembers long-term context via local storage threads shipped down to the API.
2. **Discover**: Pulls live tech news, open-source projects, and hackathons via SerpApi and formats them playfully.
3. **Learn**: Dynamically generates an 8-step curriculum for any given tech topic using Gemma 4. To optimize load times, generated curriculums are cached in MongoDB. Completing lessons grants XP and updates the database.
4. **Quiz**: Dynamically generates 3-question MCQ quizzes on any topic using Gemma 4. Correct answers grant XP.
5. **Build (Hands-on)**: A safe JavaScript sandbox (using `new Function()`) that captures `console.log` output to let users practice coding interactively.
6. **Profile / Digital Pet**: Displays the user's level, XP progress, learning streak, unlocked achievements, and the current evolution stage of Pico (e.g., Curious Egg -> Builder Pico). Includes Web Notifications API for daily tech updates.

## Gamification Engine
- **XP**: Awarded for completing lessons (+150 XP) and answering quiz questions (+50 XP per correct answer).
- **Streaks**: (Currently tracked on the profile).
- **Achievements**: Stored in MongoDB. Examples include:
  - `first_question`: Unlocked when the user asks their first question.
  - `streak_3`: Unlocked when the user reaches a 3-day streak.
  - `first_project`: Unlocked when finishing a sandbox challenge.
  - `api_master`: (Placeholder for advanced tasks).
  - `curriculum_completed`: Unlocked when a full learning path is completed.

## Current Status
All mock data has been replaced with functional APIs. The backend successfully writes/reads from MongoDB, Mastra safely triggers Gemma 4, the UI is polished with zero linting/TypeScript errors, and the UI pushes live updates to user profiles. 

## Next Steps for Future Agents
- If expanding the app, maintain the strict ESLint rules (especially around `any` and React Hooks).
- All AI calls should route through the `digipicoAgent` in Mastra.
- Expand the ML `predict_engagement.py` to affect UI recommendations.
- Keep the tone of Pico supportive and cute.
