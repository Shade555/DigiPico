"use client";

import { PicoMascot } from "@/components/features/pico/PicoMascot";
import { calculateLevel, getPicoStage, ACHIEVEMENTS } from "@/lib/gamification";
import { showLocalNotification } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { BellRing } from "lucide-react";

export default function ProfilePage() {
  // Mock data
  const userXp = 650; 
  const streak = 4;
  const userAchievements = ["first_question", "streak_3"];

  const { level, nextLevelXp, progress } = calculateLevel(userXp);
  const stage = getPicoStage(level);

  const testPushNotification = async () => {
    await showLocalNotification(
      "Pico's Daily Tech Discovery 🐣", 
      "Did you know? Gemma 4 was just released with amazing new visual reasoning capabilities!"
    );
  };

  return (
    <main className="p-6 max-w-md mx-auto space-y-6 pb-24">
      <header className="pt-4 pb-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Pico</h1>
      </header>
      
      <section className="flex flex-col items-center justify-center py-6">
        <PicoMascot size="lg" mood="excited" />
        <h2 className="text-xl font-bold mt-4">Level {level}: {stage.name}</h2>
        <p className="text-sm text-zinc-500 mt-1 text-center max-w-xs">{stage.description}</p>
        <p className="text-xs text-zinc-400 mt-3">{userXp} / {nextLevelXp} XP</p>
        
        <div className="w-full bg-zinc-200 rounded-full h-2 mb-3 mt-1 max-w-xs overflow-hidden">
          <div className="bg-yellow-400 h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl mb-1">🔥</div>
          <div className="font-bold text-xl">{streak} Days</div>
          <div className="text-xs text-zinc-500">Learning Streak</div>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl mb-1">🏆</div>
          <div className="font-bold text-xl">{userAchievements.length}</div>
          <div className="text-xs text-zinc-500">Achievements</div>
        </div>
      </section>

      <section className="bg-white border rounded-xl p-5 shadow-sm mt-4">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div>
            <h3 className="font-bold">Daily Tech News</h3>
            <p className="text-xs text-zinc-500">Get push notifications via Temporal Cron.</p>
          </div>
          <Button onClick={testPushNotification} size="icon" variant="outline" className="rounded-full shadow-sm text-blue-600 border-blue-200 hover:bg-blue-50">
            <BellRing className="w-4 h-4" />
          </Button>
        </div>

        <h3 className="font-bold mb-3">Your Badges</h3>
        <ul className="space-y-3">
          {userAchievements.map(id => {
            const achievement = ACHIEVEMENTS.find(a => a.id === id);
            if (!achievement) return null;
            return (
              <li key={id} className="flex items-center gap-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{achievement.title}</p>
                  <p className="text-xs text-zinc-500">{achievement.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
