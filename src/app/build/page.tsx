import { Button } from "@/components/ui/button";

export default function BuildPage() {
  return (
    <main className="p-6 max-w-md mx-auto space-y-6">
      <header className="pt-4 pb-2">
        <h1 className="text-3xl font-bold tracking-tight">Build</h1>
        <p className="text-zinc-500">Put your knowledge into practice.</p>
      </header>
      
      <section className="space-y-4">
        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🛠️</div>
          <h3 className="text-lg font-bold mb-2">Hands-on Challenges</h3>
          <p className="text-sm text-zinc-500 mb-4">
            You've learned about APIs. Want to make your first API request right now?
          </p>
          <Button>Start Challenge</Button>
        </div>

        <div className="bg-zinc-900 text-white rounded-xl p-5 shadow-sm mt-6">
          <h3 className="text-lg font-bold mb-1">Project: Weather Assistant</h3>
          <p className="text-zinc-400 text-sm mb-4">
            Use APIs and basic AI to tell you if you need an umbrella today.
          </p>
          <Button variant="secondary" className="w-full">View Project Plan</Button>
        </div>
      </section>
    </main>
  );
}
