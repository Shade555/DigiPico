"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LearnPage() {
  const learningPath = {
    topic: "Introduction to AI",
    progress: 40,
    steps: [
      { id: 1, title: "What is AI?", type: "concept", status: "completed" },
      { id: 2, title: "Machine Learning Basics", type: "concept", status: "completed" },
      { id: 3, title: "How LLMs Work", type: "concept", status: "current" },
      { id: 4, title: "Prompt Engineering Quiz", type: "quiz", status: "locked" },
      { id: 5, title: "Build an AI App", type: "project", status: "locked" },
    ]
  };

  return (
    <main className="p-6 max-w-md mx-auto space-y-6 pb-24">
      <header className="pt-4 pb-2">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Learn</h1>
        <p className="text-zinc-500 font-medium mt-1">Your personalized tech curriculum.</p>
      </header>

      {/* Progress Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 text-white rounded-3xl p-6 shadow-lg"
      >
        <h2 className="text-lg font-bold mb-4 opacity-90">Current Path: {learningPath.topic}</h2>
        <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden mb-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${learningPath.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-blue-500 h-full rounded-full"
          />
        </div>
        <p className="text-xs text-zinc-400 font-medium text-right">{learningPath.progress}% Complete</p>
      </motion.div>

      {/* Path Steps */}
      <div className="space-y-4 pt-4 relative">
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-zinc-200 z-0" />
        
        {learningPath.steps.map((step, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={step.id} 
            className={`flex items-center gap-4 relative z-10 ${step.status === 'locked' ? 'opacity-50' : ''}`}
          >
            <div className="bg-white py-2">
              {step.status === 'completed' ? (
                <CheckCircle2 className="w-8 h-8 text-green-500 bg-white rounded-full" />
              ) : step.status === 'current' ? (
                <div className="w-8 h-8 rounded-full border-4 border-blue-500 bg-white flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                </div>
              ) : (
                <Circle className="w-8 h-8 text-zinc-300 bg-white rounded-full" />
              )}
            </div>
            
            <div className={`flex-1 p-4 rounded-2xl border ${step.status === 'current' ? 'border-blue-500 shadow-md bg-blue-50/50' : 'border-zinc-100 bg-white'}`}>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">{step.type}</span>
              <h3 className={`font-bold ${step.status === 'current' ? 'text-blue-900' : 'text-zinc-800'}`}>{step.title}</h3>
              {step.status === 'current' && (
                <Button size="sm" className="w-full mt-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold">
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
