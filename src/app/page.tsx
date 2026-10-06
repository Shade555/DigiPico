import { ChatInterface } from "@/components/features/chat/ChatInterface";

export default function Home() {
  return (
    <main className="fixed inset-0 pb-16 flex flex-col bg-[#080b1a] text-slate-100">
      <div className="flex-1 w-full mx-auto max-w-md h-full">
        <ChatInterface />
      </div>
    </main>
  );
}
