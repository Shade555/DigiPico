"use client";

import { motion } from "framer-motion";

interface PicoMascotProps {
  mood?: "happy" | "thinking" | "excited" | "curious";
  size?: "sm" | "md" | "lg";
}

export function PicoMascot({ mood = "happy", size = "md" }: PicoMascotProps) {
  const sizeClasses = {
    sm: "w-16 h-16 text-3xl",
    md: "w-24 h-24 text-5xl",
    lg: "w-32 h-32 text-7xl",
  };

  const emojis = {
    happy: "🐣",
    thinking: "🤔",
    excited: "🎉",
    curious: "👀",
  };

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className={`flex items-center justify-center bg-blue-100 rounded-full shadow-sm ${sizeClasses[size]}`}
    >
      <span>{emojis[mood]}</span>
    </motion.div>
  );
}
