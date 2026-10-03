import { Button } from "@/components/ui/button";

export default function DiscoverPage() {
  return (
    <main className="p-6 max-w-md mx-auto space-y-6">
      <header className="pt-4 pb-2">
        <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
        <p className="text-zinc-500">Find new tech, AI models, and events.</p>
      </header>
      
      <section className="space-y-4">
        {/* Placeholder Discovery Card */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">AI Model</span>
            <span className="text-xs text-zinc-400">Today</span>
          </div>
          <h3 className="text-xl font-bold mb-1">Gemma 4 Released!</h3>
          <p className="text-zinc-600 text-sm mb-4">
            Google just released a new AI model. You know how ChatGPT can understand what you type? This new model can also understand images!
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="default" className="w-full">Explain this</Button>
            <Button size="sm" variant="outline" className="w-full">Save</Button>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">Hackathon</span>
            <span className="text-xs text-zinc-400">Upcoming</span>
          </div>
          <h3 className="text-xl font-bold mb-1">DEV Weekend Challenge</h3>
          <p className="text-zinc-600 text-sm mb-4">
            A beginner-friendly hackathon. Perfect time to build a small project!
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="default" className="w-full">Tell me more</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
