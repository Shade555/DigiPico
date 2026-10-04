import { ChatInterface } from "@/components/features/chat/ChatInterface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#080b1a] pb-16 text-slate-100">
      <div className="flex-1 w-full mx-auto max-w-md">
        <ChatInterface />
      </div>
    </main>
  );
}
