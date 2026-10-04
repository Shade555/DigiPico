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
  const [threadId, setThreadId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    const userId = localStorage.getItem("digipico_user_id");
    if (!userId) {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/auth";
    } else {
      const history = localStorage.getItem("digipico_chat_history");
      const savedThreadId = localStorage.getItem("digipico_thread_id");
      if (history) {
        try {
          setTimeout(() => setMessages(JSON.parse(history)), 0);
          if (savedThreadId) setThreadId(savedThreadId);
        } catch (e) {
          console.error("Could not parse chat history", e);
        }
      }
      setTimeout(() => setIsCheckingAuth(false), 0);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("digipico_chat_history", JSON.stringify(messages));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (isCheckingAuth) return <div className="h-screen bg-[#080b1a]" />; // Prevent UI flash before redirect

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
        localStorage.setItem("digipico_thread_id", data.threadId);
      }
      
      if (data.content) {
        setMessages([...newMessages, { role: "assistant", content: data.content }]);
        
        try {
          const audioBuffer = await textToSpeech(data.content);
          if (audioBuffer) {
            const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play().catch(e => console.log("Audio playback failed quietly:", e));
          }
        } catch (e) {
          console.log("TTS failed quietly:", e);
        }
      }
    } catch (error) {
      console.error("Error talking to Pico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#080b1a] rounded-t-3xl overflow-hidden relative">
      <div className="bg-[#0a0f24] p-4 border-b border-[#1e2753] flex items-center justify-center gap-3">
        <PicoMascot size="sm" mood={isLoading ? "thinking" : "happy"} />
        <h2 className="font-bold text-slate-100 tracking-tight text-lg">Pico Tutor</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center text-slate-400 mt-10 space-y-4"
            >
              <PicoMascot size="lg" mood="curious" />
              <p className="max-w-[200px] text-sm">Hi! I&apos;m Pico. Ask me anything about technology, and I&apos;ll explain it simply!</p>
            </motion.div>
          )}

          {messages.map((msg, i) => {
            const isLastAssistantMessage = msg.role === 'assistant' && i === messages.length - 1;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`rounded-2xl px-5 py-3 max-w-[85%] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-[#131b3b] text-slate-200 rounded-bl-sm border border-[#1e2753]'}`}>
                  {isLastAssistantMessage ? <TypewriterText text={msg.content} /> : msg.content}
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex justify-start"
            >
              <div className="bg-[#131b3b] rounded-2xl rounded-bl-sm px-5 py-3 border border-[#1e2753] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-xs text-slate-400">Pico is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-[#0a0f24] border-t border-[#1e2753]">
        <div className="flex gap-2 relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's an API?" 
            className="flex-1 rounded-full bg-[#131b3b] text-slate-100 border-transparent px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
          >
            <Send className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i > text.length) clearInterval(intervalId);
    }, 15);
    return () => clearInterval(intervalId);
  }, [text]);

  return <>{displayedText}</>;
};
