"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PicoMascot } from "@/components/features/pico/PicoMascot";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Lock, Loader2 } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    const password = (document.getElementById("passwordInput") as HTMLInputElement)?.value;
    
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email.toLowerCase(),
          password: password,
          action: isLogin ? "login" : "signup"
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        setIsLoading(false);
        return;
      }
      
      localStorage.setItem("digipico_user_id", data.userId);
      
      if (!isLogin) {
        const interest = (document.getElementById("interestInput") as HTMLInputElement)?.value || "Introduction to AI";
        localStorage.setItem("digipico_interest", interest);
      }
      
      router.push("/discover");
    } catch {
      alert("Authentication failed.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#080b1a] text-slate-100 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-[#131b3b] p-6 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-[#1e2753]">
            <PicoMascot size="lg" mood="excited" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            {isLogin ? "Ready to learn something new?" : "Your personal AI tech companion awaits."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="email" 
              placeholder="Email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#131b3b] border border-[#1e2753] rounded-2xl py-4 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="password" 
              id="passwordInput"
              placeholder="Password" 
              required
              className="w-full bg-[#131b3b] border border-[#1e2753] rounded-2xl py-4 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <input 
                type="text" 
                placeholder="What do you want to learn? (e.g. Robotics, React)" 
                required
                id="interestInput"
                className="w-full bg-[#131b3b] border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] rounded-2xl py-4 px-5 text-slate-100 placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-6 font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all active:scale-95 mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {isLogin ? "Sign In" : "Get Started"} <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
