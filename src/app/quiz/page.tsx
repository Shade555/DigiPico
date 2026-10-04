"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function QuizPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<{ topic: string, questions: Question[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const topics = JSON.parse(localStorage.getItem("digipico_interests") || "[]");
        const topic = topics.length > 0 ? topics[0] : "Artificial Intelligence";
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic })
        });
        const data = await res.json();
        setQuiz(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuiz();
  }, []);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOpt(idx);
    setShowResult(true);
    
    if (quiz && idx === quiz.questions[currentIdx].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = async () => {
    if (quiz && currentIdx < quiz.questions.length - 1) {
      setSelectedOpt(null);
      setShowResult(false);
      setCurrentIdx(i => i + 1);
    } else {
      // Finished
      const userId = localStorage.getItem("digipico_user_id");
      if (userId && userId.length === 24) {
        const pRes = await fetch(`/api/profile?userId=${userId}`);
        const pData = await pRes.json();
        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            updates: { xp: (pData.xp || 0) + (score * 50) } // 50 XP per correct answer
          })
        });
      }
      alert(`Quiz Finished! You scored ${score + (selectedOpt === quiz?.questions[currentIdx].correctIndex && !showResult ? 1 : 0)}/${quiz?.questions.length}. XP added!`);
      router.push("/learn");
    }
  };

  if (isLoading || !quiz) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080b1a]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-blue-400 ml-4 font-bold">Generating AI Quiz...</p>
      </div>
    );
  }

  const q = quiz.questions[currentIdx];

  return (
    <main className="p-6 max-w-md mx-auto min-h-screen bg-[#080b1a] text-slate-100 flex flex-col">
      <header className="flex items-center justify-between mb-8">
        <Link href="/learn" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <span className="text-xs font-bold bg-[#131b3b] text-blue-400 px-3 py-1 rounded-full border border-[#1e2753]">
          {currentIdx + 1} / {quiz.questions.length}
        </span>
      </header>

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-2">Topic: {quiz.topic}</h2>
        <h1 className="text-2xl font-black mb-8 leading-tight">{q.question}</h1>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let btnClass = "bg-[#131b3b] border-[#1e2753] hover:border-blue-500 hover:bg-[#1a254c] text-slate-200";
            if (showResult) {
              if (idx === q.correctIndex) {
                btnClass = "bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]";
              } else if (idx === selectedOpt) {
                btnClass = "bg-red-900 border-red-700 text-white opacity-50";
              } else {
                btnClass = "bg-[#131b3b] border-[#1e2753] opacity-30 text-slate-500";
              }
            }
            
            return (
              <motion.button
                whileTap={!showResult ? { scale: 0.98 } : {}}
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-2xl border-2 font-medium transition-all ${btnClass}`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        {showResult && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-5 rounded-2xl border ${
              selectedOpt === q.correctIndex 
                ? "bg-green-900/20 border-green-500/30" 
                : "bg-red-900/20 border-red-500/30"
            }`}
          >
            <h3 className={`font-bold mb-1 ${selectedOpt === q.correctIndex ? "text-green-400" : "text-red-400"}`}>
              {selectedOpt === q.correctIndex ? "Correct! 🎉" : "Not quite! 😅"}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
          </motion.div>
        )}
      </div>

      <div className="mt-8 pt-4">
        <Button 
          onClick={nextQuestion}
          disabled={!showResult}
          className={`w-full rounded-2xl py-6 font-bold text-lg transition-all ${
            showResult ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20" : "bg-[#131b3b] text-slate-500 opacity-50"
          }`}
        >
          {currentIdx === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
        </Button>
      </div>
    </main>
  );
}
