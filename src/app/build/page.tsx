"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeSandbox } from "@/components/features/sandbox/CodeSandbox";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  completed: boolean;
  active: boolean;
  template: string;
}

export default function BuildPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  useEffect(() => {
    let storedTopics: string[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem("digipico_interests") || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        storedTopics = parsed;
      }
    } catch (e) {}
    
    if (storedTopics.length === 0) {
      const legacy = localStorage.getItem("digipico_interest") || "Artificial Intelligence";
      storedTopics = [legacy];
      localStorage.setItem("digipico_interests", JSON.stringify(storedTopics));
    }
    
    setTimeout(() => {
      setTopics(storedTopics);
      if (storedTopics.length > 0) {
        setSelectedTopic(storedTopics[0]);
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (!selectedTopic) return;
    
    async function fetchChallenges() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/build", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interest: selectedTopic })
        });
        const data = await res.json();
        setChallenges(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChallenges();
  }, [selectedTopic]);

  
  const handleComplete = async (id: number) => {
    // Optimistic UI update
    setChallenges(prev => prev.map(c => 
      c.id === id ? { ...c, completed: true } : c
    ));
    
    // Add XP and achievement
    try {
      const userId = localStorage.getItem("digipico_user_id");
      if (userId) {
        await fetch("/api/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, xpToAdd: 15, achievements: ["first_build"] })
        });
        alert("Challenge completed! +15 XP");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading || challenges.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080b1a]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <main className="p-6 max-w-md mx-auto space-y-6 pb-24 bg-[#080b1a] min-h-screen text-slate-100">
      <header className="pt-4 pb-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-100">Hands-on</h1>
        <p className="text-slate-400 font-medium mt-1">Learn by doing. Complete tiny challenges.</p>
      </header>

      {/* Topic Tabs */}
      {topics.length > 1 && (
        <div className="flex overflow-x-auto pb-2 gap-2 snap-x scrollbar-hide">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all snap-start ${
                selectedTopic === t 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "bg-[#131b3b] text-slate-400 border border-[#1e2753] hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {challenges.map((challenge, i) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={challenge.id}
            className={`relative p-5 rounded-3xl border-2 transition-all ${
              challenge.completed 
                ? "bg-green-900/20 border-green-800/50" 
                : challenge.active 
                  ? "bg-[#0a0f24] border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-[1.02]" 
                  : "bg-[#0a0f24] border-[#1e2753] opacity-60"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                challenge.completed ? "bg-green-900/40 text-green-400 border border-green-800/50" : challenge.active ? "bg-blue-900/40 text-blue-400 border border-blue-800/50" : "bg-[#131b3b] text-slate-400 border border-[#1e2753]"
              }`}>
                {challenge.difficulty}
              </span>
              {challenge.completed && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </div>
            
            <h3 className="font-bold text-lg text-slate-100 leading-tight mb-1">{challenge.title}</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">{challenge.description}</p>

            {challenge.active && (
              <div className="mt-4">
                <CodeSandbox defaultCode={challenge.template} onComplete={() => handleComplete(challenge.id)} />
              </div>
            )}
            
            {!challenge.active && !challenge.completed && (
              <Button variant="ghost" className="w-full mt-2 text-slate-500 hover:text-slate-300 hover:bg-[#131b3b] rounded-xl">
                Start Challenge <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </main>
  );
}
