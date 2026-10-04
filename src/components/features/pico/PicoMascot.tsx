"use client";

import { motion } from "framer-motion";

interface PicoMascotProps {
  mood?: "happy" | "thinking" | "excited" | "curious";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PicoMascot({ mood = "happy", size = "md", className = "" }: PicoMascotProps) {
  const sizeMap = {
    sm: 48,
    md: 96,
    lg: 144,
  };

  const s = sizeMap[size];

  // Bird animation variants
  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const wingVariants = {
    animate: {
      rotate: [0, -20, 20, -20, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={floatVariants}
      animate="animate"
      className={`relative inline-block ${className}`}
      style={{ width: s, height: s }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Body */}
        <circle cx="50" cy="55" r="35" fill="#3B82F6" />
        
        {/* Belly */}
        <circle cx="50" cy="65" r="25" fill="#BFDBFE" />

        {/* Eyes based on mood */}
        {mood === "happy" && (
          <>
            <path d="M 35 45 Q 40 40 45 45" stroke="white" strokeWidth="3" strokeLinecap="round" fill="transparent"/>
            <path d="M 55 45 Q 60 40 65 45" stroke="white" strokeWidth="3" strokeLinecap="round" fill="transparent"/>
          </>
        )}
        {mood === "curious" && (
          <>
            <circle cx="40" cy="45" r="5" fill="white" />
            <circle cx="60" cy="45" r="7" fill="white" />
            <circle cx="40" cy="45" r="2" fill="#1E3A8A" />
            <circle cx="60" cy="45" r="3" fill="#1E3A8A" />
          </>
        )}
        {mood === "thinking" && (
          <>
            <line x1="35" y1="42" x2="45" y2="47" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="65" y1="42" x2="55" y2="47" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <circle cx="40" cy="48" r="3" fill="white" />
            <circle cx="60" cy="48" r="3" fill="white" />
          </>
        )}
        {mood === "excited" && (
          <>
            <path d="M 35 48 L 40 40 L 45 48" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="transparent"/>
            <path d="M 55 48 L 60 40 L 65 48" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="transparent"/>
          </>
        )}

        {/* Beak */}
        <path d="M 45 55 L 55 55 L 50 62 Z" fill="#FBBF24" />

        {/* Left Wing */}
        <motion.g variants={wingVariants} animate="animate" style={{ transformOrigin: '30px 60px' }}>
          <path d="M 15 55 C 5 60 10 75 25 70 C 20 65 25 55 15 55 Z" fill="#2563EB" />
        </motion.g>

        {/* Right Wing */}
        <motion.g variants={wingVariants} animate="animate" style={{ transformOrigin: '70px 60px' }}>
          <path d="M 85 55 C 95 60 90 75 75 70 C 80 65 75 55 85 55 Z" fill="#2563EB" />
        </motion.g>
      </svg>
    </motion.div>
  );
}
