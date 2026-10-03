# DigiPico — Master Development Context

## Overview
DigiPico is a personalized AI technology companion designed specifically for a non-technical friend. It helps someone who is not naturally interested in technology discover new technologies, understand them without feeling intimidated, learn them progressively, and eventually become confident enough to build and participate in the tech ecosystem.

It acts as a cute digital tutor pet/companion, NOT a corporate learning management system.

The central journey is:
**Discover → Understand → Learn → Try → Build → Explore More**

**Target:** Hacktoberfest 2026 DEV Weekend Challenge: Build for a Friend, and Kaggle Gemma 4 competition.

## Target User
A non-technical friend who needs a friendly, approachable, playful, personalized, and practical way to discover and learn technology.

## Core Features
1. **Personalized Tech Discovery:** Discover AI models/tools, open-source projects, developer tools, startups, hackathons, and events.
2. **Ask Pico:** Conversational AI tutor using Gemma 4 that remembers relevant user context.
3. **Personalized Learning Paths:** Adaptive paths based on learning goals, current level, weak areas, interests, and time.
4. **Quizzes:** MCQs, true/false, scenario, and conceptual questions tracking performance.
5. **Hands-on Challenges:** Small practical tasks (e.g., make an API request, run a script).
6. **Hackathon & Opportunity Discovery:** Find beginner-friendly programs, workshops, and coding competitions.
7. **Voice Interaction:** Talk to Pico (using ElevenLabs) with natural voice responses.
8. **Progress Dashboard:** Track XP, Level, learning streak, topics, skills, and learning paths.
9. **Weekly Tech Digest:** A personalized "Your Tech Week" digest.
10. **Pico Memory:** Remembers interests, skill level, completed topics, learning goals, and preferred styles.

## Architecture & Tech Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Capacitor (web-first, mobile-ready).
- **Backend/Agent:** TypeScript/Node.js, Mastra (agent orchestration), Temporal (durable workflows), Next.js API Routes.
- **AI Core:** Gemma 4 (Primary model for tutoring, explanations, paths, quizzes, reasoning).
- **Primary Database:** MongoDB Atlas (Users, profiles, conversations, learning paths, XP, discoveries, etc.).
- **Vector Search:** MongoDB Atlas Vector Search / Tiger Data.

## Partner Integrations
- **Render ($200):** AI/application runtime host.
- **TabPFN ($200):** Predict which tech/resource a learner is most likely to engage with next.
- **Tinker ($200):** Fine-tune Gemma 4 for beginner-friendly technical education.
- **DigitalOcean ($200):** Host open-weight Gemma 4 model on GPU infrastructure.
- **Gemma ($200):** Core AI experience (open-weight inference, fine-tuning, tool use).
- **Backboard:** Pico's long-term memory, RAG, and retrieval of learner context.
- **ElevenLabs:** Pico's voice and text-to-speech.
- **Entire:** Capture relevant agent/development sessions as evidence.
- **GitHub Copilot:** Meaningful use via CLI, actions, testing, or code review.
- **Mastra:** Primary agent orchestration framework.
- **MongoDB Atlas:** Primary database for user state, lessons, memories.
- **Sentry:** Agent Tracing (execution, latency, errors, tokens).
- **SerpApi:** Genuine live web search for fresh tech discoveries and hackathons.
- **Temporal:** Durable workflows (Daily Discovery, Weekly Digest, Reminders).
- **Tiger Data:** Semantic retrieval/search (pgvector, embeddings).

## AI Strategy (Gemma 4)
- Core reasoning engine and tutor.
- Open-weight allows model customization, local/private deployment potential, and experimentation.

## Database Architecture (MongoDB Atlas)
Collections:
- `users`, `pico_profiles`, `conversations`, `memories`, `interests`, `learning_paths`, `lessons`, `quizzes`, `quiz_attempts`, `progress`, `xp_events`, `achievements`, `tech_discoveries`, `saved_resources`, `hackathons`, `recommendations`

## Development Principles
1. Working product.
2. Clean architecture.
3. Real partner integrations.
4. Strong user experience.
5. Demonstrable AI behaviour.
6. Reproducibility.
7. Documentation.

## Current Limitations & Known Issues
- Bootstrapping Phase (Phase 1)
- Capacitor, MongoDB, and partner integrations are pending.

## Deployment Architecture
- Render (App/Agent), DigitalOcean (GPU Model), MongoDB Atlas (DB).
