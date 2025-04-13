import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { useLocalStorage } from "@/stores/useLocalStorage";
import { useThemeStore } from "@/stores/useThemeStore";

const colors = [
  { name: "zinc", color: "#52525b" },
  { name: "slate", color: "#475569" },
  { name: "stone", color: "#57534e" },
  { name: "gray", color: "#4b5563" },
  { name: "neutral", color: "#525252" },
  { name: "red", color: "#dc2626" },
  { name: "rose", color: "#e11d48" },
  { name: "orange", color: "#ea580c" },
  { name: "green", color: "#22c55e" },
  { name: "blue", color: "#3b82f6" },
  { name: "yellow", color: "#facc15" },
  { name: "voilet", color: "#6d28d9" },
];

const Colors = () => {
  const { theme, setTheme } = useLocalStorage();
  const { updateVariable } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    updateVariable();
  }, [theme]);

  return (
    <div className="space-y-1.5">
      <Label>Color</Label>
      <div className="grid grid-cols-3 gap-2">
        {colors.map(({ name, color }) => (
          <Button
            key={name}
            variant="outline"
            className={`justify-center sm:justify-start
               ${theme === name ? "border-2 border-primary" : ""}
               `}
            onClick={() => setTheme(name)}
          >
            <span
              className="h-5 w-5 flex-shrink-0 flex items-center justify-center rounded-full relative"
              style={{ background: color }}
            >
              {theme === name && <Check />}
            </span>
            <span className="hidden xs:inline">
              {name[0].toUpperCase() + name.slice(1)}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Colors;
