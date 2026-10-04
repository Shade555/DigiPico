"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step {
  id: number;
  title: string;
  description?: string;
  type: string;
  status: string;
}

interface LearningPath {
  topic: string;
  progress: number;
  steps: Step[];
  error?: string;
}

export default function LearnPage() {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  useEffect(() => {
    // Load topics from local storage
    let storedTopics = JSON.parse(localStorage.getItem("digipico_interests") || "[]");
    if (storedTopics.length === 0) {
      const legacy = localStorage.getItem("digipico_interest") || "Introduction to AI";
      storedTopics = [legacy];
      localStorage.setItem("digipico_interests", JSON.stringify(storedTopics));
    }
    setTopics(storedTopics);
    setSelectedTopic(storedTopics[0]);
  }, []);

  useEffect(() => {
    if (!selectedTopic) return;
    
    async function fetchPath() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/learn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: selectedTopic })
        });
        const data = await res.json();
        setLearningPath(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPath();
  }, [selectedTopic]);

  if (isLoading || !learningPath) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080b1a]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <main className="p-6 max-w-md mx-auto space-y-6 pb-24 bg-[#080b1a] min-h-screen text-slate-100">
      <header className="pt-4 pb-2">
        <h1 className="text-4xl font-black tracking-tight text-white mb-2">Curriculum</h1>
        <p className="text-blue-300 font-medium text-sm">AI-generated personalized learning path</p>
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

      {learningPath.error ? (
        <div className="p-6 bg-red-900/20 rounded-2xl border border-red-500/30 text-red-200 text-center mt-10">
          <p className="font-bold mb-2">Could not generate curriculum</p>
          <p className="text-sm opacity-80">{learningPath.error}. Try signing up with a more common tech topic!</p>
        </div>
      ) : (
        <>
          {/* Progress Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#131b3b] to-[#0a0f24] text-white rounded-[2rem] p-6 shadow-xl border border-[#1e2753]"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <h2 className="text-xl font-black mb-1 z-10 relative">{learningPath.topic}</h2>
        <p className="text-slate-400 text-sm mb-6 z-10 relative">Master the fundamentals</p>
        
        <div className="w-full bg-[#080b1a] rounded-full h-4 overflow-hidden mb-2 border border-[#1e2753] p-0.5 z-10 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${learningPath.progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 w-1/2 skew-x-12 animate-[shimmer_2s_infinite]" />
          </motion.div>
        </div>
        <div className="flex justify-between items-center z-10 relative">
          <span className="text-xs font-bold text-slate-500">PROGRESS</span>
          <span className="text-sm text-blue-300 font-black tracking-wider">{learningPath.progress}%</span>
        </div>
      </motion.div>

      {/* Path Steps */}
      <div className="space-y-3 pt-6 relative">
        <div className="absolute left-[1.35rem] top-10 bottom-10 w-0.5 bg-gradient-to-b from-blue-500/50 via-[#1e2753] to-transparent z-0" />
        
        {learningPath.steps.map((step: Step, i: number) => (
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            key={step.id} 
            className={`flex items-start gap-5 relative z-10 group ${step.status === 'locked' ? 'opacity-40' : ''}`}
          >
            <div className="bg-[#080b1a] py-2 mt-2">
              {step.status === 'completed' ? (
                <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500 flex items-center justify-center text-blue-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : step.status === 'current' ? (
                <div className="w-7 h-7 rounded-full border-2 border-white bg-[#0a0f24] flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-[#1e2753] bg-[#0a0f24] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#1e2753] rounded-full" />
                </div>
              )}
            </div>
            
            <div className={`flex-1 p-5 rounded-[1.5rem] border transition-all ${
              step.status === 'current' 
                ? 'border-slate-600 shadow-[0_0_20px_rgba(255,255,255,0.05)] bg-gradient-to-br from-[#131b3b] to-[#0a0f24]' 
                : 'border-[#1e2753] bg-[#0a0f24]/50 group-hover:bg-[#0a0f24]'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                  step.status === 'current' ? 'bg-blue-600 text-white' : 'bg-[#1e2753] text-slate-400'
                }`}>{step.type}</span>
              </div>
              <h3 className={`font-bold text-lg leading-tight ${step.status === 'current' ? 'text-white' : 'text-slate-300'}`}>{step.title}</h3>
              {step.description && (
                <p className={`text-xs mt-2 leading-relaxed ${step.status === 'current' ? 'text-slate-300' : 'text-slate-500'}`}>
                  {step.description}
                </p>
              )}
              
              {step.status === 'current' && (
                <Button size="sm" className="w-full mt-4 rounded-xl bg-white text-black hover:bg-slate-200 font-bold transition-transform active:scale-95 shadow-md">
                  Start Lesson <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      </>
      )}
    </main>
  );
}
