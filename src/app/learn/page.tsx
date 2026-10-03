import { Button } from "@/components/ui/button";

export default function LearnPage() {
  return (
    <main className="p-6 max-w-md mx-auto space-y-6">
      <header className="pt-4 pb-2">
        <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
        <p className="text-zinc-500">Your personalized learning paths.</p>
      </header>
      
      <section className="space-y-4">
        <div className="bg-white border rounded-xl p-5 shadow-sm border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <h3 className="text-xl font-bold mb-1">Introduction to AI</h3>
          <div className="w-full bg-zinc-100 rounded-full h-2.5 mb-3 mt-3">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-sm text-zinc-500 mb-4">Lesson 3 of 7: What is an LLM?</p>
          <Button size="sm" className="w-full">Continue Learning</Button>
        </div>

        <h2 className="text-lg font-bold pt-2">Recommended for you</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🌐</div>
            <h4 className="font-semibold text-sm">How the Web Works</h4>
            <p className="text-xs text-zinc-500 mt-1">15 mins</p>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🔌</div>
            <h4 className="font-semibold text-sm">What is an API?</h4>
            <p className="text-xs text-zinc-500 mt-1">20 mins</p>
          </div>
        </div>
      </section>
    </main>
  );
}
