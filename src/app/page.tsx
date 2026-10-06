import { ChatInterface } from "@/components/features/chat/ChatInterface";

export default function Home() {
  return (
    <main className="flex flex-col bg-[#080b1a] text-slate-100 min-h-screen pb-32">
      <div className="w-full mx-auto max-w-md relative">
        <ChatInterface />
      </div>
    </main>
  );
}
