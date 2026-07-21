"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Copy, Share2, Loader2, Check, UserCheck, Play } from "lucide-react";
import { useRoomStore } from "@/stores/useRoomStore";
import { useGameStore } from "@/stores/useGameStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const { roomCode, room, isCreating } = useRoomStore();
  const { setGameMode, setGameStatus } = useGameStore();
  const { setP1Name, setP2Name } = usePlayerStore();
  const router = useRouter();

  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    if (!roomCode || typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}/?join=${roomCode}`;
    if (navigator.share) {
      navigator.share({
        title: "Join Stickman Battle!",
        text: `Join my Stickman Battle room code: ${roomCode}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartGame = () => {
    setGameMode("pvp");
    setP1Name(room?.players[0]?.name || "Player 1 (Host)");
    setP2Name(room?.players[1]?.name || "Player 2");
    setGameStatus("playing");
    onClose();
    router.push("/game");
  };

  const hasGuestJoined = room && room.players.length > 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create PvP Room" maxWidth="md">
      {isCreating ? (
        <div className="py-8 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
          <p className="text-slate-300 text-sm font-medium">Generating Room Code...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Room Code Box */}
          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Room Code</span>
            <span className="text-4xl font-extrabold font-mono text-cyan-400 tracking-widest drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              {roomCode || "------"}
            </span>

            {/* Copy & Share Action Buttons */}
            <div className="flex items-center gap-2 mt-2">
              <Button variant="secondary" size="sm" onClick={handleCopyCode}>
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Code"}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleShareLink}>
                <Share2 className="w-4 h-4 text-cyan-400" />
                Share Link
              </Button>
            </div>
          </div>

          {/* Player Joined Status */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  hasGuestJoined ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"
                }`}
              />
              <span className="text-sm font-medium text-slate-200">
                {hasGuestJoined ? "Player 2 Joined!" : "Waiting for another player..."}
              </span>
            </div>

            {hasGuestJoined ? (
              <UserCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
            )}
          </div>

          {/* Start Game Action */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-cyan-500/30"
              disabled={!hasGuestJoined && false /* Allowed to test standalone */}
              onClick={handleStartGame}
            >
              <Play className="w-5 h-5 fill-current" />
              {hasGuestJoined ? "Start Match Now" : "Launch Match (Host Practice)"}
            </Button>
          </motion.div>
        </div>
      )}
    </Modal>
  );
};
