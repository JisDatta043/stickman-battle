"use client";

import React from "react";
import { Badge } from "../ui/Badge";
import { Wifi, WifiOff } from "lucide-react";
import { useSocketStore } from "@/stores/useSocketStore";

export const ConnectionStatus: React.FC = () => {
  const { isConnected, latency } = useSocketStore();

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <Badge variant="success" className="gap-1.5 shadow-sm">
          <Wifi className="w-3.5 h-3.5" />
          <span>Online ({latency > 0 ? `${latency}ms` : "Mock Mode"})</span>
        </Badge>
      ) : (
        <Badge variant="warning" className="gap-1.5 shadow-sm">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Fallback</span>
        </Badge>
      )}
    </div>
  );
};
