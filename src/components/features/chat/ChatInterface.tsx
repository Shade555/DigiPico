"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PicoMascot } from "@/components/features/pico/PicoMascot";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Volume2, VolumeX } from "lucide-react";
import { textToSpeech } from "@/lib/audio";

export function ChatInterface() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ask-pico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, threadId }),
      });
      const data = await res.json();
      
      if (data.threadId) {
        setThreadId(data.threadId);
      }
      
      if (data.content) {
        setMessages([...newMessages, { role: "assistant", content: data.content }]);
        
        if (isVoiceEnabled) {
          const audioBuffer = await textToSpeech(data.content);
          if (audioBuffer) {
            const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play();
          }
        }
      }
    } catch (error) {
      console.error("Error talking to Pico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden relative">
      <div className="bg-blue-50/50 p-4 border-b flex items-center justify-center gap-3">
        <PicoMascot size="sm" mood={isLoading ? "thinking" : "happy"} />
        <h2 className="font-bold text-blue-900 tracking-tight text-lg">Pico Tutor</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center text-zinc-500 mt-10 space-y-4"
            >
              <PicoMascot size="lg" mood="curious" />
              <p className="max-w-[200px] text-sm">Hi! I'm Pico. Ask me anything about technology, and I'll explain it simply!</p>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`rounded-2xl px-5 py-3 max-w-[85%] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-zinc-100 text-zinc-800 rounded-bl-sm border border-zinc-200'}`}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex justify-start"
            >
              <div className="bg-zinc-100 rounded-2xl rounded-bl-sm px-5 py-3 border border-zinc-200 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-xs text-zinc-500">Pico is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex gap-2 relative">
          <Button 
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            variant="ghost"
            className={`rounded-full w-12 h-12 p-0 flex items-center justify-center transition-colors ${isVoiceEnabled ? 'text-blue-600 bg-blue-50' : 'text-zinc-400'}`}
          >
            {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's an API?" 
            className="flex-1 rounded-full bg-zinc-100 border-transparent px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-md transition-transform active:scale-95"
          >
            <Send className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
