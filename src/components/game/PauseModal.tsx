"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Play, Settings, HelpCircle, LogOut } from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";
import { SettingsModal } from "../modals/SettingsModal";
import { HowToPlayModal } from "../modals/HowToPlayModal";
import { useRouter } from "next/navigation";

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ isOpen, onClose }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const router = useRouter();

  const handleExit = () => {
    useGameStore.getState().resetGame();
    onClose();
    router.push("/");
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Game Paused" maxWidth="sm">
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" className="w-full" onClick={onClose}>
            <Play className="w-5 h-5 fill-current" />
            Resume Fight
          </Button>

          <Button variant="secondary" size="md" className="w-full" onClick={() => setShowHowToPlay(true)}>
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            How to Play
          </Button>

          <Button variant="secondary" size="md" className="w-full" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4 text-slate-300" />
            Settings
          </Button>

          <Button variant="danger" size="md" className="w-full mt-2" onClick={handleExit}>
            <LogOut className="w-4 h-4" />
            Exit Match
          </Button>
        </div>
      </Modal>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
    </>
  );
};
