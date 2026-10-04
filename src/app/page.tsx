import { ChatInterface } from "@/components/features/chat/ChatInterface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#080b1a] p-4 pb-20 text-slate-100">
      <header className="mb-4 mt-2">
        <h1 className="text-2xl font-black tracking-tight text-center text-white">Chat with Pico</h1>
      </header>
      <div className="flex-1 max-w-md mx-auto w-full">
        <ChatInterface />
      </div>
    </main>
  );
}
