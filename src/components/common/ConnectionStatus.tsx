"use client";

import React from "react";
import { Badge } from "../ui/Badge";
import { Wifi, WifiOff } from "lucide-react";
import { useSocketStore } from "@/stores/useSocketStore";

export const ConnectionStatus: React.FC = () => {
  const { isConnected, isFallback, latency } = useSocketStore();

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
