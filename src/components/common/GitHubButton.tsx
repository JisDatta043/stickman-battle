"use client";

import React from "react";
import { Button } from "../ui/Button";
import { Github } from "lucide-react";

export const GitHubButton: React.FC = () => {
  return (
    <a
      href="https://github.com/JisDatta043/stickman-battle"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <Button variant="outline" size="sm">
        <Github className="w-4 h-4 text-slate-300" />
        <span>GitHub</span>
      </Button>
    </a>
  );
};
