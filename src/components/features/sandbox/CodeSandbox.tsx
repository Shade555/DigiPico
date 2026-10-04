"use client";

import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CodeSandbox({ defaultCode = "console.log('Hello World!');" }: { defaultCode?: string }) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState<string[]>([]);

  const runCode = () => {
    setOutput([]);
    const logs: string[] = [];
    
    // Capture console.log
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    };

    try {
      // eslint-disable-next-line no-eval
      eval(code);
      if (logs.length === 0) logs.push("Execution completed with no output.");
    } catch (e: any) {
      logs.push(`Error: ${e.message}`);
    }

    // Restore console.log
    console.log = originalConsoleLog;
    setOutput(logs);
  };

  return (
    <div className="bg-[#0a0f24] rounded-2xl border border-[#1e2753] overflow-hidden shadow-xl">
      <div className="flex items-center justify-between bg-[#131b3b] px-4 py-2 border-b border-[#1e2753]">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">JavaScript Sandbox</span>
        <div className="flex gap-2">
          <Button onClick={() => setCode(defaultCode)} variant="ghost" size="sm" className="h-7 px-2 text-slate-400 hover:text-white">
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button onClick={runCode} size="sm" className="h-7 px-3 bg-green-600 hover:bg-green-500 text-white rounded-md">
            <Play className="w-3 h-3 mr-1" /> Run
          </Button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-40 bg-[#080b1a] text-blue-300 font-mono text-sm p-4 focus:outline-none resize-none"
        spellCheck={false}
      />
      <div className="bg-[#050711] p-4 min-h-[5rem] border-t border-[#1e2753]">
        <div className="text-xs font-bold text-slate-500 mb-2">OUTPUT</div>
        {output.length === 0 ? (
          <p className="text-slate-600 text-xs italic">Click run to execute code...</p>
        ) : (
          <div className="space-y-1 font-mono text-xs">
            {output.map((line, i) => (
              <div key={i} className={line.startsWith("Error:") ? "text-red-400" : "text-green-400"}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
