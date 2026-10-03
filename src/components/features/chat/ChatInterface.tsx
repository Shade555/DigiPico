"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PicoMascot } from "@/components/features/pico/PicoMascot";

export function ChatInterface() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/ask-pico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      
      if (data.content) {
        setMessages([...newMessages, { role: "assistant", content: data.content }]);
      }
    } catch (error) {
      console.error("Error talking to Pico:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 mt-10">
            <PicoMascot size="sm" mood="curious" />
            <p className="mt-4">Ask me anything about technology!</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-xl px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-900'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t pt-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Pico..." 
          className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} className="rounded-full rounded-l-none">Send</Button>
      </div>
    </div>
  );
}
