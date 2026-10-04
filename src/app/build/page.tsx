"use client";

import { motion } from "framer-motion";
import { Play, CheckCircle2, ChevronRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BuildPage() {
  const challenges = [
    {
      id: 1,
      title: "Make an API Request",
      description: "Ask a public server for a random joke using JavaScript.",
      difficulty: "Beginner",
      completed: true,
    },
    {
      id: 2,
      title: "Talk to Gemini",
      description: "Send a simple prompt to a language model and print the reply.",
      difficulty: "Beginner",
      completed: false,
      active: true,
    },
    {
      id: 3,
      title: "Build a Weather App",
      description: "Connect to a weather API and display the temperature.",
      difficulty: "Intermediate",
      completed: false,
    }
  ];

  return (
    <main className="p-6 max-w-md mx-auto space-y-6 pb-24">
      <header className="pt-4 pb-2">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Hands-on</h1>
        <p className="text-zinc-500 font-medium mt-1">Learn by doing. Complete tiny challenges.</p>
      </header>

      <div className="space-y-4">
        {challenges.map((challenge, i) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={challenge.id}
            className={`relative p-5 rounded-3xl border-2 transition-all ${
              challenge.completed 
                ? "bg-green-50 border-green-200" 
                : challenge.active 
                  ? "bg-white border-blue-500 shadow-md scale-[1.02]" 
                  : "bg-white border-zinc-100 opacity-60"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                challenge.completed ? "bg-green-200 text-green-800" : challenge.active ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-500"
              }`}>
                {challenge.difficulty}
              </span>
              {challenge.completed && <CheckCircle2 className="w-5 h-5 text-green-600" />}
            </div>
            
            <h3 className="font-bold text-lg text-zinc-900 leading-tight mb-1">{challenge.title}</h3>
            <p className="text-sm text-zinc-600 mb-4 leading-relaxed">{challenge.description}</p>

            {challenge.active && (
              <div className="bg-zinc-900 rounded-2xl p-4 overflow-hidden relative group">
                <div className="flex items-center gap-2 mb-3 border-b border-zinc-700 pb-2">
                  <Terminal className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs text-zinc-400 font-mono">script.js</span>
                </div>
                <pre className="text-xs font-mono text-green-400 leading-relaxed overflow-x-auto">
                  <code>
                    <span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> fetch(<span className="text-yellow-300">"/api/chat"</span>);{'\n'}
                    <span className="text-purple-400">const</span> data = <span className="text-purple-400">await</span> response.json();{'\n'}
                    console.log(data);
                  </code>
                </pre>
                
                <Button className="w-full mt-4 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold transition-transform active:scale-95">
                  <Play className="w-4 h-4 mr-2" /> Run Code
                </Button>
              </div>
            )}
            
            {!challenge.active && !challenge.completed && (
              <Button variant="ghost" className="w-full mt-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl">
                Start Challenge <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </main>
  );
}
