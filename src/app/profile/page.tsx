import { PicoMascot } from "@/components/features/pico/PicoMascot";
import { calculateLevel, getPicoStage, ACHIEVEMENTS } from "@/lib/gamification";

export default function ProfilePage() {
  // Mock data - would be fetched from DB in a real server component
  const userXp = 650; 
  const streak = 4;
  const userAchievements = ["first_question", "streak_3"];

  const { level, nextLevelXp, progress } = calculateLevel(userXp);
  const stage = getPicoStage(level);

  return (
    <main className="p-6 max-w-md mx-auto space-y-6">
      <header className="pt-4 pb-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Pico</h1>
      </header>
      
      <section className="flex flex-col items-center justify-center py-6">
        <PicoMascot size="lg" mood="excited" />
        <h2 className="text-xl font-bold mt-4">Level {level}: {stage.name}</h2>
        <p className="text-sm text-zinc-500 mt-1 text-center max-w-xs">{stage.description}</p>
        <p className="text-xs text-zinc-400 mt-3">{userXp} / {nextLevelXp} XP</p>
        
        <div className="w-full bg-zinc-200 rounded-full h-2 mb-3 mt-1 max-w-xs">
          <div className="bg-yellow-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
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
