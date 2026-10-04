"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Terminal, ArrowRight, Loader2 } from "lucide-react";

export default function DiscoverPage() {
  const [discoveries, setDiscoveries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDiscoveries() {
      try {
        const userInterest = localStorage.getItem("digipico_interest") || "artificial intelligence";
        const res = await fetch(`/api/discover?interest=${encodeURIComponent(userInterest)}`);
        const data = await res.json();
        if (data.news) {
          setDiscoveries(data.news);
        }
      } catch (error) {
        console.error("Error fetching discoveries:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDiscoveries();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <main className="p-6 max-w-md mx-auto space-y-6 pb-24 bg-[#080b1a] min-h-screen text-slate-100">
      <header className="pt-4 pb-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-100">Discover</h1>
        <p className="text-slate-400 font-medium mt-1">Fresh tech concepts curated for you.</p>
      </header>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <motion.section 
          variants={container} 
          initial="hidden" 
          animate="show" 
          className="space-y-5"
        >
          {discoveries.map((card, index) => (
            <motion.div key={index} variants={item} className={`bg-[#0a0f24] border ${index % 2 === 0 ? 'border-blue-900/50' : 'border-purple-900/50'} rounded-3xl p-6 shadow-md relative overflow-hidden group`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${index % 2 === 0 ? 'bg-blue-600/10' : 'bg-purple-600/10'} rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150`}></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${index % 2 === 0 ? 'text-blue-400 bg-blue-900/40 border border-blue-800/50' : 'text-purple-400 bg-purple-900/40 border border-purple-800/50'}`}>
                    {index % 2 === 0 ? <Sparkles className="w-3 h-3" /> : <Terminal className="w-3 h-3" />} 
                    {card.type}
                  </span>
                  <span className="text-xs font-medium text-slate-400 bg-[#131b3b] border border-[#1e2753] px-2 py-1 rounded-full">{card.time}</span>
                </div>
                <h3 className="text-2xl font-black mb-2 text-slate-100 leading-tight line-clamp-2">{card.title}</h3>
                <p className="text-slate-300 text-sm mb-5 leading-relaxed line-clamp-3">
                  {card.description}
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => card.link ? window.open(card.link, '_blank') : null}
                    size="sm" 
                    className={`w-full rounded-xl font-bold shadow-sm ${index % 2 === 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-[#131b3b] border border-purple-900/50 text-purple-400 hover:bg-[#1a2347]'}`}
                  >
                    {index % 2 === 0 ? <>Pico, explain this! <ArrowRight className="w-4 h-4 ml-1" /></> : "Tell me more"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>
      )}
    </main>
  );
}
