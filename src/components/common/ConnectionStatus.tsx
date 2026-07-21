"use client";

import React, { useState } from "react";
import { Badge } from "../ui/Badge";
import { Wifi, WifiOff, AlertTriangle, Info } from "lucide-react";
import { useSocketStore } from "@/stores/useSocketStore";

export const ConnectionStatus: React.FC = () => {
  const { isConnected, isFallback, isLocalhostInProduction, latency } = useSocketStore();
  const [showTooltip, setShowTooltip] = useState(false);

  if (isLocalhostInProduction) {
    return (
      <div className="relative flex items-center gap-2">
        <Badge
          variant="warning"
          className="gap-1.5 shadow-sm bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-pointer hover:bg-amber-500/30 transition-colors"
          onClick={() => setShowTooltip(!showTooltip)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Localhost Backend Notice</span>
          <Info className="w-3 h-3 ml-0.5 text-amber-400/70" />
        </Badge>

        {showTooltip && (
          <div className="absolute top-full left-0 mt-2 w-80 p-3.5 bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-xl shadow-2xl text-xs text-slate-200 z-50">
            <p className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Vercel Setup Required
            </p>
            <p className="text-slate-300 leading-relaxed mb-2">
              This production deployment is trying to connect to <code className="text-amber-300 bg-slate-800 px-1 py-0.5 rounded font-mono">localhost:3001</code>.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Set Environment Variable in Vercel:</p>
              <p className="font-mono text-cyan-300 bg-slate-950 p-1.5 rounded border border-slate-800 select-all">
                NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="warning" className="gap-1.5 shadow-sm">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline</span>
        </Badge>
      </div>
    );
  }

  if (isFallback) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="warning" className="gap-1.5 shadow-sm">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Mock Online Mode</span>
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="success" className="gap-1.5 shadow-sm">
        <Wifi className="w-3.5 h-3.5" />
        <span>Online ({latency === 0 ? "<1ms" : `${latency}ms`})</span>
      </Badge>
    </div>
  );
};
