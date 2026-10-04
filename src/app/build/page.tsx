"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle2, ChevronRight, Terminal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [codeOutputs, setCodeOutputs] = useState<Record<number, string>>({});

  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  useEffect(() => {
    let storedTopics = JSON.parse(localStorage.getItem("digipico_interests") || "[]");
    if (storedTopics.length === 0) {
      const legacy = localStorage.getItem("digipico_interest") || "artificial intelligence";
      storedTopics = [legacy];
      localStorage.setItem("digipico_interests", JSON.stringify(storedTopics));
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTopics(storedTopics);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedTopic(storedTopics[0]);
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

  const runCode = async (id: number, template: string) => {
    setCodeOutputs(prev => ({ ...prev, [id]: "Running..." }));
    try {
      // Very simple sandbox execution using async function
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const fn = new AsyncFunction(template);
      const result = await fn();
      setCodeOutputs(prev => ({ ...prev, [id]: String(result) }));
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      setCodeOutputs(prev => ({ ...prev, [id]: `Error: ${errorMessage}` }));
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
              <div className="bg-[#050711] rounded-2xl p-4 overflow-hidden relative border border-[#1e2753]">
                <div className="flex items-center gap-2 mb-3 border-b border-[#1e2753] pb-2">
                  <Terminal className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-500 font-mono">script.js</span>
                </div>
                <pre className="text-xs font-mono text-green-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  <code>{challenge.template}</code>
                </pre>
                
                {codeOutputs[challenge.id] && (
                  <div className="mt-3 p-3 bg-[#131b3b] rounded-xl border border-[#1e2753]">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Output</span>
                    <span className="text-sm font-mono text-blue-400">{codeOutputs[challenge.id]}</span>
                  </div>
                )}
                
                <Button 
                  onClick={() => runCode(challenge.id, challenge.template)}
                  className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-500 rounded-xl font-bold transition-transform active:scale-95"
                >
                  <Play className="w-4 h-4 mr-2" /> Run Code
                </Button>
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
