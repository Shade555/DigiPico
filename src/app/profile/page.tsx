"use client";

import { useEffect, useState } from "react";
import { PicoMascot } from "@/components/features/pico/PicoMascot";
import { calculateLevel, getPicoStage, ACHIEVEMENTS } from "@/lib/gamification";
import { Button } from "@/components/ui/button";
import { BellRing, Loader2, Flame, Trophy, HelpCircle, Hammer, Globe, Rocket, Brain, Leaf, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
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
    // Basic Notification API
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification("Pico's Daily Tech Discovery", {
        body: "Did you know? Gemma 4 was just released with amazing new visual reasoning capabilities!",
        icon: "/pico-icon.png" // Fallback icon
      });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Pico's Daily Tech Discovery", {
          body: "Did you know? Gemma 4 was just released with amazing new visual reasoning capabilities!"
        });
      }
    }
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
        <h2 className="text-xl font-bold mt-2 flex items-center gap-2">
          Level {level}: {stage.name.replace(/^[^\w]*/, '')} 
          {level <= 3 ? <Search className="w-5 h-5 text-yellow-500" /> : level <= 6 ? <Leaf className="w-5 h-5 text-green-500" /> : level <= 9 ? <Brain className="w-5 h-5 text-pink-500" /> : <Rocket className="w-5 h-5 text-blue-500" />}
        </h2>
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
          <div className="flex justify-center mb-2 drop-shadow-md"><Flame className="w-8 h-8 text-orange-500" /></div>
          <div className="font-bold text-2xl text-slate-100">{userData.streak} Days</div>
          <div className="text-xs text-slate-400 font-medium">Learning Streak</div>
        </div>
        <div className="bg-[#0a0f24] border border-[#1e2753] rounded-2xl p-4 text-center shadow-md">
          <div className="flex justify-center mb-2 drop-shadow-md"><Trophy className="w-8 h-8 text-yellow-500" /></div>
          <div className="font-bold text-2xl text-slate-100">{userData.achievements.length}</div>
          <div className="text-xs text-slate-400 font-medium">Achievements</div>
        </div>
      </section>

      <section className="bg-[#0a0f24] border border-[#1e2753] rounded-2xl p-5 shadow-md mt-4">
        <div className="flex justify-between items-center mb-5 border-b border-[#1e2753] pb-4">
          <div>
            <h3 className="font-bold text-slate-100">Daily Tech News</h3>
            <p className="text-xs text-slate-400 mt-1">Get push notifications via browser API.</p>
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
                <div className="bg-[#0a0f24] p-3 rounded-lg shadow-inner">
                  {achievement.id === "first_login" ? <Sparkles className="w-6 h-6 text-yellow-300" /> :
                   achievement.id === "first_question" ? <HelpCircle className="w-6 h-6 text-purple-400" /> : 
                   achievement.id === "streak_3" ? <Flame className="w-6 h-6 text-orange-500" /> : 
                   achievement.id === "first_project" ? <Hammer className="w-6 h-6 text-slate-400" /> : 
                   <Globe className="w-6 h-6 text-blue-400" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">{achievement.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{achievement.description}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </section>

      <section className="bg-[#0a0f24] border border-[#1e2753] rounded-2xl p-5 shadow-md mt-4">
        <h3 className="font-bold mb-2 text-slate-100">Add New Learning Path</h3>
        <p className="text-xs text-slate-400 mb-4">Add a new tech topic. It will instantly generate a new curriculum on your Learn tab!</p>
        <div className="flex gap-2">
          <input 
            type="text"
            id="newInterestInput"
            placeholder="e.g. Next.js, Python, DevOps"
            className="flex-1 bg-[#131b3b] border border-[#1e2753] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <Button onClick={() => {
            const input = document.getElementById('newInterestInput') as HTMLInputElement;
            if (input.value.trim()) {
              const current = JSON.parse(localStorage.getItem("digipico_interests") || "[]");
              if (current.length === 0) {
                // Migrate legacy string
                const legacy = localStorage.getItem("digipico_interest");
                if (legacy) current.push(legacy);
              }
              current.push(input.value.trim());
              localStorage.setItem("digipico_interests", JSON.stringify([...new Set(current)]));
              input.value = "";
              alert("New Learning Path Added! Check the Learn tab.");
            }
          }} className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md">
            Add
          </Button>
        </div>
      </section>

      <section className="mt-8 space-y-3">
        <Button 
          variant="outline" 
          className="w-full border-[#1e2753] text-slate-300 hover:bg-[#131b3b]"
          onClick={() => {
            localStorage.removeItem("digipico_user_id");
            localStorage.removeItem("digipico_interest");
            localStorage.removeItem("digipico_interests");
            router.push("/auth");
          }}
        >
          Log Out
        </Button>
        <Button 
          variant="destructive" 
          className="w-full bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-900"
          onClick={async () => {
            if (confirm("Are you sure you want to delete your account? All progress will be lost forever.")) {
              const userId = localStorage.getItem("digipico_user_id");
              if (userId) {
                await fetch(`/api/user?userId=${userId}`, { method: 'DELETE' });
              }
              localStorage.clear();
              router.push("/auth");
            }
          }}
        >
          Delete Account
        </Button>
      </section>
    </main>
  );
}
