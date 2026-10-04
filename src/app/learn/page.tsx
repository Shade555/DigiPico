"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LearnPage() {
  const [learningPath, setLearningPath] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPath() {
      try {
        const res = await fetch("/api/learn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: "Introduction to AI" })
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
  }, []);

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
        <h1 className="text-3xl font-black tracking-tight text-slate-100">Learn</h1>
        <p className="text-slate-400 font-medium mt-1">Your personalized tech curriculum.</p>
      </header>

      {/* Progress Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0f24] text-slate-100 rounded-3xl p-6 shadow-md border border-[#1e2753]"
      >
        <h2 className="text-lg font-bold mb-4 opacity-90">Current Path: {learningPath.topic}</h2>
        <div className="w-full bg-[#131b3b] rounded-full h-3 overflow-hidden mb-2 border border-[#1e2753]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${learningPath.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-blue-500 h-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
          />
        </div>
        <p className="text-xs text-blue-400 font-bold tracking-wider text-right">{learningPath.progress}% Complete</p>
      </motion.div>

      {/* Path Steps */}
      <div className="space-y-4 pt-4 relative">
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-[#1e2753] z-0" />
        
        {learningPath.steps.map((step, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={step.id} 
            className={`flex items-center gap-4 relative z-10 ${step.status === 'locked' ? 'opacity-40' : ''}`}
          >
            <div className="bg-[#080b1a] py-2">
              {step.status === 'completed' ? (
                <CheckCircle2 className="w-8 h-8 text-green-500 bg-[#080b1a] rounded-full" />
              ) : step.status === 'current' ? (
                <div className="w-8 h-8 rounded-full border-4 border-blue-500 bg-[#080b1a] flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <div className="w-2.5 h-2.5 bg-blue-400 rounded-full" />
                </div>
              ) : (
                <Circle className="w-8 h-8 text-[#1e2753] bg-[#080b1a] rounded-full" />
              )}
            </div>
            
            <div className={`flex-1 p-4 rounded-2xl border ${step.status === 'current' ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-[#0a0f24]' : 'border-[#1e2753] bg-[#0a0f24]'}`}>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{step.type}</span>
              <h3 className={`font-bold ${step.status === 'current' ? 'text-blue-400' : 'text-slate-300'}`}>{step.title}</h3>
              {step.status === 'current' && (
                <Button size="sm" className="w-full mt-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white">
                  Continue Lesson <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
