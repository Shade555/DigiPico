"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Code, Terminal, ArrowRight } from "lucide-react";

export default function DiscoverPage() {
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
    <main className="p-6 max-w-md mx-auto space-y-6 pb-24">
      <header className="pt-4 pb-2">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Discover</h1>
        <p className="text-zinc-500 font-medium mt-1">Fresh tech concepts curated for you.</p>
      </header>
      
      <motion.section 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="space-y-5"
      >
        {/* Card 1 */}
        <motion.div variants={item} className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> AI Model
              </span>
              <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">Just now</span>
            </div>
            <h3 className="text-2xl font-black mb-2 text-zinc-900 leading-tight">Gemma 4 Released!</h3>
            <p className="text-zinc-600 text-sm mb-5 leading-relaxed">
              Google just released a new AI model. You know how ChatGPT can understand what you type? This new model can actually understand images and video too!
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-sm">
                Pico, explain this! <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div variants={item} className="bg-white border border-purple-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <span className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase tracking-wider">
                <Terminal className="w-3 h-3" /> Hackathon
              </span>
              <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">Upcoming</span>
            </div>
            <h3 className="text-2xl font-black mb-2 text-zinc-900 leading-tight">DEV Weekend Challenge</h3>
            <p className="text-zinc-600 text-sm mb-5 leading-relaxed">
              A beginner-friendly online hackathon. It is the absolute perfect time to try building your first tiny web project!
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="w-full rounded-xl font-bold bg-purple-50 text-purple-700 hover:bg-purple-100">
                Tell me more
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}
