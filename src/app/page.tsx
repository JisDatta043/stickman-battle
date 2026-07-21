"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Bot, Plus, LogIn, HelpCircle, Settings, Swords } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CreateRoomModal } from "@/components/modals/CreateRoomModal";
import { JoinRoomModal } from "@/components/modals/JoinRoomModal";
import { HowToPlayModal } from "@/components/modals/HowToPlayModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { ConnectionStatus } from "@/components/common/ConnectionStatus";
import { GitHubButton } from "@/components/common/GitHubButton";
import { useGameStore } from "@/stores/useGameStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useSocket } from "@/hooks/useSocket";
import { useRouter, useSearchParams } from "next/navigation";

function HomeContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const { createRoom } = useSocket();
  const { setGameMode, setGameStatus } = useGameStore();
  const { setP1Name, setP2Name } = usePlayerStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check URL query parameters for instant room joining link
  const joinParam = searchParams ? searchParams.get("join") : null;

  useEffect(() => {
    if (joinParam && joinParam.length === 6) {
      setShowJoinModal(true);
    }
  }, [joinParam]);

  const handlePlayVsBot = () => {
    setGameMode("bot");
    setP1Name("Player 1");
    setP2Name("Bot Alpha");
    setGameStatus("playing");
    router.push("/game");
  };

  const handleCreateRoomClick = () => {
    createRoom("Host Player");
    setShowCreateModal(true);
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-between p-6 sm:p-10 relative overflow-hidden bg-gradient-to-b from-[#0a0c14] via-[#0f1424] to-[#0a0c14]">
      {/* Background Decorative Neon Light Rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar Header */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10">
        <ConnectionStatus />
        <GitHubButton />
      </header>

      {/* Center Main Card & Game Logo */}
      <div className="w-full max-w-md flex flex-col items-center gap-8 my-auto z-10">
        {/* Game Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-2xl shadow-cyan-500/30 glow-cyan animate-pulse-glow">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-cyan-400">
              <Swords className="w-10 h-10" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white glow-text-cyan">
            STICKMAN <span className="text-cyan-400">BATTLE</span>
          </h1>
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Minimal Online PvP Fighting Game
          </p>
        </motion.div>

        {/* Main Action Menu Card */}
        <Card className="w-full flex flex-col gap-4 border-slate-800/80 shadow-2xl">
          {/* Play vs Bot */}
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-start text-base shadow-cyan-500/20"
            onClick={handlePlayVsBot}
          >
            <Bot className="w-6 h-6 text-cyan-200" />
            <div className="flex flex-col items-start text-left ml-1">
              <span className="font-extrabold">Play vs Bot</span>
              <span className="text-[11px] font-normal text-cyan-100/80">Single player practice AI</span>
            </div>
          </Button>

          {/* Create Room */}
          <Button
            variant="secondary"
            size="lg"
            className="w-full justify-start text-base border-slate-700 hover:border-cyan-500/50"
            onClick={handleCreateRoomClick}
          >
            <Plus className="w-6 h-6 text-cyan-400" />
            <div className="flex flex-col items-start text-left ml-1">
              <span className="font-bold">Create Room</span>
              <span className="text-[11px] font-normal text-slate-400">Host a multiplayer lobby</span>
            </div>
          </Button>

          {/* Join Room */}
          <Button
            variant="secondary"
            size="lg"
            className="w-full justify-start text-base border-slate-700 hover:border-blue-500/50"
            onClick={() => setShowJoinModal(true)}
          >
            <LogIn className="w-6 h-6 text-blue-400" />
            <div className="flex flex-col items-start text-left ml-1">
              <span className="font-bold">Join Room</span>
              <span className="text-[11px] font-normal text-slate-400">Enter 6-character room PIN</span>
            </div>
          </Button>

          {/* Sub Controls: How to Play & Settings */}
          <div className="grid grid-cols-2 gap-3 mt-2 pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => setShowHowToPlayModal(true)}
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              How to Play
            </Button>

            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => setShowSettingsModal(true)}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Settings
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-slate-500 font-medium z-10">
        60 FPS Arcade Physics Engine • React 19 • Next.js 15
      </footer>

      {/* Modals */}
      <CreateRoomModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <JoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        initialCode={joinParam || ""}
      />
      <HowToPlayModal isOpen={showHowToPlayModal} onClose={() => setShowHowToPlayModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0c14]" />}>
      <HomeContent />
    </Suspense>
  );
}
