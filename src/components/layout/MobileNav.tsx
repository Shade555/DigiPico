"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, Hammer, User, MessageCircle } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Discover", href: "/discover", icon: Compass },
    { name: "Learn", href: "/learn", icon: BookOpen },
    { name: "Chat", href: "/", icon: MessageCircle },
    { name: "Build", href: "/build", icon: Hammer },
    { name: "Profile", href: "/profile", icon: User },
  ];

  if (pathname === '/auth') return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-[#0a0f24] border-t border-[#1e2753] safe-area-bottom">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`inline-flex flex-col items-center justify-center px-5 hover:bg-[#131b3b] transition-colors ${
                isActive ? "text-blue-400" : "text-slate-400"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
