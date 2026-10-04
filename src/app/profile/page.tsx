"use client";

import { useEffect, useState } from "react";
import { PicoMascot } from "@/components/features/pico/PicoMascot";
import { calculateLevel, getPicoStage, ACHIEVEMENTS } from "@/lib/gamification";
import { showLocalNotification } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { BellRing, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [userData, setUserData] = useState<{ xp: number; streak: number; achievements: string[] } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userId = localStorage.getItem("digipico_user_id") || "test_user_123";
        const res = await fetch(`/api/profile?userId=${userId}`);
        const data = await res.json();
        setUserData(data);
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
    fetchProfile();
  }, []);

  const testPushNotification = async () => {
    await showLocalNotification(
      "Pico's Daily Tech Discovery 🐣", 
      "Did you know? Gemma 4 was just released with amazing new visual reasoning capabilities!"
    );
  };

  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080b1a]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const { level, nextLevelXp, progress } = calculateLevel(userData.xp);
  const stage = getPicoStage(level);

  return (
    <main className="p-6 max-w-md mx-auto space-y-6 pb-24 bg-[#080b1a] min-h-screen text-slate-100">
      <header className="pt-4 pb-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Pico</h1>
      </header>
      
      <section className="flex flex-col items-center justify-center py-6">
        <div className="bg-[#131b3b] p-6 rounded-full shadow-inner mb-4">
          <PicoMascot size="lg" mood="excited" />
        </div>
        <h2 className="text-xl font-bold mt-2">Level {level}: {stage.name}</h2>
        <p className="text-sm text-slate-400 mt-1 text-center max-w-xs">{stage.description}</p>
        <p className="text-xs text-blue-400 font-bold mt-4 tracking-wider uppercase">{userData.xp} / {nextLevelXp} XP</p>
        
        <div className="w-full bg-[#131b3b] rounded-full h-3 mb-3 mt-2 max-w-xs overflow-hidden border border-[#1e2753]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-blue-500 h-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-[#0a0f24] border border-[#1e2753] rounded-2xl p-4 text-center shadow-md">
          <div className="text-3xl mb-2 drop-shadow-md">🔥</div>
          <div className="font-bold text-2xl text-slate-100">{userData.streak} Days</div>
          <div className="text-xs text-slate-400 font-medium">Learning Streak</div>
        </div>
        <div className="bg-[#0a0f24] border border-[#1e2753] rounded-2xl p-4 text-center shadow-md">
          <div className="text-3xl mb-2 drop-shadow-md">🏆</div>
          <div className="font-bold text-2xl text-slate-100">{userData.achievements.length}</div>
          <div className="text-xs text-slate-400 font-medium">Achievements</div>
        </div>
      </section>

      <section className="bg-[#0a0f24] border border-[#1e2753] rounded-2xl p-5 shadow-md mt-4">
        <div className="flex justify-between items-center mb-5 border-b border-[#1e2753] pb-4">
          <div>
            <h3 className="font-bold text-slate-100">Daily Tech News</h3>
            <p className="text-xs text-slate-400 mt-1">Get push notifications via Temporal Cron.</p>
          </div>
          <Button onClick={testPushNotification} size="icon" className="rounded-full shadow-lg bg-[#131b3b] text-blue-400 border border-[#1e2753] hover:bg-blue-600 hover:text-white transition-colors">
            <BellRing className="w-4 h-4" />
          </Button>
        </div>

        <h3 className="font-bold mb-4 text-slate-100">Your Badges</h3>
        <ul className="space-y-4">
          {userData.achievements.map((id, i) => {
            const achievement = ACHIEVEMENTS.find(a => a.id === id);
            if (!achievement) return null;
            return (
              <motion.li 
                key={id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 bg-[#131b3b] p-3 rounded-xl border border-[#1e2753]"
              >
                <div className="text-3xl bg-[#0a0f24] p-2 rounded-lg shadow-inner">{achievement.icon}</div>
                <div>
                  <p className="text-sm font-bold text-slate-200">{achievement.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{achievement.description}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
