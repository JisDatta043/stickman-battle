"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { LogIn, Loader2 } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useRoomStore } from "@/stores/useRoomStore";
import { useGameStore } from "@/stores/useGameStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { validateRoomCode } from "@/utils/roomCode";
import { useRouter } from "next/navigation";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose, initialCode = "" }) => {
  const [code, setCode] = useState(initialCode);
  const [playerName, setPlayerName] = useState("Guest Player");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { joinRoom } = useSocket();
  const { isJoining, error } = useRoomStore();
  const { setGameMode, setGameStatus } = useGameStore();
  const { setP1Name, setP2Name } = usePlayerStore();
  const router = useRouter();

  const handleJoin = () => {
    setValidationError(null);
    const { valid, error: valErr } = validateRoomCode(code);
    if (!valid) {
      setValidationError(valErr || "Invalid room code format.");
      return;
    }

    joinRoom(code.toUpperCase(), playerName);

    // Watch for success
    setTimeout(() => {
      const room = useRoomStore.getState().room;
      const roomErr = useRoomStore.getState().error;
      if (room && !roomErr) {
        setGameMode("pvp");
        setP1Name(room.players[0]?.name || "Host Player");
        setP2Name(playerName);
        setGameStatus("playing");
        onClose();
        router.push("/game");
      }
    }, 700);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Room" maxWidth="md">
      <div className="flex flex-col gap-5">
        <Input
          label="Your Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={16}
          placeholder="e.g. NinjaStick"
          className="font-sans uppercase-none tracking-normal"
        />

        <Input
          label="6-Character Room Code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          placeholder="e.g. X9K2W4"
          error={validationError || (error ? error.message : undefined)}
        />

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-2"
          onClick={handleJoin}
          disabled={isJoining || code.length < 6}
        >
          {isJoining ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting to Room...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Join Match Now
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};
